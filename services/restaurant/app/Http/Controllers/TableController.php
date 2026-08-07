<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domains\Restaurant\Contracts\TableRepositoryInterface;
use App\Domains\Restaurant\Actions\CreateTableAction;

class TableController extends Controller
{
    protected $tableRepository;

    public function __construct(TableRepositoryInterface $tableRepository)
    {
        $this->tableRepository = $tableRepository;
    }

    public function index(Request $request)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $tables = $this->tableRepository->getByTenant($tenantSlug);
        return response()->json($tables);
    }

    public function store(Request $request, CreateTableAction $action)
    {
        $tenantSlug = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantSlug) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        try {
            $table = $action->execute($tenantSlug, $request->all());
            return response()->json($table, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
