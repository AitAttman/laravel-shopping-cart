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
    public static function currentUser( $id = 1 ): \App\Models\User{
        return \App\Models\User::find($id );
    }
    public function test_addCartItem(){
        $this->withoutExceptionHandling();
        $response = $this->actingAs(self::currentUser(12))->post('/cart', [
            'product_id' => 20,
            'qty' => 6
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
    public function test_carts_query(){
        $carts = \App\Models\Cart::queryCarts();
        dump( $carts );
        $this->assertNotEmpty( $carts );
    }
    public function test_php(){
        $path = '/path/to/file/image-1.jpg';
        $uri = new Uri( $path );
        dump( pathinfo( $path ));
        $this->assertEquals(true , $uri->value());
    }
}
