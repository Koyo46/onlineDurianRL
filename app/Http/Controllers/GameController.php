<?php

namespace App\Http\Controllers;

use App\Models\Card;

class GameController extends Controller
{
    public function start()
    {
        // カードのシャッフル
        $shuffledCards = Card::all()->shuffle();

        // 手札のカードの選択と配布
        $players = 4;
        $handCards = collect();

        for ($i = 0; $i < $players; $i++) {
            $handCards->push($shuffledCards->splice(0, 1));
        }

        // 在庫アイテムの初期化
        $stockedItems = ['berry' => 0, 'banana' => 0, 'grape' => 0, 'durian' => 0];

        // 手札のカードの記号の合計を計算
        foreach ($handCards as $card) {
            $stockedItems['berry'] += $card->berry;
            $stockedItems['banana'] += $card->banana;
            $stockedItems['grape'] += $card->grape;
            $stockedItems['durian'] += $card->durian;
        }

        // 必要なデータを返す
        return response()->json([
            'handCards' => $handCards,
            'stockedItems' => $stockedItems,
        ]);
    }
}
