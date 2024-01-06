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

    public static function orderCard(
        $game,
        $deck,
        $orderdCard,
        $orderdCards
    ) {
        // $game->advanceTurn();
        if (count($deck) > 0) {
            if ($orderdCard) {
                array_push($orderdCards, $orderdCard);
            }
            $newOrderdCard = $deck[0];
            array_shift($deck); // 配られたカード配列から削除
            return response()->json([
                'newOrderdCard' => $newOrderdCard,
                'orderdCards' => $orderdCards,
                'deck' => $deck,
            ]);
        } else {
            error_log("shuffledCards is empty");
        }
    }

    public static function callMaster($orderdCards, $stockedItems)
    {
        $totalBerry = 0;
        $totalBanana = 0;
        $totalGrape = 0;
        $totalDurian = 0;

        foreach ($orderdCards as $card) {
            $totalBerry += $card['berry'];
            $totalBanana += $card['banana'];
            $totalGrape += $card['grape'];
            $totalDurian += $card['durian'];
        }
        if ($totalBerry > $stockedItems['berry'] || $totalBanana > $stockedItems['banana'] || $totalGrape > $stockedItems['grape'] || $totalDurian > $stockedItems['durian']) {
            return true;
        } else {
            return false;
        }
    }
}
