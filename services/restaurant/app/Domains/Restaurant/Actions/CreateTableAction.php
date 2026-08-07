<?php

namespace App\Domains\Restaurant\Actions;

use App\Domains\Restaurant\Contracts\TableRepositoryInterface;

class CreateTableAction
{
    protected $tableRepository;

    public function __construct(TableRepositoryInterface $tableRepository)
    {
        $this->tableRepository = $tableRepository;
    }

    public function execute(string $tenantId, array $data)
    {
        if (empty($data['number'])) {
            throw new \InvalidArgumentException('Table number cannot be empty.');
        }

        return $this->tableRepository->save(array_merge($data, [
            'tenant_id' => $tenantId
        ]));
    }
}
