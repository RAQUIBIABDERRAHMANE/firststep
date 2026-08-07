<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            $table->uuid('tenant_id')->index();
            $table->string('order_number'); // Human-readable incremental receipt ID (e.g. REG1-0043)
            $table->uuid('sync_id')->nullable()->unique(); // Client-side generated UUID for offline sync idempotency
            $table->double('subtotal');
            $table->double('discount')->default(0.00);
            $table->double('tax')->default(0.00);
            $table->double('total');
            $table->string('status')->default('completed'); // pending, completed, cancelled, refunded
            $table->jsonb('items'); // Snapshotted items (dish name, price, modifications) to protect history
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('pos_sessions');
        });

        Schema::create('pos_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->string('method'); // cash, card, mobile, loyalty
            $table->double('amount');
            $table->jsonb('metadata')->nullable(); // Card transaction details, terminal response logs
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('pos_orders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_payments');
        Schema::dropIfExists('pos_orders');
    }
};
