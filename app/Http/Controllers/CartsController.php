<?php

namespace App\Http\Controllers;

use App\Data\CartStatus;
use App\Data\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CartsController extends Controller
{
    public static function Routes(){
        Route::prefix('cart')->middleware('auth')->group(function () {
            Route::get('/', [__CLASS__, 'viewCart'])->name('cart.view');
            Route::post('/', [__CLASS__, 'addItem'])->name('cart.add_item');
            Route::DELETE('/', [__CLASS__, 'deleteItem'])->name('cart.delete_item');
        });
        Route::prefix('checkout')->middleware('auth')->group(function () {
            Route::get('/', [__CLASS__, 'viewCheckout'])->name('checkout.view');
            Route::post('/', [__CLASS__, 'submitCheckout'])->name('checkout.post');
        });
    }
    public function viewCart(Request $request){
        $data = ['data' => null ];
        $user_id = auth()->user()->id;
        $carts = Cart::queryCarts(...[
            'user_id' => $user_id,
            'status' => CartStatus::ACTIVE->value,
            'limit' => 1,
            'page' => 1
        ]);
        $messageCartEmpty = 'Your cart is empty';
        if( !$carts ) {
            $data['message'] = $messageCartEmpty;
        } else {
            $cartInfo = $carts['data'][0];
            $data['meta']['sub_total'] = $cartInfo['sub_total'] ?? 0;
            $data['meta']['items_count'] = $cartInfo['items_count'] ?? 0;
            if( empty( $data['meta']['items_count'] ) ) {
                $data['message'] = $messageCartEmpty;
            } else {
                $args = [
                    'page' => ait_get_positive_int(  $request->get('page',1) ),
                    'cart_id' => $cartInfo['id'],
                ];
                $itemsData = Cart::cartItems( ...$args );
                if( $itemsData ){
                    $data['meta'] = array_merge( $data['meta'], $itemsData['meta'] );
                    $data['data'] = $itemsData['data'];
                }
            }
        }
        return Inertia::render('cart/CartIndex', $data );
    }
    /**
     * update or create cart item
     * create cart if not exist
     * @param Request $request
     * @return RedirectResponse
     */
    public function addItem(Request $request):RedirectResponse{
        $data = $request->only(['product_id', 'qty'] );
        if( !isset( $data['qty'] ) )
            $data['qty'] = 1;
        $validator = self::validateCartItem( $data );
        if(  $validator->fails() )
            return back()->withErrors([...$validator->errors()->all(), 'message' => $validator->errors()->first() ]);
        $currentCart = self::getCurrentUserCart( ['id'] );
        if( !$currentCart ){
            try {
                $currentCart = Cart::create([
                    'user_id' => auth()->id(),
                    'status' => CartStatus::ACTIVE->value,
                ]);
                $currentCart->refresh();
            } catch ( \Exception $e ) {
                return back()->withErrors( ['message' => 'Sorry, Something went wrong, try again later'] );
            }
        }
        $cartItem = CartItem::updateOrCreate(
            ['cart_id' => $currentCart->id , 'product_id' => $validator->valid()['product_id'] ],
            ['qty' => $validator->valid()['qty'] ]
        );
        if( $cartItem->wasRecentlyCreated )
            $message = 'Item added to cart successfully';
        else
            $message = 'Item has been updated successfully';
        return back()->with('flash' , ['message' => $message] );
    }

    /**
     * remove cart item
     * @param Request $request
     * @return RedirectResponse
     */
    public function deleteItem( Request $request ){
        $productId = $request->input('product_id');
        if( is_string( $productId ) && preg_match('/^[1-9]\d*$/', $productId ) )
            $productId = intval( $productId );
        $cartId = self::getCurrentUserCart( ['id'] )?->id;
        if( $cartId && is_int( $productId ) && $productId > 0 )
            $cartItem = CartItem::getItem( $cartId, $productId , ['id'] );
        if( isset( $cartItem ) && $cartItem->delete())
            return back()->with( ['flash' => ['message' => 'Item deleted successfully' ]] );
        return back()->withErrors( ['message' => 'Item is not the cart yet'] );
    }
    /**
     * display checkout page
     * @param Request $request
     * @return \Inertia\Response
     */
    public function viewCheckout(Request $request ): Response|RedirectResponse{
        $user_id = auth()->user()?->id;
        $result = Cart::queryCarts(...[
            'user_id' => $user_id,
            'status' => CartStatus::ACTIVE->value,
            'limit' => 1
        ]);
        $response = [];
        if( $result !== false ){
            $data = !empty( $result['data'] ) ? $result['data'][0] : null;
            $response['data'] = $data;
            $response['meta'] = $result['meta'];
        }
        $response['message'] = 'this is a message';
        return Inertia::render('checkout/CheckoutPage', $response);
    }
    /**
     * when use submits checkout, change cart status to pending and send message back
     * @param Request $request
     * @return RedirectResponse
     */
    public function submitCheckout(Request $request){
        $cart = self::getCurrentUserCart();
        if( !$cart || !Cart::hasItems($cart->id) )
            return back()->withErrors( ['message' => 'Your cart is empty'] );
        $cart->status = CartStatus::PENDING->value;
        $cart->save();
        return back()->with('flash', ['message' => 'Cart has been submitted successfully']);
    }
    public static function getCurrentUserCart( array $fields = ['*']):?Cart {
        $userId = auth()->user()?->id;
        if( $userId )
            return Cart::query()->where('user_id', $userId)->where('status', CartStatus::ACTIVE->value )->first( $fields );
        return null;
    }

    /**
     * validate product id and check if exists
     */
    public static function validateCartItem(array $data )  {
        return Validator::make($data, [
            'product_id' => ['required','integer' , 'gt:0', 'lte:99999999', Rule::exists('products', 'id')->where(function ($query) {
                $query->where('status', ProductStatus::PUBLISH->value );
            })],
            'qty' => ['integer', 'required', 'gte:1', 'lte:99999'],
        ], [
            'product_id.exists' => 'Invalid product ID',
            ], attributes: [
            'product_id' => 'Product ID',
            'qty' => 'Quantity',
        ]);
    }
}
