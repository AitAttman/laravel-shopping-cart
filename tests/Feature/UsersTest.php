<?php


use App\Http\Controllers\CartsController;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class UsersTest extends TestCase
{

    public function test_insertUsers(){
        $users = \App\Models\User::factory()->count(30)->create();
        $this->assertCount(30, $users);
    }

}
