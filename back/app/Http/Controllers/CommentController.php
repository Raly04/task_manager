<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Task $task)
    {
        return CommentResource::collection(
            $task->comments()->with('user')->latest()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request , Task $task)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $request->body,
        ]);

        return new CommentResource($comment->load('user'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Task $task, Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé.']);
    }
}
