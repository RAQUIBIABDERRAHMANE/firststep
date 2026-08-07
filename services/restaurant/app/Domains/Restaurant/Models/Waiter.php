<?php

namespace App\Domains\Restaurant\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Waiter extends Model
{
    use HasUuids;

    protected $table = 'restaurant_waiters';

    protected $fillable = [
        'tenant_id',
        'name',
        'pin_hash',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
