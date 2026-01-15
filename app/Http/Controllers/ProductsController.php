<?php

namespace App\Http\Controllers;

use App\Data\ProductStatus;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public static function Routes(): void
    {
        Route::prefix('admin/products')->group(function () {
            Route::get('/', [__CLASS__, 'adminIndex'])->name('products.index');
            Route::post('/', [__CLASS__, 'create'])->name('products.create');
            Route::get('/new', [__CLASS__, 'edit'])->name('products.edit');
            Route::prefix('{productId}')->where(['productId' => '^[1-9]\d*$'])->group(function () {
                Route::get('edit', [__CLASS__, 'edit'])->name('product.edit');
                Route::post('/', [__CLASS__, 'create'])->name('product.update');
            });
        });
        Route::prefix('products')->group(function () {
            Route::get('/', [__CLASS__, 'productsPublicIndex'])->name('products.public.index');
            Route::get('/{slug}', [__CLASS__, 'viewProduct'])->where(['slug' => '^[a-z0-9-_]+$'])->name('product.view');
        });
    }
    public function productsPublicIndex(Request $request): Response {
        $page = ait_get_positive_int( $request->get('page', 1) ) ?: 1;

        $args = [
            'page' => $page,
            'limit' => ait_get_positive_int( $request->get('limit', 10) ) ?: 10,
            'status' => ProductStatus::PUBLISH->value,
            'order' => ait_to_string( $request->get('order', 'desc' ) ),
            'order_by' => ait_to_string( $request->get('order_by', 'id' ) )
        ];
        $result = Product::queryProducts(...$args);
        if( !$result )
            $result = ['message' => $page > 1 ? 'No more products found': 'No products found.'];
        return Inertia::render('Products/Index', $result );
    }
    public function viewProduct(Request $request, string $slug)
    {

        $product = Product::getBySlug($slug);
        if (!$product) {
            abort(404, 'Product not found');
        }

        return Inertia::render('Products/ViewProduct', ['product' => $product]);
    }

    public function adminIndex(): Response
    {
        return Inertia::render('Products/Admin/Index', []);
    }

    public function edit(Request $request, int $productId = 0): Response
    {
        return Inertia::render('Products/Admin/EditProduct');
    }

    /**
     * create or update a product
     * @param Request $request
     * @param int $productId
     * @return RedirectResponse
     */
    public function create(Request $request, int $productId = 0)
    {
        $product = null;
        if ($productId > 0) {
            $product = Product::getById($productId);
            if (!$product)
                Inertia::flash([
                    'error' => 'Product does not exist.',
                ]);
            return back();
        }
        $validator = self::validateProduct($request->input(), $product ?? null);
        if ($validator->fails()) {
            return back()->withErrors($validator->errors())->withInput();
        } else {
            $data = $validator->valid();
            if (!$product && empty($data['slug']))
                $data['slug'] = Str::slug($data['name']);
            if ($product && !empty($data['slug']) && $data['slug'] === $product->slug)
                unset($data['slug']);
            if (!empty($data['slug']))
                $data['slug'] = self::verifySlug($data['slug']);

            if (isset($product)) {
                if (!$product->update($data))
                    return back()->withErrors(['error' => 'could not update product'])->withInput();
                $message = 'Product created successfully';
            } else {
                try {
                    $product = Product::create($data);
                    $message = 'Product created successfully';
                } catch (\Exception $e) {
                    return back()->withErrors(['error' => $e->getMessage()])->withInput();
                }
            }
        }
        Inertia::flash(['product' => $product, $message]);
        return back();
    }

    public function validateProduct(array $data, ?Product $product = null): \Illuminate\Validation\Validator
    {
        $rules = [
            'name' => ['max:150|string'],
            'price' => ['decimal:0,2|max:10000'],
        ];
        if (!$product) {
            $rules['name'][] = 'required';
            $rules['price'][] = 'required';
        }
        if (!empty($data['slug']) && is_string($data['slug'])) {
            $data['slug'] = Str::slug($data['slug']);
        }
        return Validator::make($data, [
            'name' => implode('|', $rules['name']),
            'snippet' => 'max:200|string|nullable',
            'content' => 'string|nullable',
            'slug' => 'max:100|string|nullable',
            'price' => implode('|', $rules['price']),
            'price_regular' => 'decimal:0,2|max:10000|nullable',
            'status' => 'integer:strict,max:2',
        ], attributes: [
            'name' => 'product name',
            'snippet' => 'Snippet',
            'content' => 'Content',
            'slug' => 'Product Slug',
            'price' => 'Price',
            'price_regular' => 'Regular Price',
        ]);
    }

    /**
     * verify product slug, slug must be unique
     * @param string $slug
     * @return string
     */
    public static function verifySlug(string $slug): string
    {
        $newSlug = mb_substr($slug, 0, 100);
        $i = 2;
        while (Product::slugExists($newSlug)) {
            $newSlug = mb_substr($slug, 0, 98) . '-' . $i;
            $i++;
        }
        return $newSlug;
    }
}
