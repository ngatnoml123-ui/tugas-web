<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\Project;
use App\Models\VerificationLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $projects = Project::where('student_user_id', $user->id)
            ->with(['internship.period'])
            ->latest()
            ->paginate(10);

        $internship = Internship::where('student_user_id', $user->id)
            ->where('status', 'active')
            ->with('period')
            ->first();

        return Inertia::render('Student/Projects/Index', [
            'projects'   => $projects,
            'internship' => $internship,
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $internship = Internship::where('student_user_id', $user->id)
            ->where('status', 'active')
            ->with('period')
            ->first();

        return Inertia::render('Student/Projects/Form', [
            'internship' => $internship,
            'project'    => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'internship_id'   => ['required', 'exists:internships,id'],
            'title'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'role_in_project' => ['required', 'string', 'max:100'],
            'technologies'    => ['nullable', 'array'],
            'output_types'    => ['nullable', 'array'],
            'project_status'  => ['required', 'in:planning,development,testing,completed'],
        ]);

        // Verify internship belongs to student
        $internship = Internship::where('id', $validated['internship_id'])
            ->where('student_user_id', $user->id)
            ->firstOrFail();

        Project::create(array_merge($validated, [
            'student_user_id'     => $user->id,
            'verification_status' => 'draft',
        ]));

        return redirect()->route('student.projects.index')
            ->with('success', 'Project berhasil ditambahkan.');
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Student/Projects/Form', [
            'project'    => $project->load('internship.period'),
            'internship' => $project->internship,
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'role_in_project' => ['required', 'string', 'max:100'],
            'technologies'    => ['nullable', 'array'],
            'output_types'    => ['nullable', 'array'],
            'project_status'  => ['required', 'in:planning,development,testing,completed'],
        ]);

        // Can only edit if not yet submitted/approved
        if (in_array($project->verification_status, ['approved', 'published'])) {
            return back()->with('error', 'Project yang sudah disetujui tidak dapat diedit.');
        }

        $project->update(array_merge($validated, [
            'verification_status' => 'draft', // reset to draft on edit
        ]));

        return redirect()->route('student.projects.index')
            ->with('success', 'Project berhasil diperbarui.');
    }

    public function submit(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        if (!in_array($project->verification_status, ['draft', 'revision'])) {
            return back()->with('error', 'Project ini sudah dalam proses review.');
        }

        $oldStatus = $project->verification_status;
        $project->update(['verification_status' => 'submitted']);

        VerificationLog::create([
            'verifiable_type' => Project::class,
            'verifiable_id'   => $project->id,
            'actor_id'        => Auth::id(),
            'from_status'     => $oldStatus,
            'to_status'       => 'submitted',
            'notes'           => 'Mahasiswa mengajukan project untuk review.',
            'acted_at'        => now(),
        ]);

        return back()->with('success', 'Project berhasil diajukan untuk review.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        if (in_array($project->verification_status, ['approved', 'published'])) {
            return back()->with('error', 'Project yang sudah disetujui tidak dapat dihapus.');
        }

        $project->delete();

        return redirect()->route('student.projects.index')
            ->with('success', 'Project berhasil dihapus.');
    }
}
