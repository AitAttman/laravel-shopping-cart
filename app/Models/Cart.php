<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'status',
    ];
    public static function cartItems(
        int $cart_id,
        int $page = 1,
        int $limit = 10,
        string $order_by = 'id',
        string $direction = 'asc'
    ): false|array{
        $select = ['cart_items.*', 'products.price', 'products.name' , 'products.slug'];
        $query = self::query()->leftJoin('cart_items', 'cart_items.cart_id', '=', 'carts.id');
        $query->leftJoin('products', 'products.id', '=', 'cart_items.product_id');
        $query->where('carts.id', $cart_id);
        $offset = ($page - 1) * $limit;
        $query->select($select)->orderBy('cart_items.' . $order_by, $direction);
        $countQuery = clone $query;
        $count = $countQuery->count('cart_items.id');
        if( !$count )
            return false;
        $result = $query->take($limit)->offset($offset)->get()?->map(function ($item) {
            $item = $item->toArray();
            $item['url'] = route('product.view' , ['slug' => $item['slug'] ?? '']);
            return $item;
        })?->toArray();
        $response = [
            'data' => $result,
            'meta' => [
                'count' => $count,
                'page' => $page,
                'limit' => $limit,
            ]
        ];
        if( !$result ){
            $response['message'] = 'No more items found';
        }
        return $response;
    }

    /**
     * check if a give cart has items
     * @param int $cart_id
     * @return bool
     */
    public static function hasItems(int $cart_id ):bool {
        return $cart_id && CartItem::query()->where('cart_id', $cart_id)->exists();
    }
    public static function queryCarts(
        int $cart_id = 0,
        int $page = 1,
        int $limit = 10,
        string $order_by = 'id',
        string $order = 'asc',
        int $status = 0,
        int $user_id = 0
    ){
        $prefix = DB::getTablePrefix();
        $query = self::query()->leftJoin('cart_items', 'cart_items.cart_id', '=', 'carts.id');
        $query->leftJoin('products', 'products.id', '=', 'cart_items.product_id');
        $query->leftJoin('users', 'users.id', '=', 'carts.user_id');
        $select = [
            'carts.id',
            'carts.user_id',
            'carts.status',
            'carts.created_at',
            'carts.updated_at',
            'users.name as user_name',
        ];
        $select[] = DB::raw(sprintf('COALESCE(SUM(%1$s.qty * %2$s.price ), 0) as sub_total', $prefix . 'cart_items' , $prefix . 'products'));
        $select[] = DB::raw(sprintf('count(%1$s.id) as items_count', $prefix . 'cart_items'));
        if( $cart_id > 0 )
            $query->where('carts.id' , $cart_id );
        if( $status > 0 )
            $query->where('carts.status' , $status );
        if( $user_id > 0 )
            $query->where('carts.user_id' , $user_id );
        $countQuery = clone $query;
        $count = $countQuery->count('carts.id');
        $query->groupBy( 'carts.id' );
        if( !$count ) return false;
        $offset = ($page - 1) * $limit;
        $result = $query->select( $select )->take($limit)->offset($offset)->orderBy($order_by , $order )->get()?->map(function ($item) {
            return $item->toArray();
        })?->toArray();
        return [
            'data' => $result,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'count' => $count,
            ]
        ];
    }
}
