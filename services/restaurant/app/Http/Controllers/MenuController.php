<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domains\Restaurant\Contracts\CategoryRepositoryInterface;
use App\Domains\Restaurant\Contracts\DishRepositoryInterface;
use App\Domains\Restaurant\Actions\CreateCategoryAction;
use App\Domains\Restaurant\Actions\CreateDishAction;

class MenuController extends Controller
{
    protected $categoryRepository;
    protected $dishRepository;

    public function __construct(
        CategoryRepositoryInterface $categoryRepository,
        DishRepositoryInterface $dishRepository
    ) {
        $this->categoryRepository = $categoryRepository;
        $this->dishRepository = $dishRepository;
    }

    public function indexCategories(Request $request)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $categories = $this->categoryRepository->getByTenant($tenantSlug);
        return response()->json($categories);
    }

    public function storeCategory(Request $request, CreateCategoryAction $action)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        try {
            $category = $action->execute($tenantSlug, $request->all());
            return response()->json($category, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function updateCategory(Request $request, $id)
    {
        try {
            $data = array_merge($request->all(), ['id' => $id]);
            $category = $this->categoryRepository->save($data);
            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function storeDish(Request $request, $categoryId, CreateDishAction $action)
    {
        try {
            $dish = $action->execute($categoryId, $request->all());
            return response()->json($dish, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function updateDish(Request $request, $id)
    {
        try {
            $data = array_merge($request->all(), ['id' => $id]);
            $dish = $this->dishRepository->save($data);
            return response()->json($dish);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function indexDishes(Request $request, $categoryId)
    {
        $dishes = $this->dishRepository->getActiveByCategory($categoryId);
        return response()->json($dishes);
    }

    public function deleteCategory($id)
    {
        \App\Domains\Restaurant\Models\Category::destroy($id);
        return response()->json(['success' => true]);
    }

    public function deleteDish($id)
    {
        \App\Domains\Restaurant\Models\Dish::destroy($id);
        return response()->json(['success' => true]);
    }
}
