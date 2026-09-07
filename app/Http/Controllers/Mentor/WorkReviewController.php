<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Mail\WorkStatusChanged;
use App\Models\VerificationLog;
use App\Models\Work;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class WorkReviewController extends Controller
{
    public function index(): Response
    {
        $mentor = Auth::user();

        $works = Work::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
            ->with(['student.studentProfile', 'project', 'internship.period'])
            ->whereIn('verification_status', ['submitted', 'revision', 'approved', 'published'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Mentor/WorkReview', [
            'works' => $works,
        ]);
    }

    public function show(Work $work): Response
    {
        $mentor = Auth::user();

        // Verify mentor supervises this student
        abort_unless($work->internship->mentor_user_id === $mentor->id, 403);

        $work->load(['student.studentProfile', 'project', 'internship.period', 'verificationLogs.actor']);

        return Inertia::render('Mentor/WorkDetail', [
            'work' => $work,
        ]);
    }

    public function review(Request $request, Work $work): RedirectResponse
    {
        $mentor = Auth::user();
        abort_unless($work->internship->mentor_user_id === $mentor->id, 403);

        $request->validate([
            'action' => ['required', 'in:approve,revision,published'],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ]);

        $newStatus = match ($request->action) {
            'approve'   => 'approved',
            'revision'  => 'revision',
            'published' => 'published',
        };

        $oldStatus = $work->verification_status;

        $work->update([
            'verification_status' => $newStatus,
            'reviewed_by'         => $mentor->id,
            'reviewed_at'         => now(),
            'review_notes'        => $request->notes,
        ]);

        VerificationLog::create([
            'verifiable_type' => Work::class,
            'verifiable_id'   => $work->id,
            'actor_id'        => $mentor->id,
            'from_status'     => $oldStatus,
            'to_status'       => $newStatus,
            'notes'           => $request->notes,
            'acted_at'        => now(),
        ]);

        // Send email notification
        try {
            Mail::to($work->student->email)->send(new WorkStatusChanged($work, $mentor));
        } catch (\Exception $e) {
            // Log but don't fail the request
            logger()->warning('Failed to send work status email: ' . $e->getMessage());
        }

        return back()->with('success', "Karya berhasil di-update ke status: {$newStatus}.");
    }
}
