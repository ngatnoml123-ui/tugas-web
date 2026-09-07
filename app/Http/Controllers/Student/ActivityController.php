<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityEvidence;
use App\Models\Internship;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $activities = Activity::where('student_user_id', $user->id)
            ->with(['project', 'evidences'])
            ->latest('activity_date')
            ->paginate(15);

        return Inertia::render('Student/Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();

        $internship = Internship::where('student_user_id', $user->id)
            ->where('status', 'active')
            ->first();

        $projects = Project::where('student_user_id', $user->id)->get(['id', 'title']);

        return Inertia::render('Student/Activities/Form', [
            'internship' => $internship,
            'projects'   => $projects,
            'activity'   => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'internship_id' => ['required', 'exists:internships,id'],
            'project_id'    => ['nullable', 'exists:projects,id'],
            'activity_date' => ['required', 'date'],
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['required', 'string'],
            'output'        => ['nullable', 'string'],
            'status'        => ['required', 'in:pending,in_progress,completed'],
            'evidences'     => ['nullable', 'array'],
            'evidences.*'   => ['file', 'max:10240'],
            'captions'      => ['nullable', 'array'],
        ]);

        $activity = Activity::create(array_merge($validated, [
            'student_user_id' => $user->id,
        ]));

        // Handle evidence uploads
        if ($request->hasFile('evidences')) {
            foreach ($request->file('evidences') as $idx => $file) {
                $path = $file->store("activities/{$user->id}", 'public');
                ActivityEvidence::create([
                    'activity_id'       => $activity->id,
                    'file_path'         => $path,
                    'file_original_name'=> $file->getClientOriginalName(),
                    'file_mime_type'    => $file->getMimeType(),
                    'file_size'         => $file->getSize(),
                    'caption'           => $request->captions[$idx] ?? null,
                ]);
            }
        }

        return redirect()->route('student.activities.index')
            ->with('success', 'Aktivitas berhasil ditambahkan.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        if ($activity->student_user_id !== Auth::id()) {
            abort(403);
        }

        // Delete evidence files
        foreach ($activity->evidences as $evidence) {
            Storage::disk('public')->delete($evidence->file_path);
        }

        $activity->delete();

        return back()->with('success', 'Aktivitas berhasil dihapus.');
    }
}
