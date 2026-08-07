<?php

namespace App\Domains\POS\Repositories;

use App\Domains\POS\Contracts\OrderRepositoryInterface;
use App\Domains\POS\Models\Order;
use App\Domains\POS\Models\Payment;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryInterface
{
    public function findById(string $id)
    {
        return Order::with('payments')->find($id);
    }

    public function findBySyncId(string $syncId)
    {
        return Order::with('payments')->where('sync_id', $syncId)->first();
    }

    public function getSessionTotalSales(string $sessionId)
    {
        return Order::where('session_id', $sessionId)
            ->where('status', 'completed')
            ->sum('total');
    }

    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $orderData = collect($data)->except(['payments'])->toArray();
            
            if (isset($data['id'])) {
                $order = Order::find($data['id']);
                if ($order) {
                    $order->update($orderData);
                }
            } else {
                $order = Order::create($orderData);
            }

            // Save associated payments
            if (isset($data['payments'])) {
                foreach ($data['payments'] as $paymentData) {
                    $order->payments()->create($paymentData);
                }
            }

            return $order->load('payments');
        });
    }
}
