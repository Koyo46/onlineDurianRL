<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CalledMaster implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $game, $currentPlayer;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        // $this->game = $game;
        // $this->currentPlayer = $currentPlayer;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     */
    public function broadcastOn()
    {
        return new Channel('game.' . $this->game->id);
    }

    public function broadcastAs()
    {
        return 'called-master';
    }
}
