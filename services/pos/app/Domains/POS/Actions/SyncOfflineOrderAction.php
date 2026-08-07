<?php

namespace App\Domains\POS\Actions;

use App\Domains\POS\Contracts\OrderRepositoryInterface;
use App\Domains\POS\Contracts\SessionRepositoryInterface;

class SyncOfflineOrderAction
{
    protected $orderRepository;
    protected $sessionRepository;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
        SessionRepositoryInterface $sessionRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->sessionRepository = $sessionRepository;
    }

    public function execute(string $sessionId, array $orderData)
    {
        // 1. Verify session exists and is active
        $session = $this->sessionRepository->findById($sessionId);
        if (!$session || $session->status !== 'open') {
            throw new \InvalidArgumentException('Provided session is either invalid or closed.');
        }

        // 2. Check sync_id idempotency
        if (isset($orderData['sync_id'])) {
            $existing = $this->orderRepository->findBySyncId($orderData['sync_id']);
            if ($existing) {
                return $existing; // Skip and return the previously synchronized order
            }
        }

        // 3. Save order record
        return $this->orderRepository->save(array_merge($orderData, [
            'session_id' => $sessionId
        ]));
    }
}
