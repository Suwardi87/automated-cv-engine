<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function sync(Request $request)
    {
        // TODO: dispatch SyncSocialMediaData job

        return response()->json(['message' => 'Sync started']);
    }
}
