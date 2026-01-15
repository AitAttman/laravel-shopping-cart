<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'snippet',
        'content',
        'slug',
        'price',
        'price_regular',
        'status',
        'stock',
        'reserved_qty'
    ];

    public static function queryProducts(
        int    $page = 1,
        int    $limit = 10,
        string $order = 'asc',
        string $order_by = 'id',
        int    $status = 0,
    ): false|array
    {
        $query = self::query();
        if ($status > 0)
            $query->where('status', $status);
        $countQuery = clone $query;
        $offset = ($page - 1) * $limit;
        $results = $query->select('*')->orderBy($order_by, $order)->skip($offset)->take($limit)->get()?->map(function ($item) {
            $item = $item->toArray();
            $item['url'] = url('products/' . $item['slug'] );
            return $item;
        })?->toArray();
        if (!$results) return false;
        return ['data' => $results, 'meta' => [
            'count' => $countQuery->count(),
            'page' => $page,
            'limit' => $limit
        ]];
    }

    public static function getById(int $id, array $columns = ['*']): ?Product
    {
        return self::query()->where('id', $id)->first($columns);
    }

    public static function getBySlug(string $slug, array $columns = ['*']): ?Product
    {
        return self::query()->where('slug', $slug)->first($columns);
    }

    public static function slugExists(string $slug): bool
    {
        return self::query()->where('slug', $slug)->exists();
    }
    public static function idExists(int $id ): bool
    {
        return self::query()->where('id', $id)->exists();
    }
}
