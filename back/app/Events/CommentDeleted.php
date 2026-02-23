<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $taskId;
    public $commentId;

    public function __construct($taskId, $commentId)
    {
        $this->taskId = $taskId;
        $this->commentId = $commentId;
    }

    public function broadcastOn(): array
    {
        return [new Channel('tasks.' . $this->taskId)];
    }

    public function broadcastAs(): string
    {
        return 'comment.deleted';
    }
}
