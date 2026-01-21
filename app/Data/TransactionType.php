<?php

namespace App\Data;

enum TransactionType: int
{
    case ORDER = 1;
    case PURCHASE = 2;
    case ORDER_RETURN = 3;
    case PURCHASE_RETURN = 4;

    public static function exists(int $value): bool
    {
        return self::tryFrom($value) !== null;
    }

    public static function getArray(): array
    {
        $data = [];
        foreach (self::cases() as $case) {
            $data[$case->value] = $case->label();
        }
        return $data;
    }

    public function label(): string
    {
        return match ($this) {
            self::ORDER => 'Order',
            self::PURCHASE => 'Purchase',
            self::ORDER_RETURN => 'Order Return',
            self::PURCHASE_RETURN => 'Purchase Return',
            default => ''
        };
    }
}
