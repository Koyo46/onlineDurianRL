<?php

namespace Database\Seeders;

use App\Models\Card;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cards = [
            ['berry' => 1, 'banana' => 2, 'grape' => 0, 'durian' => 0],
            ['berry' => 1, 'banana' => 2, 'grape' => 0, 'durian' => 0],
            ['berry' => 1, 'banana' => 2, 'grape' => 0, 'durian' => 0],
            ['berry' => 1, 'banana' => 0, 'grape' => 2, 'durian' => 0],
            ['berry' => 1, 'banana' => 0, 'grape' => 2, 'durian' => 0],
            ['berry' => 1, 'banana' => 0, 'grape' => 2, 'durian' => 0],
            ['berry' => 1, 'banana' => 0, 'grape' => 3, 'durian' => 0],
            ['berry' => 1, 'banana' => 0, 'grape' => 0, 'durian' => 2],
            ['berry' => 1, 'banana' => 0, 'grape' => 0, 'durian' => 3],
            ['berry' => 2, 'banana' => 1, 'grape' => 0, 'durian' => 0],
            ['berry' => 2, 'banana' => 1, 'grape' => 0, 'durian' => 0],
            ['berry' => 2, 'banana' => 1, 'grape' => 0, 'durian' => 0],
            ['berry' => 3, 'banana' => 1, 'grape' => 0, 'durian' => 0],
            ['berry' => 0, 'banana' => 1, 'grape' => 2, 'durian' => 0],
            ['berry' => 0, 'banana' => 1, 'grape' => 2, 'durian' => 0],
            ['berry' => 0, 'banana' => 1, 'grape' => 0, 'durian' => 2],
            ['berry' => 2, 'banana' => 0, 'grape' => 1, 'durian' => 0],
            ['berry' => 2, 'banana' => 0, 'grape' => 1, 'durian' => 0],
            ['berry' => 2, 'banana' => 0, 'grape' => 1, 'durian' => 0],
            ['berry' => 3, 'banana' => 0, 'grape' => 1, 'durian' => 0],
            ['berry' => 0, 'banana' => 2, 'grape' => 1, 'durian' => 2],
            ['berry' => 0, 'banana' => 2, 'grape' => 1, 'durian' => 0],
            ['berry' => 0, 'banana' => 2, 'grape' => 1, 'durian' => 0],
            ['berry' => 0, 'banana' => 0, 'grape' => 1, 'durian' => 2],
            ['berry' => 2, 'banana' => 0, 'grape' => 0, 'durian' => 1],
            ['berry' => 3, 'banana' => 0, 'grape' => 0, 'durian' => 1],
            ['berry' => 0, 'banana' => 2, 'grape' => 0, 'durian' => 1],
            ['berry' => 0, 'banana' => 0, 'grape' => 2, 'durian' => 1],
        ];

        foreach ($cards as $card) {
            Card::create($card);
        }
    }
}
