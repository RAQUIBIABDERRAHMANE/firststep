<?php

namespace App\Http\Controllers;

use App\Domains\POS\Contracts\RegisterRepositoryInterface;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    protected $registerRepository;

    public function __construct(RegisterRepositoryInterface $registerRepository)
    {
        $this->registerRepository = $registerRepository;
    }

    public function index(Request $request)
    {
        $tenantId = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantId) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        return response()->json($this->registerRepository->all($tenantId));
    }

    public function store(Request $request)
    {
        $tenantId = $request->header('X-Tenant-Resolved-Slug');
        if (!$tenantId) {
            return response()->json(['error' => 'Tenant resolved header is missing.'], 400);
        }

        $request->validate([
            'location_id' => 'required|uuid',
            'name' => 'required|string',
            'device_identifier' => 'required|string'
        ]);

        $register = $this->registerRepository->save(array_merge($request->all(), [
            'tenant_id' => $tenantId
        ]));

        return response()->json($register, 201);
    }
}
