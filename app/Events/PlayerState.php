<?php

namespace App\Events;

use App\Models\Player;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerState implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $player;

    public function __construct(Player $player)
    {
        $this->player = $player;
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->player->game_id);
    }

    public function broadcastAs()
    {
        return 'player-state';
    }
}
