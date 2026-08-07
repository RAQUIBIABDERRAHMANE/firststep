<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index(); // Tenant website isolation key
            $table->string('name');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('restaurant_dishes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->double('price'); // Price in local currency (MAD)
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->jsonb('options')->default('[]'); // Customizable choices (e.g. spiciness)
            $table->jsonb('addons')->default('[]'); // Extra additions
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('restaurant_categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_dishes');
        Schema::dropIfExists('restaurant_categories');
    }
};
