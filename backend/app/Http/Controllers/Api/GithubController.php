<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GithubController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['data' => []]);
    }

    public function sync(Request $request)
    {
        // TODO: dispatch FetchGithubRepos job

        return response()->json(['message' => 'Sync started']);
    }

    public function toggleFeature(string $project)
    {
        return response()->json(['message' => 'Not implemented']);
    }
}
