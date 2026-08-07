<?php

namespace App\Domains\Restaurant\Contracts;

interface TableRepositoryInterface
{
    public function getByTenant(string $tenantId);
    public function findById(string $id);
    public function save(array $data);
}
