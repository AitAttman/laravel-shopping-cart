<?php

namespace App\Data;

enum ProductStatus:int
{
    case PUBLISH = 1;
    case TRASH = 2;
    case DRAFT = 3;
    case PRIVATE = 4;
    public function label():string{
        return match($this){
            ProductStatus::PUBLISH => 'Publish',
            ProductStatus::TRASH => 'Trash',
            ProductStatus::DRAFT => 'Draft',
            ProductStatus::PRIVATE => 'Private',
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
