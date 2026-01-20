<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'snippet',
        'content',
        'slug',
        'thumbnail_path',
        'price',
        'price_regular',
        'status',
        'stock',
        'reserved_qty'
    ];
    protected $casts = [
        'price' => 'float',
        'price_regular' => 'float',
        'status' => 'integer',
        'stock' => 'integer',
        'reserved_qty' => 'integer'
    ];

    public static function queryProducts(
        int    $page = 1,
        int    $limit = 10,
        string $order = 'asc',
        string $order_by = 'id',
        int    $status = 0,
        string $search = ''
    ): false|array
    {
        $query = self::query();
        if ($status > 0)
            $query->where('status', $status);
        if( !empty( $search ) ) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        $countQuery = clone $query;
        $count = $countQuery->count();
        if( !$count ) return false;
        $offset = ($page - 1) * $limit;
        $results = $query->select('*')->orderBy($order_by, $order)->skip($offset)->take($limit)->get()?->map(function ($item) {
            $item = $item->toArray();
            $item['url'] = url('products/' . $item['slug'] );
            $item['thumbnail_url'] = Product::getProductThumbnailUrl( $item['thumbnail_path'] ?? '' );
            return $item;
        })?->toArray();
        return ['data' => $results, 'meta' => [
            'count' => $count,
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
    public static function getProductThumbnailUrl( string $path ): string{
        if( $path )
            return asset('images/' . $path );
        return asset( 'assets/images/noimage.svg');
    }
    public function getThumbnailUrl():string {
        return self::getProductThumbnailUrl( $this->thumbnail_path ?? "" );
    }
}
