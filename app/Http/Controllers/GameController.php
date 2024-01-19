<?php

namespace App\Http\Controllers;

use App\Events\GameStarted;
use App\Events\PlayersReady;
use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Game;
use App\Models\OrderdFruits;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GameController extends Controller
{
    public function createGame(Request $request)
    {
        $game = Game::create(); // 新しいゲームを作成

        // 指定された数のプレイヤーを作成
        for ($i = 0; $i < $request->playerCount; $i++) {
            Player::create([
                'game_id' => $game->id,
                'name' => '',
                'is_ready' => false,
            ]);
        }
        event(new GameStarted($game));

        return response()->json(['redirectUrl' => route('game', ['gameId' => $game->id, 'playerCount' => $request->playerCount])]);
    }

    public static function joinGame($gameId)
    {
        $game = Game::find($gameId);
        if (!$game) {
            return response()->json(['error' => '指定されたゲームが見つかりません。']);
        }
        return response()->json(['game' => $game]);
    }

    public static function getPlayers($gameId)
    {
        $players = Player::where('game_id', $gameId)->where('is_ready', true)->get();
        return response()->json(['players' => $players]);
    }

    public static function beReady($name, $gameId)
    {
        $player = Player::where('game_id', $gameId)->where('name', "")->first();
        if (!$player) {
            return response()->json(['full' => true]);
        }
        $player->name = $name;
        $player->is_ready = true;
        $player->save();
        $result = event(new PlayersReady($player));
        Log::alert($result);

        return response()->json(['player' => $player]);
    }

    public static function startGame($gameId)
    {
        $game = Game::find($gameId);
        $players = $game->players;

        foreach ($players as $player) {
            if (!$player->is_ready) {
                return response()->json(['error' => 'All players are not ready yet.']);
            }
        }
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
