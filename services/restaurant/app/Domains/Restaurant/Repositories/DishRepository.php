<?php

namespace App\Domains\Restaurant\Repositories;

use App\Domains\Restaurant\Contracts\DishRepositoryInterface;
use App\Domains\Restaurant\Models\Dish;

class DishRepository implements DishRepositoryInterface
{
    public function getActiveByCategory(string $categoryId)
    {
        return Dish::where('category_id', $categoryId)
            ->where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function findById(string $id)
    {
        return Dish::findOrFail($id);
    }

    public function save(array $data)
    {
        if (isset($data['id'])) {
            $dish = Dish::findOrFail($data['id']);
            $dish->update($data);
            return $dish;
        }

        return Dish::create($data);
    }
}
