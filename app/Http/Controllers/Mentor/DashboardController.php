<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\Work;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $mentor = Auth::user();

        $internships = Internship::where('mentor_user_id', $mentor->id)
            ->with(['student.studentProfile', 'period'])
            ->where('status', 'active')
            ->get();

        $pendingWorks = Work::whereHas('internship', function ($q) use ($mentor) {
            $q->where('mentor_user_id', $mentor->id);
        })->where('verification_status', 'submitted')
          ->with(['student', 'internship'])
          ->latest()
          ->get();

        $pendingProjects = Project::whereHas('internship', function ($q) use ($mentor) {
            $q->where('mentor_user_id', $mentor->id);
        })->where('verification_status', 'submitted')
          ->with(['student', 'internship'])
          ->latest()
          ->get();

        $stats = [
            'students'     => $internships->count(),
            'pending'      => $pendingWorks->count() + $pendingProjects->count(),
            'approved'     => Work::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
                                ->where('verification_status', 'approved')->count() +
                              Project::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
                                ->where('verification_status', 'approved')->count(),
            'published'    => Work::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
                                ->where('verification_status', 'published')->count() +
                              Project::whereHas('internship', fn($q) => $q->where('mentor_user_id', $mentor->id))
                                ->where('verification_status', 'published')->count(),
        ];

        return Inertia::render('Mentor/Dashboard', [
            'mentor'          => $mentor->load('mentorProfile'),
            'internships'     => $internships,
            'pendingWorks'    => $pendingWorks,
            'pendingProjects' => $pendingProjects,
            'stats'           => $stats,
        ]);
    }
}
