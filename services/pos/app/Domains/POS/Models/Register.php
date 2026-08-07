<?php

namespace App\Domains\POS\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Register extends Model
{
    use HasUuids;

    protected $table = 'pos_registers';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'name',
        'device_identifier',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
