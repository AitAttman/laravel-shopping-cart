<?php

namespace App\Jobs;

use App\Mail\ProductStockLowEmail;
use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class ProductRunningLow implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Product $product)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $adminEmail = config('mail.admin_email');
        if (!$adminEmail) return;
        Mail::to($adminEmail)->send(new ProductStockLowEmail($this->product));
    }
}
