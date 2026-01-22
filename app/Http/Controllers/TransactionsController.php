<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class TransactionsController extends Controller
{
    public static function Routes(): void
    {
        Route::prefix('admin/transactions')->middleware('auth.admin')->group(function () {
            Route::get('/', [__CLASS__, 'transactionsIndex'])->name('admin.transactions.index');
        });
    }

    public function transactionsIndex(Request $request)
    {
        $args = [
            'page' => ait_get_positive_int($request->get('page', 1)),
            'type' => ait_get_positive_int($request->get('type', 0)),
            'status' => ait_get_positive_int($request->get('status', 0)),
            'user_id' => ait_get_positive_int($request->get('userId', 0)),
            'order' => ait_to_string( $request->get('order', 'desc')),
        ];
        $response = [];
        $result = Transaction::queryTransactions(...$args);
        if ($result)
            $response = $result;
        return Inertia::render('admin/transactions/TransactionsIndex', $response);
    }
}
