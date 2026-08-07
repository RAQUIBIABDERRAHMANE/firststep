<?php

namespace App\Http\Controllers;

use App\Domains\POS\Actions\SyncOfflineOrderAction;
use App\Domains\POS\Contracts\OrderRepositoryInterface;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $syncOfflineOrderAction;
    protected $orderRepository;

    public function __construct(
        SyncOfflineOrderAction $syncOfflineOrderAction,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->syncOfflineOrderAction = $syncOfflineOrderAction;
        $this->orderRepository = $orderRepository;
    }

    public function store(Request $request)
    {
        $tenantId = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantId) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $request->validate([
            'session_id' => 'required|uuid',
            'order_number' => 'required|string',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total' => 'required|numeric',
            'items' => 'required|array',
            'payments' => 'nullable|array',
            'payments.*.method' => 'required|string',
            'payments.*.amount' => 'required|numeric'
        ]);

        try {
            $order = $this->syncOfflineOrderAction->execute(
                $request->session_id,
                array_merge($request->all(), [
                    'tenant_id' => $tenantId
                ])
            );
            return response()->json($order, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function syncBatch(Request $request)
    {
        $tenantId = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantId) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $request->validate([
            'session_id' => 'required|uuid',
            'orders' => 'required|array',
            'orders.*.order_number' => 'required|string',
            'orders.*.sync_id' => 'required|uuid',
            'orders.*.subtotal' => 'required|numeric',
            'orders.*.total' => 'required|numeric',
            'orders.*.items' => 'required|array',
            'orders.*.payments' => 'nullable|array',
            'orders.*.payments.*.method' => 'required|string',
            'orders.*.payments.*.amount' => 'required|numeric'
        ]);

        $syncedOrders = [];
        $errors = [];

        foreach ($request->orders as $index => $orderData) {
            try {
                $synced = $this->syncOfflineOrderAction->execute(
                    $request->session_id,
                    array_merge($orderData, [
                        'tenant_id' => $tenantId
                    ])
                );
                $syncedOrders[] = $synced;
            } catch (\Exception $e) {
                $errors[] = [
                    'index' => $index,
                    'order_number' => $orderData['order_number'] ?? null,
                    'error' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'synced_count' => count($syncedOrders),
            'synced_orders' => $syncedOrders,
            'errors' => $errors
        ], count($errors) > 0 ? 207 : 200);
    }
}
