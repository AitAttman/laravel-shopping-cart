<?php

namespace Tests\Feature;

use App\Http\Controllers\CartsController;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductTest extends TestCase
{
//    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/dashboard');
        $response->assertFound();
    }

    public function test_product(): void{
        return;
        try {
        $product = Product::create([
            'name' => "Product 4",
            'slug' => Str::slug("Lorem ipsum dolor sit amet"),
            "price" => "12",
            "price_regular" => "16"
        ]);
        $product?->refresh();
        dump($product?->toArray());
        $this->assertDatabaseHas('products', ['id' => $product?->id ] );
        } catch (\Throwable $th) {
            $this->fail($th->getMessage());
        }
    }
    public function test_insertProducts(){
        $products = Product::factory()->count(20)->create();
        $this->assertCount(20, $products);
    }

}
