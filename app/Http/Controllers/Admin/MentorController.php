<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MentorProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class MentorController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::whereHas('role', fn($q) => $q->where('name', 'pembimbing'))
            ->with(['mentorProfile', 'internshipsAsMentor.student'])
            ->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        $mentors = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Mentors', [
            'mentors' => $mentors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'unique:users,email'],
            'position'    => ['nullable', 'string', 'max:255'],
            'division'    => ['nullable', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:20'],
            'employee_id' => ['nullable', 'string', 'max:50'],
        ]);

        $mentorRole = Role::where('name', 'pembimbing')->firstOrFail();

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make('password123'),
            'role_id'   => $mentorRole->id,
            'is_active' => true,
        ]);

        MentorProfile::create([
            'user_id'     => $user->id,
            'position'    => $request->position,
            'division'    => $request->division,
            'phone'       => $request->phone,
            'employee_id' => $request->employee_id,
        ]);

        return back()->with('success', "Akun mentor {$user->name} berhasil dibuat. Password default: password123");
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Akun mentor berhasil {$status}.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Admin tidak dapat dihapus.');
        }
        $user->delete();
        return back()->with('success', 'Akun mentor berhasil dihapus.');
    }
}
