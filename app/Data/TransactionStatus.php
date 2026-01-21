<?php

namespace App\Data;

enum TransactionStatus: int
{
    case PUBLISH = 1;
    case DRAFT = 2;
    case TRASH = 3;

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
            self::PUBLISH => 'Publish',
            self::DRAFT => 'Draft',
            self::TRASH => 'Trash',
            default => ''
        };
    }
}
