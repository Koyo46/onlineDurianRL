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

    public $gameId, $isStockEmpty, $player;

    /**
     * Create a new event instance.
     */
    public function __construct($gameId, $isStockEmpty, $player)
    {
        $this->gameId = $gameId;
        $this->isStockEmpty = $isStockEmpty;
        $this->player = $player;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     */
    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'called-master';
    }
}
