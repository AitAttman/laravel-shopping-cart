<?php

namespace App\Http\Controllers;

use App\Data\ProductStatus;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public static function Routes(): void
    {
        Route::prefix('admin/products')->middleware('auth.admin')->group(function () {
            Route::get('/', [__CLASS__, 'adminIndex'])->name('products.index');
            Route::post('/', [__CLASS__, 'create'])->name('products.create');
            Route::get('/new', [__CLASS__, 'edit'])->name('products.edit');
            Route::prefix('{productId}')->where(['productId' => '^[1-9]\d*$'])->group(function () {
                Route::get('edit', [__CLASS__, 'edit'])->name('product.edit');
                Route::post('/', [__CLASS__, 'create'])->name('product.update');
                Route::post('/trash', [__CLASS__, 'moveProductToTrash'])->name('product.to_trash');
            });
        });
        Route::prefix('products')->group(function () {
            Route::get('/', [__CLASS__, 'productsPublicIndex'])->name('products.public.index');
            Route::get('/{slug}', [__CLASS__, 'viewProduct'])->where(['slug' => '^[a-z0-9-_]+$'])->name('product.view');
        });
    }

    public function moveProductToTrash(Request $request, int $productId)
    {
        $product = Product::getById($productId, ['id', 'status']);
        if (!$product)
            return back()->withErrors(['message' => 'Product does not exist']);
        $product->status = ProductStatus::TRASH->value;
        $product->save();
        return back()->with('flash', ['message' => 'Product moved to trash successfully']);
    }

    public function productsPublicIndex(Request $request): Response
    {
        $page = ait_get_positive_int($request->get('page', 1)) ?: 1;
        $args = [
            'page' => $page,
            'limit' => ait_get_positive_int($request->get('limit', 10)) ?: 10,
            'status' => ProductStatus::PUBLISH->value,
            'order' => ait_to_string($request->get('order', 'desc')),
            'order_by' => ait_to_string($request->get('order_by', 'id'))
        ];
        $response = [];
        $result = Product::queryProducts(...$args);
        if( $result ) {
            $response = $result;
            if( !$response['data'] )
                $response['message'] = 'No more products found';
        } else {
                $response['message'] = 'No products found';
        }
        return Inertia::render('Products/Index', $response);
    }

    public function viewProduct(Request $request, string $slug)
    {

        $product = Product::getBySlug($slug);
        if (!$product) {
            abort(404, 'Product not found');
        }
        $product->thumbnail_url = $product->getThumbnailUrl();
        unset($product->thumbnail_path);
        unset($product->slug);
//        dd( $product );

        return Inertia::render('Products/ViewProduct', ['product' => $product]);
    }

    public function adminIndex(Request $request): Response
    {
        $page = ait_get_positive_int($request->get('page', 1)) ?: 1;
        $args = [
            'page' => $page,
            'limit' => ait_get_positive_int($request->get('limit', 10)) ?: 10,
            'status' => ait_get_positive_int($request->get('status', 0)) ?: 0,
            'order' => ait_to_string($request->get('order', 'desc')),
            'order_by' => ait_to_string($request->get('order_by', 'id'))
        ];
        if ($search = $request->get('search')) {
            $args['search'] = trim($search) |> strtolower(...);
        }
        $response = [];
        $result = Product::queryProducts(...$args);
        if ($result) {
            $response = $result;
            if (empty($response['data']))
                $response['message'] = 'No more items found';
        } else {
            $response['message'] = 'No items found';
        }
        return Inertia::render('admin/products/Index', $response);
    }

    public function edit(Request $request, int $productId = 0): Response
    {
        $response = [];
        if ($productId > 0) {
            $product = Product::getById($productId);
            if (!$product)
                $response['error_message'] = 'Product does not exist';
            else {
                $product->thumbnail_url = $product->getThumbnailUrl();
                $response['data'] = $product;
            }
        }
        return Inertia::render('admin/products/EditProduct', $response);
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
            if (!$product) {
                Inertia::flash([
                    'error' => 'Product does not exist.',
                ]);
                return back();
            }
        }
        $inputs = $request->input();
        if ($request->hasFile('thumbnail_file')) {
            $inputs['thumbnail_file'] = $request->file('thumbnail_file');
        }

        $validator = self::validateProduct($inputs, $product ?? null);
        if ($validator->fails()) {
            return back()->withErrors($validator->errors())->withInput();
        } else {
            $data = $validator->valid();
            if (!empty($data['thumbnail_file'])) {
                $originalFileName = pathinfo($data['thumbnail_file']->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $data['thumbnail_file']->getClientOriginalExtension();
                // check if file already exists and change its name
                $i = 1;
                $filename = $originalFileName;
                while (Storage::disk('public')->exists('products/' . $filename . '.' . $extension)) {
                    $filename = $originalFileName . '-' . $i;
                    $i++;
                }
                // save thumbnail file in storage/public/products
                $publicPath = Storage::disk('public')->putFileAs('products', $data['thumbnail_file'], $filename . '.' . $extension);
                if (!$publicPath)
                    return back()->withErrors(['thumbnail_file' => 'Thumbnail file could not be uploaded.']);
                $data['thumbnail_path'] = $publicPath;
            }
            if (isset($data['thumbnail_file']))
                unset($data['thumbnail_file']);
            if (!$product && empty($data['slug']))
                $data['slug'] = Str::slug($data['name']);
            if ($product && !empty($data['slug']) && $data['slug'] === $product->slug)
                unset($data['slug']);
            if (!empty($data['slug']))
                $data['slug'] = self::verifySlug($data['slug']);

            if (isset($product)) {
                if (!$product->update($data))
                    return back()->withErrors(['error' => 'could not update product'])->withInput();
                $message = 'Product updated successfully';
            } else {
                try {
                    $product = Product::create($data);
                    $message = 'Product created successfully';
                } catch (\Exception $e) {
                    return back()->withErrors(['error' => $e->getMessage()])->withInput();
                }
            }
        }
        Inertia::flash(['message' => $message, 'data' => $product]);
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
            'thumbnail_file' => ['file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'thumbnail_path' => ['string', 'nullable', 'max:150'],
            'slug' => 'max:100|string|nullable',
            'price' => implode('|', $rules['price']),
            'price_regular' => 'decimal:0,2|max:10000|nullable',
            'status' => ['integer', 'max:2'],
            'stock_quantity' => ['integer', 'max:999999999'],
        ], attributes: [
            'name' => 'product name',
            'snippet' => 'Snippet',
            'thumbnail_file' => 'Thumbnail file',
            'stock_quantity' => 'Stock quantity',
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
