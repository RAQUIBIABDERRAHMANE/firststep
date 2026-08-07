<?php

namespace App\Domains\Restaurant\Contracts;

interface DishRepositoryInterface
{
    public function getActiveByCategory(string $categoryId);
    public function findById(string $id);
    public function save(array $data);
}
