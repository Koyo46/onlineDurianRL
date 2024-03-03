<?php

namespace App\Models;

class Card
{
    public $id;
    public $fruit1;
    public $fruit1_count;
    public $fruit2;
    public $fruit2_count;

    public function __construct($attributes = [])
    {
        $this->id = $attributes['id'] ?? null;
        $this->fruit1 = $attributes['fruit1'] ?? null;
        $this->fruit1_count = $attributes['fruit1_count'] ?? null;
        $this->fruit2 = $attributes['fruit2'] ?? null;
        $this->fruit2_count = $attributes['fruit2_count'] ?? null;
    }

    public static function all()
    {
        $cards = require database_path('data/cards.php');
        return array_map(function ($card) {
            return new static($card);
        }, $cards);
    }

    public static function find($id)
    {
        return static::all()[$id];
    }
}
