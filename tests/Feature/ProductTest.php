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

    public function test_insertProducts(){
        $products = Product::factory()->count(20)->create();
        $this->assertCount(20, $products);
    }

}
