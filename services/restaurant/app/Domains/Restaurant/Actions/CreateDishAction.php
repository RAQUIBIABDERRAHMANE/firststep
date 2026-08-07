<?php

namespace App\Domains\Restaurant\Actions;

use App\Domains\Restaurant\Contracts\DishRepositoryInterface;

class CreateDishAction
{
    protected $dishRepository;

    public function __construct(DishRepositoryInterface $dishRepository)
    {
        $this->dishRepository = $dishRepository;
    }

    public function execute(string $categoryId, array $data)
    {
        if (!isset($data['price']) || $data['price'] <= 0) {
            throw new \InvalidArgumentException('Price must be greater than zero.');
        }
        if (empty($data['name'])) {
            throw new \InvalidArgumentException('Dish name cannot be empty.');
        }

        return $this->dishRepository->save(array_merge($data, [
            'category_id' => $categoryId
        ]));
    }
}
