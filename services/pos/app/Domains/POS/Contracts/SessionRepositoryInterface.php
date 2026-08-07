<?php

namespace App\Domains\POS\Contracts;

interface SessionRepositoryInterface
{
    public function findById(string $id);
    public function findActiveSession(string $registerId);
    public function save(array $data);
}
