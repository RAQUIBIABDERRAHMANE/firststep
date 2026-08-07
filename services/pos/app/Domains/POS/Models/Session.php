<?php

namespace App\Domains\POS\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasUuids;

    protected $table = 'pos_sessions';

    protected $fillable = [
        'register_id',
        'cashier_id',
        'opening_float',
        'closing_float',
        'actual_cash_counted',
        'status',
        'notes',
        'opened_at',
        'closed_at'
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'opening_float' => 'double',
        'closing_float' => 'double',
        'actual_cash_counted' => 'double',
    ];

    public function register()
    {
        return $this->belongsTo(Register::class, 'register_id');
    }
}
