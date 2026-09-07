<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Internship;
use App\Models\InternshipPeriod;
use App\Models\Project;
use App\Models\User;
use App\Models\Work;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalStudents   = User::whereHas('role', fn($q) => $q->where('name', 'mahasiswa'))->count();
        $totalMentors    = User::whereHas('role', fn($q) => $q->where('name', 'pembimbing'))->count();
        $totalProjects   = Project::count();
        $totalWorks      = Work::count();
        $totalCerts      = Certificate::count();
        $publishedWorks  = Work::where('verification_status', 'published')->count();
        $pendingReview   = Work::where('verification_status', 'submitted')->count();

        // Chart: Students by Program Studi
        $byStudyProgram = DB::table('student_profiles')
            ->select('study_program', DB::raw('COUNT(*) as count'))
            ->whereNotNull('study_program')
            ->groupBy('study_program')
            ->orderByDesc('count')
            ->limit(8)
            ->get();

        // Chart: Projects by category (output_types, approximate via works category)
        $byWorkCategory = DB::table('works')
            ->select('category', DB::raw('COUNT(*) as count'))
            ->whereNull('deleted_at')
            ->groupBy('category')
            ->get();

        // Chart: Top Skills
        $allSkills = DB::table('student_profiles')
            ->whereNotNull('skills')
            ->pluck('skills');

        $skillCounts = [];
        foreach ($allSkills as $skillJson) {
            $skills = is_string($skillJson) ? json_decode($skillJson, true) : $skillJson;
            if (is_array($skills)) {
                foreach ($skills as $skill) {
                    $skill = trim($skill);
                    if ($skill) {
                        $skillCounts[$skill] = ($skillCounts[$skill] ?? 0) + 1;
                    }
                }
            }
        }
        arsort($skillCounts);
        $topSkills = array_slice($skillCounts, 0, 10, true);
        $topSkillsChart = collect($topSkills)->map(fn($count, $name) => ['skill' => $name, 'count' => $count])->values();

        // Chart: Students by Period
        $byPeriod = InternshipPeriod::withCount('internships')
            ->orderBy('start_date')
            ->get(['id', 'name', 'internships_count']);

        // Project status distribution
        $projectStatuses = DB::table('projects')
            ->select('project_status', DB::raw('COUNT(*) as count'))
            ->whereNull('deleted_at')
            ->groupBy('project_status')
            ->get();

        // Recent registrations
        $recentStudents = User::whereHas('role', fn($q) => $q->where('name', 'mahasiswa'))
            ->with('studentProfile')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalStudents'  => $totalStudents,
                'totalMentors'   => $totalMentors,
                'totalProjects'  => $totalProjects,
                'totalWorks'     => $totalWorks,
                'totalCerts'     => $totalCerts,
                'publishedWorks' => $publishedWorks,
                'pendingReview'  => $pendingReview,
            ],
            'charts' => [
                'byStudyProgram'         => $byStudyProgram,
                'byWorkCategory'  => $byWorkCategory,
                'topSkills'       => $topSkillsChart,
                'byPeriod'        => $byPeriod,
                'projectStatuses' => $projectStatuses,
            ],
            'recentStudents' => $recentStudents,
        ]);
    }
}
