<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150)->nullable(false);
            $table->decimal('price', 10, 2)->nullable(false)->default(1);
            $table->decimal('price_regular', 10, 2)->nullable();
            $table->text('snippet')->nullable();
            $table->longText('content')->nullable();
            $table->string('slug', 100)->nullable(false)->unique();
            $table->string('thumbnail_path', 150)->nullable();
            $table->unsignedTinyInteger('status')->default(1);
            $table->unsignedMediumInteger('stock_quantity')->default(0)->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
