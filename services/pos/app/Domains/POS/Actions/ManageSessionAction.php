<?php

namespace App\Domains\POS\Actions;

use App\Domains\POS\Contracts\SessionRepositoryInterface;
use App\Domains\POS\Contracts\RegisterRepositoryInterface;
use App\Domains\POS\Contracts\OrderRepositoryInterface;
use Carbon\Carbon;

class ManageSessionAction
{
    protected $sessionRepository;
    protected $registerRepository;
    protected $orderRepository;

    public function __construct(
        SessionRepositoryInterface $sessionRepository,
        RegisterRepositoryInterface $registerRepository,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->sessionRepository = $sessionRepository;
        $this->registerRepository = $registerRepository;
        $this->orderRepository = $orderRepository;
    }

    public function open(string $registerId, string $cashierId, float $openingFloat, ?string $notes = null)
    {
        // Check if register is active
        $register = $this->registerRepository->findById($registerId);
        if (!$register || !$register->is_active) {
            throw new \InvalidArgumentException('Register is not found or is currently inactive.');
        }

        // Verify no session is already open
        $active = $this->sessionRepository->findActiveSession($registerId);
        if ($active) {
            throw new \InvalidArgumentException('A cashier session is already open for this register.');
        }

        return $this->sessionRepository->save([
            'register_id' => $registerId,
            'cashier_id' => $cashierId,
            'opening_float' => $openingFloat,
            'status' => 'open',
            'notes' => $notes,
            'opened_at' => Carbon::now(),
        ]);
    }

    public function close(string $sessionId, float $actualCash, ?string $notes = null)
    {
        $session = $this->sessionRepository->findById($sessionId);
        if (!$session || $session->status !== 'open') {
            throw new \InvalidArgumentException('Session is not found or is already closed.');
        }

        // Calculate expected sales from database
        $totalSales = $this->orderRepository->getSessionTotalSales($sessionId);
        $expectedClosingFloat = $session->opening_float + $totalSales;

        return $this->sessionRepository->save([
            'id' => $sessionId,
            'closing_float' => $expectedClosingFloat,
            'actual_cash_counted' => $actualCash,
            'status' => 'closed',
            'notes' => $notes ? $session->notes . "\n" . $notes : $session->notes,
            'closed_at' => Carbon::now(),
        ]);
    }
}
