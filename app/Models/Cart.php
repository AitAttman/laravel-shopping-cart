<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
