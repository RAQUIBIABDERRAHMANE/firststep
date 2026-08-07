<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_registers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index(); // Tenant website isolation key
            $table->uuid('location_id')->index(); // Location reference
            $table->string('name');
            $table->string('device_identifier')->unique(); // Unique hardware ID or UUID
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('register_id');
            $table->uuid('cashier_id'); // Cashier user UUID reference
            $table->double('opening_float'); // Starting cash balance (MAD)
            $table->double('closing_float')->nullable(); // Expected closing cash balance
            $table->double('actual_cash_counted')->nullable(); // Actual cash counted on close
            $table->string('status')->default('open'); // open, closed, auditing
            $table->text('notes')->nullable();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->foreign('register_id')->references('id')->on('pos_registers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_sessions');
        Schema::dropIfExists('pos_registers');
    }
};
