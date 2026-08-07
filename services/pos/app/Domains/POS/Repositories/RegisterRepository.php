<?php

namespace App\Domains\POS\Repositories;

use App\Domains\POS\Contracts\RegisterRepositoryInterface;
use App\Domains\POS\Models\Register;

class RegisterRepository implements RegisterRepositoryInterface
{
    public function all(string $tenantId)
    {
        return Register::where('tenant_id', $tenantId)->get();
    }

    public function findById(string $id)
    {
        return Register::find($id);
    }

    public function findByIdentifier(string $deviceIdentifier)
    {
        return Register::where('device_identifier', $deviceIdentifier)->first();
    }

    public function save(array $data)
    {
        if (isset($data['id'])) {
            $register = Register::find($data['id']);
            if ($register) {
                $register->update($data);
                return $register;
            }
        }
        return Register::create($data);
    }
}
