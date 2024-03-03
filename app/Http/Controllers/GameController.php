<?php

namespace App\Http\Controllers;

use App\Events\CalledMaster;
use App\Events\GameStarted;
use App\Events\HandCards;
use App\Events\OrderdFruits;
use App\Events\PlayerState;
use App\Events\TurnAdvanced;
use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use App\Models\Game;
use App\Models\OrderdFruit;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function createGame(Request $request)
    {
        $game = Game::create(['player_count' => $request->playerCount]); // 新しいゲームを作成

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
        $player = new Player;
        $player->game_id = $gameId;
        $player->name = $name;
        $player->is_ready = true;
        $player->session_id = Str::random(10);
        $player->save();
        event(new PlayerState($player));

        return response()->json(['player' => $player]);
    }

    public static function startGame(int $gameId, int $playerCount)
    {
        $game = Game::find($gameId);
        $game->current_round += 1;
        $game->current_turn = 0;
        $game->save();
        $players = $game->players->where('is_ready', true);

        // プレイヤーの数だけランダムな順番を生成
        $order = range(0, $players->count() - 1);
        shuffle($order);
        // 各プレイヤーにランダムな順番を割り当てる
        foreach ($players as $index => $player) {
            $player->order = $order[$index];
            $player->save();
        }

        OrderdFruit::truncate(); // orderd_fruitsテーブルのレコードを全削除

        $cards = Card::all();
        shuffle($cards); // 配列をシャッフル
        $shuffledCards = $cards; // シャッフルされた配列を$shuffledCardsに代入
        foreach ($shuffledCards as $card) {
            $card;
            Deck::create([
                'game_id' => $gameId,
                'card_id' => $card->id
            ]);
        }

        for ($i = 0; $i < $playerCount; $i++) {
            $handCards[] = array_shift($shuffledCards);
        }
        // 在庫アイテムの初期化
        $stockedItems = ['berry' => 0, 'banana' => 0, 'grape' => 0, 'durian' => 0];

        // 手札のカードの記号の合計を計算
        foreach ($handCards as $card) {
            $stockedItems['berry'] += ($card->fruit1 === 'berry' ? $card->fruit1_count : 0) + ($card->fruit2 === 'berry' ? $card->fruit2_count : 0);
            $stockedItems['banana'] += ($card->fruit1 === 'banana' ? $card->fruit1_count : 0) + ($card->fruit2 === 'banana' ? $card->fruit2_count : 0);
            $stockedItems['grape'] += ($card->fruit1 === 'grape' ? $card->fruit1_count : 0) + ($card->fruit2 === 'grape' ? $card->fruit2_count : 0);
            $stockedItems['durian'] += ($card->fruit1 === 'durian' ? $card->fruit1_count : 0) + ($card->fruit2 === 'durian' ? $card->fruit2_count : 0);
        }
        event(new HandCards($handCards, $gameId));

        $currentPlayer = $game->players->sortBy('order')->first();
        event(new GameStarted($game, $currentPlayer, $game->current_round));

        // 必要なデータを返す
        return response()->json([
            'handCards' => $handCards,
            'deck' => $shuffledCards,
            'stockedItems' => $stockedItems,
            'currentPlayer' => $currentPlayer,
            'currentRound' => $game->current_round,
        ]);
    }

    // public static function getHandCards($gameId)
    // {
    //     $handCards = Deck::where('game_id', $gameId)->get();
    //     return response()->json(['handCards' => $handCards]);
    // }

    public static function orderCard(
        $gameId
    ) {
        $deck = Deck::where('game_id', $gameId)->get();
        if (count($deck) > 0) {
            $newOrderdCard = Card::find($deck[0]->card_id);
            $deck->shift(); // 配られたカードを配列から削除
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
        $selectedFruitId,
        $gameId
    ) {
        OrderdFruit::create([
            'card_id' => $card['id'],
            'fruit1' => $card['fruit1'],
            'fruit1_count' => $card['fruit1_count'],
            'fruit2' => $card['fruit2'],
            'fruit2_count' => $card['fruit2_count'],
            'selected_fruit' => $selectedFruitId
        ]);

        $orderdFruits = OrderdFruit::all();
        event(new OrderdFruits($orderdFruits, $gameId));

        $game = Game::find($gameId);
        $game->advanceTurn();
        $nextPlayerOrder = ($game->current_turn % $game->player_count);
        $nextPlayer = Player::where('game_id', $gameId)->where('order', '=', $nextPlayerOrder)->first();
        event(new TurnAdvanced($nextPlayer, $game->current_turn));

        return response()->json([
            'orderdFruits' => $orderdFruits,
        ]);
    }

    public static function callMaster($orderdFruits, $stockedItems, $gameId)
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
        $game = Game::find($gameId);
        $currentPlayer = $game->players()->where('order', $game->current_turn % $game->player_count)->first();
        $previousPlayer = $game->players()->where('order', ($game->current_turn - 1) % $game->player_count)->first();

        $isStockEmpty = false;
        if (($totalBerry ?? 0) > ($stockedItems['berry'] ?? 0) || ($totalBanana ?? 0) > ($stockedItems['banana'] ?? 0) || ($totalGrape ?? 0) > ($stockedItems['grape'] ?? 0) || ($totalDurian ?? 0) > ($stockedItems['durian'] ?? 0)) {
            $previousPlayer->score -= $game->current_round;
            $previousPlayer->save();
            $isStockEmpty = true;
            event(new CalledMaster($gameId, $isStockEmpty, $previousPlayer));
        } else {
            $currentPlayer->score -= $game->current_round;
            $currentPlayer->save();
            event(new CalledMaster($gameId, $isStockEmpty, $currentPlayer));
        }
        return response()->json([
            'isStockEmpty' => $isStockEmpty,
        ]);
    }
}
