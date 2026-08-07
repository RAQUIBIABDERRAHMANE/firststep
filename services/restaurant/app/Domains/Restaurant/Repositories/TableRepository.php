<?php

namespace App\Domains\Restaurant\Repositories;

use App\Domains\Restaurant\Contracts\TableRepositoryInterface;
use App\Domains\Restaurant\Models\Table;

class TableRepository implements TableRepositoryInterface
{
    public function getByTenant(string $tenantId)
    {
        return Table::where('tenant_id', $tenantId)
            ->orderBy('number', 'asc')
            ->get();
    }

    public function findById(string $id)
    {
        return Table::findOrFail($id);
    }

    public function save(array $data)
    {
        if (isset($data['id'])) {
            $table = Table::findOrFail($data['id']);
            $table->update($data);
            return $table;
        }

        return Table::create($data);
    }
}
