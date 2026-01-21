<?php

namespace App\Http\Controllers;

use App\Data\TransactionStatus;
use App\Data\TransactionType;
use App\Jobs\ProductRunningLow;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use mysql_xdevapi\Exception;

class AdminCartsController extends CartsController
{
    public static function Routes()
    {
        Route::prefix('admin/carts')->middleware('auth.admin')->group(function () {
            Route::get('/', [__CLASS__, 'cartsIndex'])->name('admin.carts.index');
            Route::prefix('{cartId}')->group(function () {
                Route::post('/make-order', [__CLASS__, 'makeOrder'])->name('admin.carts.make_order');
                Route::delete('/', [__CLASS__, 'destroyCart'])->name('admin.carts.destroy_cart');
            });
        });
    }

    public function destroyCart(Request $request, int $cartId): RedirectResponse
    {
        $cart = Cart::find($cartId);
        if (!$cart)
            return Inertia::back()->withErrors(['message' => 'Cart not found']);
        if (!$cart->clearItems())
            return Inertia::back()->withErrors(['message' => 'Cart items not deleted']);
        $cart->delete();
        Inertia::flash('message', "Cart has been deleted successfully");
        return Inertia::back();
    }

    /**
     * convert cart into order
     * @param Request $request
     * @param int $cartId
     * @return RedirectResponse
     */
    public function makeOrder(Request $request, int $cartId): RedirectResponse
    {
        $cart = Cart::find($cartId);
        if (!$cart)
            return back()->withErrors(['message' => 'Cart not found']);
        try {
            $order = Transaction::create([
                'user_id' => $cart->user_id,
                'status' => TransactionStatus::PUBLISH->value,
                'type' => TransactionType::ORDER->value,
            ]);
        } catch (Exception $exception) {
            return back()->withErrors(['message' => 'Could not create order']);
        }
        $items = CartItem::query()->select(['cart_items.*', 'products.name', 'products.stock_quantity', 'products.price'])->where('cart_id', $cartId)->leftJoin('products', 'products.id', '=', 'cart_items.product_id')->get();
        $failedItems = [];
        foreach ($items as $item) {
            Product::getById($item->product_id, ['id', 'stock_quantity'])->update(['stock_quantity' => $item->qty]);
            $stockQuantity = $item->stock_quantity;
            // check if qty is in stock
            if (($stockQuantity > 0) && $item->qty > $stockQuantity) {
                // update item quantity to match stock quantity
                $item->qty = $stockQuantity;
            }
            $stockQuantity = $stockQuantity - $item->qty;
            // update stock qty
            Product::query()->where('id', $item->product_id)->update(['stock_quantity' => max($stockQuantity, 0)]);
            if ($stockQuantity < 5) {
                // email the admin about this product stock qty
                $product = new Product()->forceFill([
                    'id' => $item->product_id,
                    'stock_quantity' => $stockQuantity,
                    'name' => $item->name,
                ]);
                ProductRunningLow::dispatch($product);
            }
            try {
                TransactionItem::create([
                    'transaction_id' => $order->id,
                    'product_id' => $item->product_id,
                    'qty' => $item->qty,
                    'price' => $item->price,
                ]);
            } catch (Exception $exception) {
                $failedItems[] = $item->product_id;
            }
        }
        // clear cart items
        if ($cart->clearItems()) {
            // then destroy the cart
            $cart->delete();
        }
        Inertia::flash([
            'data' => $order,
            'message' => 'Order created successfully',
        ]);
        return back();
    }

    public function cartsIndex(Request $request)
    {
        $result = Cart::queryCarts(...[
            'page' => ait_get_positive_int($request->get('page', 1)),
            'status' => ait_get_positive_int($request->get('status', 0)),
        ]);
        if (!$result)
            $result = ['message' => 'No carts found'];
        elseif (!$result['data'])
            $result['message'] = 'No more carts found';
        return Inertia::render('admin/carts/CartsIndex', $result);
    }
}
