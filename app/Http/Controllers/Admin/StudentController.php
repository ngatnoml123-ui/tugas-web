<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\InternshipPeriod;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::whereHas('role', fn($q) => $q->where('name', 'mahasiswa'))
            ->with(['studentProfile', 'internshipsAsStudent.period'])
            ->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        if ($request->filled('study_program')) {
            $query->whereHas('studentProfile', fn($q) => $q->where('study_program', 'like', "%{$request->study_program}%"));
        }

        if ($request->filled('university')) {
            $query->whereHas('studentProfile', fn($q) => $q->where('university', 'like', "%{$request->university}%"));
        }

        $students = $query->paginate(15)->withQueryString();

        $periods  = InternshipPeriod::orderByDesc('start_date')->get(['id', 'name']);
        $mentors  = User::whereHas('role', fn($q) => $q->where('name', 'pembimbing'))
                        ->with('mentorProfile')
                        ->get(['id', 'name']);

        return Inertia::render('Admin/Students', [
            'students' => $students,
            'periods'  => $periods,
            'mentors'  => $mentors,
            'filters'  => $request->only(['search', 'study_program', 'university']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email'],
            'nim'           => ['nullable', 'string', 'max:50'],
            'university'    => ['nullable', 'string', 'max:255'],
            'study_program' => ['nullable', 'string', 'max:255'],
            'semester'      => ['nullable', 'integer', 'min:1', 'max:14'],
            'period_id'     => ['required', 'exists:internship_periods,id'],
            'mentor_id'     => ['required', 'exists:users,id'],
            'division'      => ['nullable', 'string', 'max:255'],
        ]);

        $studentRole = Role::where('name', 'mahasiswa')->firstOrFail();

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make('password123'),
            'role_id'   => $studentRole->id,
            'is_active' => true,
        ]);

        $slug = Str::slug($user->name . '-' . Str::random(4));
        while (StudentProfile::where('public_slug', $slug)->exists()) {
            $slug = Str::slug($user->name . '-' . Str::random(4));
        }

        StudentProfile::create([
            'user_id'       => $user->id,
            'nim'           => $request->nim,
            'university'    => $request->university,
            'study_program' => $request->study_program,
            'semester'      => $request->semester,
            'public_slug'   => $slug,
        ]);

        if ($request->filled('period_id') && $request->filled('mentor_id')) {
            Internship::create([
                'student_user_id' => $user->id,
                'mentor_user_id'  => $request->mentor_id,
                'period_id'       => $request->period_id,
                'division'        => $request->division ?? '-',
                'start_date'      => now()->toDateString(),
                'status'          => 'active',
            ]);
        }

        return back()->with('success', "Akun mahasiswa {$user->name} berhasil dibuat. Password default: password123");
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Akun mahasiswa berhasil {$status}.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Admin tidak dapat dihapus.');
        }
        $user->delete();
        return back()->with('success', 'Akun mahasiswa berhasil dihapus.');
    }
}
