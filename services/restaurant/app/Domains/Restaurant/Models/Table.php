<?php

namespace App\Domains\Restaurant\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Table extends Model
{
    use HasUuids;

    protected $table = 'restaurant_tables';

    protected $fillable = [
        'tenant_id',
        'number',
        'capacity',
        'is_active'
    ];

    protected $casts = [
        'capacity' => 'integer',
        'is_active' => 'boolean'
    ];
}
