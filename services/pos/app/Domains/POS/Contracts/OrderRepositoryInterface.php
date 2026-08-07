<?php

namespace App\Domains\POS\Contracts;

interface OrderRepositoryInterface
{
    public function findById(string $id);
    public function findBySyncId(string $syncId);
    public function getSessionTotalSales(string $sessionId);
    public function save(array $data);
}
