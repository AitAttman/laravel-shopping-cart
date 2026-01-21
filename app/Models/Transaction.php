<?php

namespace App\Models;

use App\Data\TransactionStatus;
use App\Data\TransactionType;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $fillable = [
        'user_id',
        'type',
        'status',
    ];

    public static function queryTransactions(
        int    $id = 0,
        int    $page = 1,
        int    $limit = 10,
        string $order = 'desc',
        string $order_by = 'id',
        int    $type = 0,
        int    $status = 0,
        int    $user_id = 0,
    ): false|array
    {
        $query = self::query()->leftJoin('users', 'users.id', '=', 'transactions.user_id');
        $select = [
            'transactions.*',
            'users.name as user_name',
            'users.email',
        ];
        if ($id > 0)
            $query->where('transactions.id', $id);
        if ($type > 0)
            $query->where('transactions.type', $type);
        if ($status > 0)
            $query->where('transactions.status', $status);
        if ($user_id > 0)
            $query->where('transactions.user_id', $user_id);
        $count = (clone $query)->count('transactions.id');
        if (!$count) return false;
        $response = [
            'page' => $page,
            'limit' => $limit,
            'count' => $count,
        ];
        $offset = ($page - 1) * $limit;
        if (strtolower($order) !== 'asc')
            $order = 'desc';
        if (!in_array($order_by, ['id', 'created_at', 'updated_at'])) {
            $order_by = 'id';
        }
        $result = $query->select($select)->orderBy('transactions.' . $order_by, $order)->offset($offset)->take($limit)->get()?->map(function ($item) {
            $item = $item->toArray();
            $item['status_label'] = TransactionStatus::tryFrom($item['status'] ?? 0)?->label() ?? '';
            $item['type_label'] = TransactionType::tryFrom($item['type'] ?? 0)?->label() ?? '';
            $item['date'] = new \DateTime($item['created_at'])->format('d/m/Y H:i');
            return $item;
        })?->toArray();
        $response['data'] = $result ?? null;
        return $response;
    }
}
