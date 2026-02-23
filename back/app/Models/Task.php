<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'status', 'priority',
        'due_date', 'assigned_to', 'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assigned()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function scopeStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    public function scopePriority($query, ?string $priority)
    {
        return $query->when($priority, fn($q) => $q->where('priority', $priority));
    }

    public function scopeSearch($query, ?string $term)
    {
        return $query->when($term, fn($q) => $q->where('title', 'like', "%{$term}%"));
    }

    public function scopeAssignedTo($query, ?int $userId)
    {
        return $query->when($userId, fn($q) => $q->where('assigned_to', $userId));
    }
}
