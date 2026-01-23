<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->text(120),
            'price' => $this->faker->numberBetween(9,200 ),
            'price_regular' => $this->faker->numberBetween(9,300 ),
            'slug' => $this->faker->slug(),
            'snippet' => $this->faker->text(150),
            'content' => $this->faker->text(500),
            'status' => 1,
            'stock_quantity' => 100,
        ];
    }
}
