<?php
if (!function_exists('ait_format_currency')) {
    function ait_format_currency($value, $decimals = 2, $separator = ",", $thousands_separator = ' ', $symbol = ""): string
    {
        if (!is_numeric($value)) {
            if (!is_string($value)) $value = 0;
            else $value = (float)$value;
        }
        $value = number_format($value, $decimals, $separator, $thousands_separator);
        return $symbol ? $value . ' ' . $symbol : $value;
    }
}
if (!function_exists('ait_to_string')) {
    /**
     * convert any value to string
     */
    function ait_to_string($value): string
    {
        if (is_string($value)) {
            return $value;
        }
        if (is_array($value)) {
            return json_encode($value);
        } elseif (is_object($value)) {
            return method_exists($value, '__toString') ? (string)$value : json_encode($value);
        } elseif (is_null($value)) {
            return '';
        } elseif (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return (string)$value;
    }
}
if (!function_exists('ait_to_boolean')) {
    /**
     * convert any value to boolean
     */
    function ait_to_boolean($value): bool
    {
        // Normalize strings
        if (is_string($value)) {
            $value = strtolower(trim($value));
            if (in_array($value, ['false', '0', 'no', 'off', 'null', ''], true)) {
                return false;
            }

            return true;
        }

        return (bool)$value;
    }
}
if (!function_exists('ait_to_int')) {
    function ait_to_int($value, bool $unsigned = true): int
    {
        if (!is_int($value)) {
            $value = ait_to_string($value);
            if (!preg_match('/^-?\d+$/', $value)) {
                return 0;
            }
        }
        $value = (int)$value;
        if ($unsigned && $value < 0) {
            $value = abs($value);
        }

        return $value;
    }
}
if (!function_exists('ait_is_date')) {
    /**
     * check if date is valid
     *
     * @param string $format use 'Y-m-d' format for db
     */
    function ait_is_date($date, string $format = 'Y-m-d'): bool
    {
        $date = ait_to_string($date);
        $dt = DateTime::createFromFormat($format, $date);

        return $dt && $dt->format($format) === $date;
    }
}
if (!function_exists('ait_sanitize_path')) {
    /**
     * remove consecutive slashes in a path
     */
    function ait_sanitize_path(string $path): string
    {
        return preg_replace('#/+#', '/', $path);
    }
}
if (!function_exists('ait_random_digits_code')) {
    function ait_random_digits_code(int $length = 4): string
    {
        $max = pow(10, $length) - 1;

        return sprintf('%0' . $length . 'd', rand(0, $max));
    }
}
if (!function_exists('ait_get_int')) {
    /** convert given value to int */
    function ait_get_int($value, ?bool $unsigned = null, ?int $min = null, ?int $max = null): int
    {
        if (is_null($value) || empty($value)) {
            $value = 0;
        } elseif (is_string($value)) {
            $value = (int)$value;
        } elseif (!is_numeric($value)) {
            $value = 0;
        }
        if (!is_null($min) && $value < $min) {
            $value = $min;
        }
        if (!is_null($max) && $value > $max) {
            $value = $max;
        }
        if (!is_null($unsigned) && (($unsigned && $value < 0) || (!$unsigned && $value > 0))) {
            $value = 0;
        }

        return $value;
    }
}
if (!function_exists('ait_get_positive_int')) {
    /** convert given value to positive int
     * @uses ait_get_int()
     * */
    function ait_get_positive_int($value, ?int $min = null, ?int $max = null): int
    {
        return ait_get_int($value, true, $min, $max);
    }
}
