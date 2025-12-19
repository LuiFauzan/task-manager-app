<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasksQuery = Task::query()
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->when(
                $request->status,
                fn($q, $status) =>
                $q->where('status', $status)
            )
            ->when(
                $request->priority,
                fn($q, $priority) =>
                $q->where('priority', $priority)
            );

        $tasks = $tasksQuery->latest()->get();

        // 🔥 STATS
        $stats = [
            'total' => Task::count(),
            'pending' => Task::where('status', 'pending')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'completed' => Task::where('status', 'completed')->count(),
        ];

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'priority' => $request->priority,
            ],
        ]);
    }
    public function store(Request $request)
    {
        // Logic to store a new task
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'priority' => 'required|string',
            'category' => 'required|string',
        ]);
        Task::create($request->all());
        return redirect()->route('tasks.index')->with('message', 'Task created successfully.');
    }
    public function update(Request $request, Task $task)
    {
        // Logic to update an existing task
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'priority' => 'required|string',
            'category' => 'required|string',
        ]);
        $task->update($request->all());
        return redirect()->route('tasks.index')->with('message', 'Task updated successfully.');
    }
    public function badgeStatusUpdate(Task $task)
    {
        $nextStatus = match ($task->status) {
            'pending' => 'in_progress',
            'in_progress' => 'completed',
            'completed' => 'pending',
            default => 'pending',
        };

        $task->update([
            'status' => $nextStatus,
        ]);
        return redirect()->route('tasks.index')->with('message', 'Task status updated successfully.');
    }
    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('message', 'Task deleted successfully.');
    }
}
