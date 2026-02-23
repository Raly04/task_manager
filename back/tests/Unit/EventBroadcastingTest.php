<?php

namespace Tests\Unit;

use App\Events\CommentCreated;
use App\Events\CommentDeleted;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;
use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Tests\TestCase;

class EventBroadcastingTest extends TestCase
{
    public function test_task_created_event_broadcasting_config(): void
    {
        $task = new Task(['id' => 1]);
        $event = new TaskCreated($task);

        $channels = $event->broadcastOn();
        
        $this->assertCount(1, $channels);
        $this->assertInstanceOf(Channel::class, $channels[0]);
        $this->assertEquals('tasks', $channels[0]->name);
        $this->assertEquals('task.created', $event->broadcastAs());
    }

    public function test_task_updated_event_broadcasting_config(): void
    {
        $task = new Task(['id' => 1]);
        $event = new TaskUpdated($task);

        $channels = $event->broadcastOn();
        
        $this->assertCount(1, $channels);
        $this->assertInstanceOf(Channel::class, $channels[0]);
        $this->assertEquals('tasks', $channels[0]->name);
        $this->assertEquals('task.updated', $event->broadcastAs());
    }

    public function test_task_deleted_event_broadcasting_config(): void
    {
        $event = new TaskDeleted(1);

        $channels = $event->broadcastOn();
        
        $this->assertCount(1, $channels);
        $this->assertInstanceOf(Channel::class, $channels[0]);
        $this->assertEquals('tasks', $channels[0]->name);
        $this->assertEquals('task.deleted', $event->broadcastAs());
    }

    public function test_comment_created_event_broadcasting_config(): void
    {
        $comment = new Comment(['task_id' => 5]);
        $event = new CommentCreated($comment);

        $channels = $event->broadcastOn();
        
        $this->assertCount(1, $channels);
        $this->assertInstanceOf(Channel::class, $channels[0]);
        $this->assertEquals('tasks.5', $channels[0]->name);
        $this->assertEquals('comment.created', $event->broadcastAs());
    }

    public function test_comment_deleted_event_broadcasting_config(): void
    {
        $event = new CommentDeleted(5, 10);

        $channels = $event->broadcastOn();
        
        $this->assertCount(1, $channels);
        $this->assertInstanceOf(Channel::class, $channels[0]);
        $this->assertEquals('tasks.5', $channels[0]->name);
        $this->assertEquals('comment.deleted', $event->broadcastAs());
    }
}
