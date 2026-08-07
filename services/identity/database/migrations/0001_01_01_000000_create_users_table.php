<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('role')->default('CLIENT'); // ADMIN, CLIENT
            $table->boolean('is_active')->default(true);
            $table->string('recovery_email')->nullable();
            $table->jsonb('recovery_codes')->default('[]'); // Hashed backup codes
            $table->timestamps();
        });

        Schema::create('user_2fa_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email');
            $table->string('code_hash');
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['email', 'expires_at']);
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_2fa_codes');
        Schema::dropIfExists('sessions');
    }
};
