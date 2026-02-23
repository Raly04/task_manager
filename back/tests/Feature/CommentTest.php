<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->task = Task::factory()->create(['created_by' => $this->user->id]);
    }

    public function test_user_can_list_comments_for_task(): void
    {
        Comment::factory()->count(3)->create(['task_id' => $this->task->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/tasks/{$this->task->id}/comments");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_comment(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/tasks/{$this->task->id}/comments", [
                'body' => 'Test comment',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.body', 'Test comment');

        $this->assertDatabaseHas('comments', [
            'task_id' => $this->task->id,
            'user_id' => $this->user->id,
            'body' => 'Test comment',
        ]);
    }

    public function test_owner_can_delete_comment(): void
    {
        $comment = Comment::factory()->create([
            'task_id' => $this->task->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/tasks/{$this->task->id}/comments/{$comment->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_admin_can_delete_any_comment(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $comment = Comment::factory()->create(['task_id' => $this->task->id]);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/tasks/{$this->task->id}/comments/{$comment->id}");

        $response->assertOk();
    }

    public function test_user_cannot_delete_others_comment(): void
    {
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'task_id' => $this->task->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/tasks/{$this->task->id}/comments/{$comment->id}");

        $response->assertStatus(403);
    }
}
