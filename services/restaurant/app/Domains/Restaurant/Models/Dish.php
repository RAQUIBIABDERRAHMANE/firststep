<?php

namespace App\Domains\Restaurant\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dish extends Model
{
    use HasUuids;

    protected $table = 'restaurant_dishes';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'image_url',
        'is_active',
        'sort_order',
        'options',
        'addons'
    ];

    protected $casts = [
        'price' => 'double',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'options' => 'array',
        'addons' => 'array'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
