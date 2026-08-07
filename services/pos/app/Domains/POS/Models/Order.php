<?php

namespace App\Domains\POS\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUuids;

    protected $table = 'pos_orders';

    protected $fillable = [
        'session_id',
        'tenant_id',
        'order_number',
        'sync_id',
        'subtotal',
        'discount',
        'tax',
        'total',
        'status',
        'items'
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'double',
        'discount' => 'double',
        'tax' => 'double',
        'total' => 'double',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'order_id');
    }
}
