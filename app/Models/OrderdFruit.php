<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderdFruit extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_id', 'selected_fruit',
        'fruit1', 'fruit1_count', 'fruit2', 'fruit2_count',
    ];
}
