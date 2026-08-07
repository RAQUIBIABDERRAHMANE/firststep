<?php

namespace App\Domains\Restaurant\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasUuids;

    protected $table = 'restaurant_categories';

    protected $fillable = [
        'tenant_id',
        'name',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function dishes(): HasMany
    {
        return $this->hasMany(Dish::class, 'category_id');
    }
}
