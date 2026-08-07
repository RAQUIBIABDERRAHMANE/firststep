<?php

namespace App\Domains\POS\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasUuids;

    protected $table = 'pos_payments';

    protected $fillable = [
        'order_id',
        'method',
        'amount',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'amount' => 'double',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
