<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantWebsite extends Model
{
    protected $table = 'tenant_websites';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'location_id',
        'slug',
        'primary_color',
        'config',
        'design_template',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'string'
    ];
}
