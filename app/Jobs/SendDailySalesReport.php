<?php

namespace App\Jobs;

use App\Mail\DailySalesReportMail;
use App\Models\TransactionItem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $prefix = DB::getTablePrefix();
        $today = \Illuminate\Support\now()->toDateString();
        $query = TransactionItem::query();
        $query->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id');
        $query->join('products', 'products.id', '=', 'transaction_items.product_id');
        $query->whereDate('transactions.created_at', $today);
        $query->groupBy('products.id');
        $query->select(
            'transaction_items.product_id',
            'products.name as product_name',
            DB::raw(sprintf('SUM(%1$s.qty) as total_qty', $prefix . 'transaction_items')),
            DB::raw(sprintf('SUM(%1$s.qty * %2$s.price) as total', $prefix . 'transaction_items', $prefix . 'products')),
        );
        $sales = $query->get();
        if (!$sales) return;
        $adminEmail = config('mail.admin_email');
        if (!$adminEmail) return;
        Mail::to($adminEmail)->send(new DailySalesReportMail($sales, \Illuminate\Support\now()->format('d/m/Y')));
    }
}
