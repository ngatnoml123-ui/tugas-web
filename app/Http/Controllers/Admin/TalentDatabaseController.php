<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TalentDatabaseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::whereHas('role', fn($q) => $q->where('name', 'mahasiswa'))
            ->with([
                'studentProfile',
                'internshipsAsStudent.period',
                'internshipsAsStudent.mentor',
                'projects' => fn($q) => $q->where('verification_status', 'published'),
                'works'    => fn($q) => $q->where('verification_status', 'published'),
                'certificates' => fn($q) => $q->where('verification_status', 'verified'),
            ]);

        // Filter by name
        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        // Filter by university
        if ($request->filled('university')) {
            $query->whereHas('studentProfile', fn($q) =>
                $q->where('university', 'like', "%{$request->university}%")
            );
        }

        // Filter by study_program (prodi)
        if ($request->filled('study_program')) {
            $query->whereHas('studentProfile', fn($q) =>
                $q->where('study_program', 'like', "%{$request->study_program}%")
            );
        }

        // Filter by skill
        if ($request->filled('skill')) {
            $skill = $request->skill;
            $query->whereHas('studentProfile', fn($q) =>
                $q->whereJsonContains('skills', $skill)
            );
        }

        // Filter by division
        if ($request->filled('division')) {
            $query->whereHas('internshipsAsStudent', fn($q) =>
                $q->where('division', 'like', "%{$request->division}%")
            );
        }

        // Filter by technology
        if ($request->filled('technology')) {
            $tech = $request->technology;
            $query->whereHas('works', fn($q) =>
                $q->whereJsonContains('technologies', $tech)
                  ->where('verification_status', 'published')
            );
        }

        $students = $query->paginate(12)->withQueryString();

        // Get distinct values for filter dropdowns
        $universities = StudentProfile::whereNotNull('university')
            ->distinct()->pluck('university')->sort()->values();
        $study_programs = StudentProfile::whereNotNull('study_program')
            ->distinct()->pluck('study_program')->sort()->values();

        return Inertia::render('Admin/TalentDatabase', [
            'students'     => $students,
            'universities' => $universities,
            'study_programs'       => $study_programs,
            'filters'      => $request->only(['name', 'university', 'study_program', 'skill', 'division', 'technology']),
        ]);
    }
}
