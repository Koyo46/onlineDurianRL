<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Game;
use App\Models\OrderdFruits;
use App\Models\Player;
use Illuminate\Support\Facades\Log;

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
        OrderdFruits::truncate(); // orderd_fruitsテーブルのレコードを全削除

        //オブジェクトで扱いたい
        $cards = include(database_path('data/cards.php'));
        shuffle($cards); // 配列をシャッフル
        $shuffledCards = $cards; // シャッフルされた配列を$shuffledCardsに代入

        $players = 4;

        for ($i = 0; $i < $players; $i++) {
            $handCards[] = array_shift($shuffledCards);
        }

        // 在庫アイテムの初期化
        $stockedItems = ['berry' => 0, 'banana' => 0, 'grape' => 0, 'durian' => 0];

        // 手札のカードの記号の合計を計算
        foreach ($handCards as $card) {
            $stockedItems['berry'] += ($card['fruit1'] === 'berry' ? $card['fruit1_count'] : 0) + ($card['fruit2'] === 'berry' ? $card['fruit2_count'] : 0);
            $stockedItems['banana'] += ($card['fruit1'] === 'banana' ? $card['fruit1_count'] : 0) + ($card['fruit2'] === 'banana' ? $card['fruit2_count'] : 0);
            $stockedItems['grape'] += ($card['fruit1'] === 'grape' ? $card['fruit1_count'] : 0) + ($card['fruit2'] === 'grape' ? $card['fruit2_count'] : 0);
            $stockedItems['durian'] += ($card['fruit1'] === 'durian' ? $card['fruit1_count'] : 0) + ($card['fruit2'] === 'durian' ? $card['fruit2_count'] : 0);
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
        $deck,
    ) {
        // $game->advanceTurn();
        if (count($deck) > 0) {

            $newOrderdCard = $deck[0];
            array_shift($deck); // 配られたカードを配列から削除
            return response()->json([
                'newOrderdCard' => $newOrderdCard,
                'deck' => $deck,
            ]);
        } else {
            error_log("shuffledCards is empty");
        }
    }

    public static function decideOrder(
        $card,
        $selectedFruitId
    ) {
        Log::error($card);
        OrderdFruits::create([
            'card_id' => $card['id'],
            'fruit1' => $card['fruit1'],
            'fruit1_count' => $card['fruit1_count'],
            'fruit2' => $card['fruit2'],
            'fruit2_count' => $card['fruit2_count'],
            'selected_fruit' => $selectedFruitId
        ]);

        $orderdFruits = OrderdFruits::all();

        return response()->json([
            'orderdFruits' => $orderdFruits,
        ]);
    }

    public static function callMaster($orderdFruits, $stockedItems)
    {
        $totalBerry = 0;
        $totalBanana = 0;
        $totalGrape = 0;
        $totalDurian = 0;

        foreach ($orderdFruits as $fruit) {
            if ($fruit['selected_fruit'] == 1) {
                switch ($fruit['fruit1']) {
                    case 'berry':
                        $totalBerry += $fruit['fruit1_count'];
                        break;
                    case 'banana':
                        $totalBanana += $fruit['fruit1_count'];
                        break;
                    case 'grape':
                        $totalGrape += $fruit['fruit1_count'];
                        break;
                    case 'durian':
                        $totalDurian += $fruit['fruit1_count'];
                        break;
                }
            } else {
                switch ($fruit['fruit2']) {
                    case 'berry':
                        $totalBerry += $fruit['fruit2_count'];
                        break;
                    case 'banana':
                        $totalBanana += $fruit['fruit2_count'];
                        break;
                    case 'grape':
                        $totalGrape += $fruit['fruit2_count'];
                        break;
                    case 'durian':
                        $totalDurian += $fruit['fruit2_count'];
                        break;
                }
            }
        }
        if ($totalBerry > $stockedItems['berry'] || $totalBanana > $stockedItems['banana'] || $totalGrape > $stockedItems['grape'] || $totalDurian > $stockedItems['durian']) {
            return true;
        } else {
            return false;
        }
    }
}
