<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    //Relations
    public function test_task_belongs_to_creator(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $this->assertInstanceOf(User::class, $task->creator);
        $this->assertEquals($this->user->id, $task->creator->id);
    }

    public function test_task_belongs_to_assigned_user(): void
    {
        $assigned = User::factory()->create();
        $task = Task::factory()->create([
            'created_by'  => $this->user->id,
            'assigned_to' => $assigned->id,
        ]);

        $this->assertInstanceOf(User::class, $task->assigned);
        $this->assertEquals($assigned->id, $task->assigned->id);
    }

    public function test_task_has_many_comments(): void
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        Comment::create([
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'body'    => 'Test comment',
        ]);

        $this->assertCount(1, $task->comments);
        $this->assertInstanceOf(Comment::class, $task->comments->first());
    }

    //User Relations

    public function test_user_has_many_created_tasks(): void
    {
        Task::factory()->count(3)->create(['created_by' => $this->user->id]);

        $this->assertCount(3, $this->user->createdTasks);
    }

    public function test_user_has_many_assigned_tasks(): void
    {
        Task::factory()->count(2)->create([
            'assigned_to' => $this->user->id,
            'created_by'  => User::factory()->create()->id,
        ]);

        $this->assertCount(2, $this->user->assignedTasks);
    }

    //Scopes

    public function test_scope_status_filters_correctly(): void
    {
        Task::factory()->create(['status' => 'done', 'created_by' => $this->user->id]);
        Task::factory()->create(['status' => 'todo', 'created_by' => $this->user->id]);

        $results = Task::status('done')->get();

        $this->assertCount(1, $results);
        $this->assertEquals('done', $results->first()->status);
    }

    public function test_scope_priority_filters_correctly(): void
    {
        Task::factory()->create(['priority' => 'high', 'created_by' => $this->user->id]);
        Task::factory()->create(['priority' => 'low', 'created_by' => $this->user->id]);

        $results = Task::priority('high')->get();

        $this->assertCount(1, $results);
        $this->assertEquals('high', $results->first()->priority);
    }

    public function test_scope_search_filters_by_title(): void
    {
        Task::factory()->create(['title' => 'Fix login bug', 'created_by' => $this->user->id]);
        Task::factory()->create(['title' => 'Design page', 'created_by' => $this->user->id]);

        $results = Task::search('login')->get();

        $this->assertCount(1, $results);
        $this->assertStringContainsString('login', strtolower($results->first()->title));
    }

    public function test_scope_assigned_to_filters_correctly(): void
    {
        $other = User::factory()->create();

        Task::factory()->create(['assigned_to' => $this->user->id, 'created_by' => $other->id]);
        Task::factory()->create(['assigned_to' => $other->id, 'created_by' => $other->id]);

        $results = Task::assignedTo($this->user->id)->get();

        $this->assertCount(1, $results);
    }

    public function test_scope_returns_all_when_null(): void
    {
        Task::factory()->count(3)->create(['created_by' => $this->user->id]);

        $results = Task::status(null)->priority(null)->search(null)->get();

        $this->assertCount(3, $results);
    }
}
