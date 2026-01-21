<?php

namespace App\Data;

enum UserRole: int
{
    case SUBSCRIBER = 1;
    case CUSTOMER = 2;
    case SUPPLIER = 3;
    case ADMIN = 10;

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
            self::SUBSCRIBER => 'Subscriber',
            self::ADMIN => 'Admin',
            self::CUSTOMER => 'Customer',
            self::SUPPLIER => 'Supplier',
            default => ''
        };
    }
}
