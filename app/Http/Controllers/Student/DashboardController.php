<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Certificate;
use App\Models\Internship;
use App\Models\Project;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user()->load(['studentProfile', 'role']);

        $internship = Internship::where('student_user_id', $user->id)
            ->with(['period', 'mentor.mentorProfile'])
            ->latest()
            ->first();

        $stats = [
            'projects'     => Project::where('student_user_id', $user->id)->count(),
            'works'        => Work::where('student_user_id', $user->id)->count(),
            'activities'   => Activity::where('student_user_id', $user->id)->count(),
            'certificates' => Certificate::where('student_user_id', $user->id)->count(),
            'published'    => Work::where('student_user_id', $user->id)
                                ->where('verification_status', 'published')->count(),
            'pending'      => Work::where('student_user_id', $user->id)
                                ->whereIn('verification_status', ['submitted', 'revision'])->count(),
        ];

        $recentActivities = Activity::where('student_user_id', $user->id)
            ->latest('activity_date')
            ->limit(5)
            ->get();

        $recentWorks = Work::where('student_user_id', $user->id)
            ->latest()
            ->limit(4)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'user'             => $user,
            'internship'       => $internship,
            'stats'            => $stats,
            'recentActivities' => $recentActivities,
            'recentWorks'      => $recentWorks,
        ]);
    }
}
