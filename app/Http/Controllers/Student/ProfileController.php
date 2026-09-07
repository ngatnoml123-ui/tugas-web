<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        $user = Auth::user()->load(['studentProfile', 'role']);

        return Inertia::render('Student/Profile', [
            'user'    => $user,
            'profile' => $user->studentProfile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'nim'              => ['nullable', 'string', 'max:50'],
            'university'       => ['nullable', 'string', 'max:255'],
            'study_program'            => ['nullable', 'string', 'max:255'],
            'semester'         => ['nullable', 'integer', 'min:1', 'max:14'],
            'phone'            => ['nullable', 'string', 'max:20'],
            'address'          => ['nullable', 'string', 'max:500'],
            'internship_field' => ['nullable', 'string', 'max:255'],
            'skills'           => ['nullable', 'array'],
            'bio'              => ['nullable', 'string', 'max:1000'],
            'avatar'           => ['nullable', 'image', 'max:2048'],
        ]);

        // Update user name
        $user->update(['name' => $request->name]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $avatarPath = $request->file('avatar')->store("avatars/{$user->id}", 'public');
            $user->update(['avatar' => $avatarPath]);
        }

        // Generate slug if not exists
        $profile = $user->studentProfile;
        $slug = $profile?->public_slug;
        if (!$slug) {
            $slug = Str::slug($user->name . '-' . now()->year);
            // Ensure uniqueness
            $baseSlug = $slug;
            $count = 1;
            while (StudentProfile::where('public_slug', $slug)->where('user_id', '!=', $user->id)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
        }

        // Upsert student profile
        StudentProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nim'              => $request->nim,
                'university'       => $request->university,
                'study_program'            => $request->study_program,
                'semester'         => $request->semester,
                'phone'            => $request->phone,
                'address'          => $request->address,
                'internship_field' => $request->internship_field,
                'skills'           => $request->skills ?? [],
                'bio'              => $request->bio,
                'public_slug'      => $slug,
            ]
        );

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
