<?php

namespace App\Data;

enum CartStatus:int
{
    case ACTIVE = 1;
    case PENDING = 2;
    case COMPLETED = 3;
    case ABANDONED = 4;
    public function label():string{
        return match($this){
            CartStatus::ACTIVE => 'Active',
            CartStatus::PENDING => 'Pending',
            CartStatus::COMPLETED => 'Completed',
            CartStatus::ABANDONED => 'Abandoned',
            default => ''
        };
    }
    public static function exists( int $value ): bool {
        return self::tryFrom( $value ) !== null;
    }
    public static function getArray():array{
        $data = [];
        foreach (self::cases() as $case) {
            $data[$case->value] = $case->label();
        }
        return $data;
    }
}
