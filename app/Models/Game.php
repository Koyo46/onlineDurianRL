<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    protected $fillable = [
        'current_turn', 'current_round', 'player_count',
    ];

    public function decks()
    {
        return $this->hasMany(Deck::class);
    }

    // ターンを進めるメソッドを追加
    public function advanceTurn()
    {
        $this->current_turn++;
        $this->save();
    }
}
