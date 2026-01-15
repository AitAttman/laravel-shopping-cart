<?php


use App\Http\Controllers\CartsController;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CartTest extends TestCase
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
    public static function currentUser(): \App\Models\User{
        return \App\Models\User::first();
    }
    public function test_addCartItem(){
        $this->withoutExceptionHandling();
        $response = $this->actingAs(self::currentUser())->post('/cart', [
            'product_id' => 232,
            'qty' => 1
        ]);
        $response->dumpSession();
        $response->assertStatus(302);
        /*
        $this->assertDatabaseHas('cart_items', [
            'product_id' => 2,
            'qty' => 2
        ]);
        */
    }

}
