<?php

use App\Http\Controllers\NewsController;
use App\Http\Controllers\PersonalizedFeedController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/personalized-tags', [PersonalizedFeedController::class, 'getPersonalizedTags']);

    // Route to select user preferences
    Route::post('/select-preferences', [PersonalizedFeedController::class, 'selectPreferences']);

    // Route to get personalized feed
    Route::get('/personalized-feed', [PersonalizedFeedController::class, 'getPersonalizedFeed']);
});

// Additional middleware to check authentication
Route::middleware('auth:sanctum')->get('/check-auth', function () {
    return response()->json(['authenticated' => Auth::check()]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');


Route::post('/news-api', [NewsController::class, 'newsApi']);
Route::post('/new-york-times-api', [NewsController::class, 'newYorkTimesApi']);
Route::post('/the-guardian-api', [NewsController::class, 'theGuardianApi']);

Route::get('/public-feed', [ArticleController::class, 'index']);
Route::get('/getTags', [ArticleController::class, 'getTagsFromArticle']);
