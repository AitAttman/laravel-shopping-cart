<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'product_id',
        'cart_id',
        'qty'
    ];

    public static function getItem(int $cart_id, int $product_id,array $fields = ['*']): CartItem|null{
        return self::query()->where( 'product_id', $product_id )->where( 'cart_id', $cart_id )->first( $fields );
    }
}
