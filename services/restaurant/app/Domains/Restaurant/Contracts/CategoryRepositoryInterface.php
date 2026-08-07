<?php

namespace App\Domains\Restaurant\Contracts;

interface CategoryRepositoryInterface
{
    public function getByTenant(string $tenantId);
    public function findById(string $id);
    public function save(array $data);
}
