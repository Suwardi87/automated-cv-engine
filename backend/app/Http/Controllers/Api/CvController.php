<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class CvController extends Controller
{
    public function download()
    {
        // TODO: generate CV PDF via Browsershot

        return response()->json(['message' => 'Not implemented']);
    }
}
