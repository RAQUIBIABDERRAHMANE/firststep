<?php

namespace App\Domains\POS\Repositories;

use App\Domains\POS\Contracts\SessionRepositoryInterface;
use App\Domains\POS\Models\Session;

class SessionRepository implements SessionRepositoryInterface
{
    public function findById(string $id)
    {
        return Session::find($id);
    }

    public function findActiveSession(string $registerId)
    {
        return Session::where('register_id', $registerId)
            ->where('status', 'open')
            ->first();
    }

    public function save(array $data)
    {
        if (isset($data['id'])) {
            $session = Session::find($data['id']);
            if ($session) {
                $session->update($data);
                return $session;
            }
        }
        return Session::create($data);
    }
}
