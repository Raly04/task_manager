<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = Task::with(['creator', 'assigned'])
            ->status($request->status)
            ->priority($request->priority)
            ->assignedTo($request->assigned_to)
            ->search($request->search)
            ->paginate(10);

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

        return new TaskResource($task->load(['creator', 'assigned']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return new TaskResource($task->load(['creator', 'assigned', 'comments']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $task->update($request->validated());

        return new TaskResource($task->load(['creator', 'assigned']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.']);
    }
}
