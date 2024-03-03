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

Route::post('/set-session-id', [GameController::class, 'setSessionId']);

Route::post('/game/start', function (Request $request) {
    return GameController::startGame($request->gameId, $request->playerCount);
});
Route::post('/game/createGame', [GameController::class, 'createGame']);
Route::post('/game/joinGame', function (Request $request) {
    return GameController::joinGame($request->gameId);
});
Route::post('/player/ready', function (Request $request) {
    return GameController::beReady($request->name, $request->gameId);
});
// Route::get('/hand-cards/{gameId}', function ($gameId) {
//     return GameController::getHandCards($gameId);
// });
Route::get('/game/{gameId}/players', function ($gameId) {
    return GameController::getPlayers($gameId);
});


Route::post('/game/orderCard', function (Request $request) {
    return GameController::orderCard($request->gameId);
});
Route::post('/game/decideOrder', function (Request $request) {
    return GameController::decideOrder($request->card, $request->selectedFruitId, $request->gameId);
});
Route::post('/game/callMaster', function (Request $request) {
    return GameController::callMaster($request->orderdFruits, $request->stockedItems, $request->gameId);
});
