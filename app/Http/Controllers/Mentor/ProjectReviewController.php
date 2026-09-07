<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Mail\ProjectStatusChanged;
use App\Models\VerificationLog;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ProjectReviewController extends Controller
{
    public function index(): Response
    {
        $mentor = Auth::user();

        $projects = Project::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
            ->with(['student.studentProfile', 'internship.period'])
            ->whereIn('verification_status', ['submitted', 'revision', 'approved', 'published'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Mentor/ProjectReview', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project): Response
    {
        $mentor = Auth::user();

        // Verify mentor supervises this student
        abort_unless($project->internship->mentor_user_id === $mentor->id, 403);

        $project->load(['student.studentProfile', 'internship.period', 'verificationLogs.actor']);

        return Inertia::render('Mentor/ProjectDetail', [
            'project' => $project,
        ]);
    }

    public function review(Request $request, Project $project): RedirectResponse
    {
        $mentor = Auth::user();
        abort_unless($project->internship->mentor_user_id === $mentor->id, 403);

        $request->validate([
            'action' => ['required', 'in:approve,revision,published'],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ]);

        $newStatus = match ($request->action) {
            'approve'   => 'approved',
            'revision'  => 'revision',
            'published' => 'published',
        };

        $oldStatus = $project->verification_status;

        $project->update([
            'verification_status' => $newStatus,
            'reviewed_by'         => $mentor->id,
            'reviewed_at'         => now(),
            'review_notes'        => $request->notes,
        ]);

        VerificationLog::create([
            'verifiable_type' => Project::class,
            'verifiable_id'   => $project->id,
            'actor_id'        => $mentor->id,
            'from_status'     => $oldStatus,
            'to_status'       => $newStatus,
            'notes'           => $request->notes,
            'acted_at'        => now(),
        ]);

        // Send email notification
        try {
            Mail::to($project->student->email)->send(new ProjectStatusChanged($project, $mentor));
        } catch (\Exception $e) {
            // Log but don't fail the request
            logger()->warning('Failed to send project status email: ' . $e->getMessage());
        }

        return back()->with('success', "Project berhasil di-update ke status: {$newStatus}.");
    }
}
