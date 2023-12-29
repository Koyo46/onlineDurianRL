<?php

namespace App\Http\Controllers;

use App\Models\Card;

class GameController extends Controller
{
    public function start()
    {
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
            'handCards' => $handCards,
            'stockedItems' => $stockedItems,
        ]);
    }
}
