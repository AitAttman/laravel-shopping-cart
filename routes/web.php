<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
\App\Http\Controllers\ProductsController::Routes();
\App\Http\Controllers\CartsController::Routes();
\App\Http\Controllers\AdminCartsController::Routes();
\App\Http\Controllers\TransactionsController::Routes();
require __DIR__ . '/settings.php';
