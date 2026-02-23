<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Events\TaskUpdated;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['creator', 'assigned'])
            ->withCount('comments')
            ->status($request->status)
            ->priority($request->priority)
            ->assignedTo($request->assigned_to)
            ->search($request->search);

        if ($request->boolean('all')) {
            $tasks = $query->get();
            // On retourne une structure paginée factice pour la compatibilité front
            return TaskResource::collection($tasks)->additional([
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $tasks->count(),
                    'total' => $tasks->count(),
                ]
            ]);
        }

        $tasks = $query->latest()->paginate($request->integer('per_page', 10));

        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = Task::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        TaskCreated::dispatch($task);

        return new TaskResource($task->load(['creator', 'assigned']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return new TaskResource($task->load(['creator', 'assigned', 'comments'])->loadCount('comments'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $task->update($request->validated());
        TaskUpdated::dispatch($task);

        return new TaskResource($task->load(['creator', 'assigned'])->loadCount('comments'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $taskId = $task->id;
        $task->delete();

        TaskDeleted::dispatch($taskId);

        return response()->json(['message' => 'Task deleted successfully.']);
    }
}
