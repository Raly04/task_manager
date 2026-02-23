<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user  = User::factory()->create(['role' => 'user']);
    }

    //INDEX

    public function test_guests_cannot_list_tasks(): void
    {
        $this->getJson('/api/tasks')->assertStatus(401);
    }

    public function test_user_can_list_tasks(): void
    {
        Task::factory()->count(3)->create([
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks');

        $response->assertOk()
                 ->assertJsonStructure([
                     'data' => [['id', 'title', 'status', 'priority']],
                     'meta',
                     'links',
                 ]);
    }

    public function test_tasks_are_paginated_by_10(): void
    {
        Task::factory()->count(15)->create([
            'created_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks');

        $response->assertOk();

        $this->assertCount(10, $response->json('data'));
        $this->assertEquals(15, $response->json('meta.total'));
    }

    //FILTERS (scopes)

    public function test_filter_tasks_by_status(): void
    {
        Task::factory()->create(['status' => 'done', 'created_by' => $this->user->id]);
        Task::factory()->create(['status' => 'todo', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks?status=done');

        $response->assertOk();

        foreach ($response->json('data') as $task) {
            $this->assertEquals('done', $task['status']);
        }
    }

    public function test_filter_tasks_by_priority(): void
    {
        Task::factory()->create(['priority' => 'high', 'created_by' => $this->user->id]);
        Task::factory()->create(['priority' => 'low', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks?priority=high');

        $response->assertOk();

        foreach ($response->json('data') as $task) {
            $this->assertEquals('high', $task['priority']);
        }
    }

    public function test_filter_tasks_by_assigned_to(): void
    {
        Task::factory()->create([
            'assigned_to' => $this->user->id,
            'created_by'  => $this->admin->id,
        ]);
        Task::factory()->create([
            'assigned_to' => $this->admin->id,
            'created_by'  => $this->admin->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks?assigned_to=' . $this->user->id);

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_search_tasks_by_title(): void
    {
        Task::factory()->create(['title' => 'Fix login bug', 'created_by' => $this->user->id]);
        Task::factory()->create(['title' => 'Design homepage', 'created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks?search=login');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertStringContainsString('login', strtolower($response->json('data.0.title')));
    }

    //STORES

    public function test_user_can_create_task(): void
    {
        $payload = [
            'title'       => 'New task',
            'description' => 'Task description',
            'status'      => 'todo',
            'priority'    => 'medium',
            'due_date'    => now()->addDays(7)->format('Y-m-d'),
            'assigned_to' => $this->user->id,
        ];

        $response = $this->actingAs($this->user)
                         ->postJson('/api/tasks', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'New task']);

        $this->assertDatabaseHas('tasks', [
            'title'      => 'New task',
            'created_by' => $this->user->id,
        ]);
    }

    public function test_create_task_requires_title(): void
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/tasks', [
                             'description' => 'No title provided',
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }

    public function test_create_task_due_date_must_be_future(): void
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/tasks', [
                             'title'    => 'Past task',
                             'due_date' => '2020-01-01',
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['due_date']);
    }

    public function test_create_task_assigned_to_must_exist(): void
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/tasks', [
                             'title'       => 'Ghost assign',
                             'assigned_to' => 9999,
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['assigned_to']);
    }

    //SHOW

    public function test_user_can_view_single_task(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->getJson("/api/tasks/{$task->id}");

        $response->assertOk()
                 ->assertJsonFragment(['id' => $task->id]);
    }

    public function test_show_returns_404_for_missing_task(): void
    {
        $response = $this->actingAs($this->user)
                         ->getJson('/api/tasks/9999');

        $response->assertStatus(404);
    }

    //UPDATE

    public function test_creator_can_update_own_task(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->putJson("/api/tasks/{$task->id}", [
                             'title' => 'Updated title',
                         ]);

        $response->assertOk()
                 ->assertJsonFragment(['title' => 'Updated title']);
    }

    public function test_admin_can_update_any_task(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $response = $this->actingAs($this->admin)
                         ->putJson("/api/tasks/{$task->id}", [
                             'title' => 'Admin updated',
                         ]);

        $response->assertOk()
                 ->assertJsonFragment(['title' => 'Admin updated']);
    }

    public function test_user_cannot_update_others_task(): void
    {
        $otherUser = User::factory()->create(['role' => 'user']);
        $task = Task::factory()->create([
            'created_by' => $otherUser->id,
            'assigned_to' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->putJson("/api/tasks/{$task->id}", [
                             'title' => 'Hijacked',
                         ]);

        $response->assertStatus(403);
    }

    public function test_assigned_user_can_update_task(): void
    {
        $creator = User::factory()->create(['role' => 'user']);
        $task = Task::factory()->create([
            'created_by' => $creator->id,
            'assigned_to' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->putJson("/api/tasks/{$task->id}", [
                             'title' => 'Assigned user update',
                         ]);

        $response->assertOk()
                 ->assertJsonFragment(['title' => 'Assigned user update']);
    }

    //DELETE

    public function test_creator_can_delete_own_task(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $response = $this->actingAs($this->user)
                         ->deleteJson("/api/tasks/{$task->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_admin_can_delete_any_task(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $response = $this->actingAs($this->admin)
                         ->deleteJson("/api/tasks/{$task->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_user_cannot_delete_others_task(): void
    {
        $otherUser = User::factory()->create(['role' => 'user']);
        $task = Task::factory()->create([
            'created_by' => $otherUser->id,
            'assigned_to' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
                         ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
    }
}
