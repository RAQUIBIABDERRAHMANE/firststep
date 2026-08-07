<?php

namespace App\Domains\POS\Contracts;

interface RegisterRepositoryInterface
{
    public function all(string $tenantId);
    public function findById(string $id);
    public function findByIdentifier(string $deviceIdentifier);
    public function save(array $data);
}
