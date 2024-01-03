<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Game;
use App\Models\Player;

class GameController extends Controller
{
    public function startGame()
    {
        $game = Game::create(); // Gameを作成

        // 6人分のプレイヤー情報を作成
        $playerNames = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6'];

        foreach ($playerNames as $name) {
            Player::create([
                'game_id' => $game->id,
                'name' => $name,
            ]);
        }
    }

    public function start()
    {
        $game = Game::create(); // Gameを作成

        //オブジェクトで扱いたい
        $shuffledCards = Card::all()->shuffle()->toArray();
        // 手札のカードの選択と配布
        $players = 4;

        for ($i = 0; $i < $players; $i++) {
            $handCards[] = array_shift($shuffledCards);
        }

        // 在庫アイテムの初期化
        $stockedItems = ['berry' => 0, 'banana' => 0, 'grape' => 0, 'durian' => 0];

        // 手札のカードの記号の合計を計算
        foreach ($handCards as $card) {
            $stockedItems['berry'] += $card['berry'];
            $stockedItems['banana'] += $card['banana'];
            $stockedItems['grape'] += $card['grape'];
            $stockedItems['durian'] += $card['durian'];
        }

        // 必要なデータを返す
        return response()->json([
            'game' => $game,
            'handCards' => $handCards,
            'deck' => $shuffledCards,
            'stockedItems' => $stockedItems,
        ]);
    }

    public function orderCard($game)
    {
        $game->advanceTurn();
    }

    public function callMaster()
    {
    }
}
