<?php

namespace App\Domains\Restaurant\Repositories;

use App\Domains\Restaurant\Contracts\CategoryRepositoryInterface;
use App\Domains\Restaurant\Models\Category;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getByTenant(string $tenantId)
    {
        return Category::where('tenant_id', $tenantId)
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function findById(string $id)
    {
        return Category::findOrFail($id);
    }

    public function save(array $data)
    {
        if (isset($data['id'])) {
            $category = Category::findOrFail($data['id']);
            $category->update($data);
            return $category;
        }

        return Category::create($data);
    }
}
