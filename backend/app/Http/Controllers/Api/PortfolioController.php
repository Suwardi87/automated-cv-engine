<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PortfolioController extends Controller
{
    public function show(string $username)
    {
        // TODO: return public portfolio data

        return response()->json(['data' => null]);
    }
}
