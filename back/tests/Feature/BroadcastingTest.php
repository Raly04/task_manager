<?php

namespace Tests\Feature;

use App\Events\CommentCreated;
use App\Events\CommentDeleted;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;
use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BroadcastingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_task_creation_broadcasts_event(): void
    {
        Event::fake();

        $this->actingAs($this->user)
            ->postJson('/api/tasks', [
                'title' => 'New Task',
                'description' => 'Description',
                'due_date' => now()->addDay()->format('Y-m-d'),
                'assigned_to' => $this->user->id,
            ]);

        Event::assertDispatched(TaskCreated::class);
    }

    public function test_task_update_broadcasts_event(): void
    {
        Event::fake();

        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $this->actingAs($this->user)
            ->putJson("/api/tasks/{$task->id}", [
                'title' => 'Updated Task',
            ]);

        Event::assertDispatched(TaskUpdated::class);
    }

    public function test_task_deletion_broadcasts_event(): void
    {
        Event::fake();

        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $this->actingAs($this->user)
            ->deleteJson("/api/tasks/{$task->id}");

        Event::assertDispatched(TaskDeleted::class);
    }

    public function test_comment_creation_broadcasts_events(): void
    {
        Event::fake();

        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $this->actingAs($this->user)
            ->postJson("/api/tasks/{$task->id}/comments", [
                'body' => 'New Comment',
            ]);

        Event::assertDispatched(CommentCreated::class);
        Event::assertDispatched(TaskUpdated::class); // To update comment count
    }

    public function test_comment_deletion_broadcasts_events(): void
    {
        Event::fake();

        $task = Task::factory()->create(['created_by' => $this->user->id]);
        $comment = Comment::factory()->create([
            'task_id' => $task->id,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)
            ->deleteJson("/api/tasks/{$task->id}/comments/{$comment->id}");

        Event::assertDispatched(CommentDeleted::class);
        Event::assertDispatched(TaskUpdated::class); // To update comment count
    }
}
