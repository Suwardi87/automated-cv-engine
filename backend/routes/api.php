<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GithubController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\CvController;

Route::prefix('auth')->group(function () {
    Route::get('{provider}/redirect', [AuthController::class, 'redirect']);
    Route::get('{provider}/callback', [AuthController::class, 'callback']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn($req) => $req->user());

    Route::prefix('github')->group(function () {
        Route::get('/repos', [GithubController::class, 'index']);
        Route::post('/sync', [GithubController::class, 'sync']);
        Route::post('/{project}/toggle-feature', [GithubController::class, 'toggleFeature']);
    });

    Route::prefix('social')->group(function () {
        Route::post('/sync', [MediaController::class, 'sync']);
    });

    Route::get('/portfolio/{username}', [PortfolioController::class, 'show']);

    Route::get('/download-cv', [CvController::class, 'download']);
});
