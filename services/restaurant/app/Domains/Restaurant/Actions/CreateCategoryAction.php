<?php

namespace App\Domains\Restaurant\Actions;

use App\Domains\Restaurant\Contracts\CategoryRepositoryInterface;

class CreateCategoryAction
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function execute(string $tenantId, array $data)
    {
        if (empty($data['name'])) {
            throw new \InvalidArgumentException('Category name cannot be empty.');
        }

        return $this->categoryRepository->save(array_merge($data, [
            'tenant_id' => $tenantId
        ]));
    }
}
