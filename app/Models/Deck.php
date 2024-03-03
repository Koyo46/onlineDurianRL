<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_id', 'game_id'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
