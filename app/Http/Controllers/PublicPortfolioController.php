<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Certificate;
use App\Models\Internship;
use App\Models\PortfolioSetting;
use App\Models\Project;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Work;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PublicPortfolioController extends Controller
{
    public function show(string $slug): Response
    {
        $profile = StudentProfile::where('public_slug', $slug)
            ->where('is_portfolio_published', true)
            ->firstOrFail();

        $user = User::with([
            'studentProfile',
            'internshipsAsStudent.period',
            'internshipsAsStudent.mentor.mentorProfile',
        ])->findOrFail($profile->user_id);

        $settings = PortfolioSetting::firstOrCreate(
            ['student_user_id' => $user->id],
            [
                'show_about'        => true,
                'show_skills'       => true,
                'show_projects'     => true,
                'show_works'        => true,
                'show_experience'   => true,
                'show_certificates' => true,
                'show_contact'      => true,
                'theme_color'       => '#2563EB',
            ]
        );

        $projects = $settings->show_projects
            ? Project::where('student_user_id', $user->id)
                ->where('verification_status', 'published')
                ->with(['works' => function ($query) {
                    $query->where('verification_status', 'published')
                          ->where('is_confidential', false);
                }])
                ->latest()
                ->get()
            : collect();

        $works = $settings->show_works
            ? Work::where('student_user_id', $user->id)
                ->where('verification_status', 'published')
                ->where('is_confidential', false)
                ->latest()
                ->get()
            : collect();

        $certificates = $settings->show_certificates
            ? Certificate::where('student_user_id', $user->id)
                ->where('is_public', true)
                ->latest()
                ->get()
            : collect();

        $activities = Activity::where('student_user_id', $user->id)
                ->with('evidences')
                ->latest('activity_date')
                ->take(10) // Show only latest 10 activities to avoid clutter
                ->get();

        return Inertia::render('Public/Portfolio', [
            'user'         => $user,
            'profile'      => $profile,
            'settings'     => $settings,
            'projects'     => $projects,
            'works'        => $works,
            'certificates' => $certificates,
            'activities'   => $activities,
            'portfolioUrl' => url("/p/{$slug}"),
        ]);
    }

    public function generateQr(string $slug): HttpResponse
    {
        $profile = StudentProfile::where('public_slug', $slug)->firstOrFail();

        // Authorization: only owner or admin can generate
        $user = Auth::user();
        abort_unless(
            $user && ($user->id === $profile->user_id || $user->isAdmin()),
            403
        );

        $url = url("/p/{$slug}");

        $qrCode = QrCode::format('svg')
            ->size(300)
            ->margin(2)
            ->color(37, 99, 235)  // primary blue
            ->backgroundColor(255, 255, 255)
            ->errorCorrection('H')
            ->generate($url);

        // Save to storage
        $path = "qrcodes/{$profile->user_id}.svg";
        Storage::disk('public')->put($path, $qrCode);

        // Update portfolio setting
        \App\Models\PortfolioSetting::updateOrCreate(
            ['student_user_id' => $profile->user_id],
            ['qr_code_path'    => $path]
        );

        return response($qrCode, 200, [
            'Content-Type'        => 'image/svg+xml',
            'Content-Disposition' => "attachment; filename=\"qr-portfolio-{$slug}.svg\"",
        ]);
    }
}
