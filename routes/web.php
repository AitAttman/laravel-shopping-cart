<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
Route::get('/hello', function () {
    return Inertia::render('tests/Hello', [
        'email' => request('email', 'no email'),
    ]);
});
Route::get('/test', function () {
    dd( auth()->user() );
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard',[
            "theNeName" => "Ahmed ait"
        ]);
    })->name('dashboard');
});
\App\Http\Controllers\ProductsController::Routes();
\App\Http\Controllers\CartsController::Routes();
require __DIR__.'/settings.php';
