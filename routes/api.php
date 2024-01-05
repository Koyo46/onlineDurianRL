<?php

use App\Http\Controllers\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/game/start', [GameController::class, 'start']);
Route::post('/game/orderCard', function (Request $request) {
    return GameController::orderCard($request->game, $request->deck, $request->orderdCard, $request->orderdCards);
});
Route::post('/game/callMaster', function (Request $request) {
    return GameController::callMaster($request->orderdCards, $request->stockedItems);
});
