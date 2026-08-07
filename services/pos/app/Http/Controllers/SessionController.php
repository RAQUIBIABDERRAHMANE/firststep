<?php

namespace App\Http\Controllers;

use App\Domains\POS\Actions\ManageSessionAction;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    protected $manageSessionAction;

    public function __construct(ManageSessionAction $manageSessionAction)
    {
        $this->manageSessionAction = $manageSessionAction;
    }

    public function open(Request $request)
    {
        $request->validate([
            'register_id' => 'required|uuid',
            'cashier_id' => 'required|uuid',
            'opening_float' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
            $session = $this->manageSessionAction->open(
                $request->register_id,
                $request->cashier_id,
                $request->opening_float,
                $request->notes
            );
            return response()->json($session, 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function close(Request $request, string $id)
    {
        $request->validate([
            'actual_cash_counted' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
            $session = $this->manageSessionAction->close(
                $id,
                $request->actual_cash_counted,
                $request->notes
            );
            return response()->json($session, 200);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
