<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\StudentController as AdminStudent;
use App\Http\Controllers\Admin\MentorController as AdminMentor;
use App\Http\Controllers\Admin\ImportController as AdminImport;
use App\Http\Controllers\Admin\PeriodController as AdminPeriod;
use App\Http\Controllers\Admin\TalentDatabaseController;
use App\Http\Controllers\Mentor\DashboardController as MentorDashboard;
use App\Http\Controllers\Mentor\WorkReviewController;
use App\Http\Controllers\Mentor\ProjectReviewController;
use App\Http\Controllers\Student\ActivityController;
use App\Http\Controllers\Student\CertificateController;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\Student\ProjectController;
use App\Http\Controllers\Student\WorkController;
use App\Http\Controllers\PublicPortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─────────────────────────────────────────────────────────
// Public: Portfolio
// ─────────────────────────────────────────────────────────
Route::get('/p/{slug}', [PublicPortfolioController::class, 'show'])
    ->name('portfolio.public');

// ─────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    [LoginController::class, 'create'])->name('login');
    Route::post('/login',   [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register',[RegisterController::class, 'store']);
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ─────────────────────────────────────────────────────────
// Dashboard redirect
// ─────────────────────────────────────────────────────────
Route::get('/dashboard', function () {
    $role = auth()->user()->role?->name;
    return match ($role) {
        'admin'      => redirect()->route('admin.dashboard'),
        'pembimbing' => redirect()->route('mentor.dashboard'),
        'mahasiswa'  => redirect()->route('student.dashboard'),
        default      => redirect('/'),
    };
})->middleware('auth')->name('dashboard');

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login');
});

// ─────────────────────────────────────────────────────────
// Admin Routes
// ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');

        // Students
        Route::get('/students',                [AdminStudent::class, 'index'])->name('students.index');
        Route::post('/students',               [AdminStudent::class, 'store'])->name('students.store');
        Route::patch('/students/{user}/toggle',[AdminStudent::class, 'toggleActive'])->name('students.toggle');
        Route::delete('/students/{user}',      [AdminStudent::class, 'destroy'])->name('students.destroy');

        // Mentors
        Route::get('/mentors',                 [AdminMentor::class, 'index'])->name('mentors.index');
        Route::post('/mentors',                [AdminMentor::class, 'store'])->name('mentors.store');
        Route::patch('/mentors/{user}/toggle', [AdminMentor::class, 'toggleActive'])->name('mentors.toggle');
        Route::delete('/mentors/{user}',       [AdminMentor::class, 'destroy'])->name('mentors.destroy');

        // CSV Import
        Route::get('/import/template',         [AdminImport::class, 'template'])->name('import.template');
        Route::post('/import/students',        [AdminImport::class, 'store'])->name('import.students');

        // Internship Periods
        Route::get('/periods',                        [AdminPeriod::class, 'index'])->name('periods.index');
        Route::post('/periods',                       [AdminPeriod::class, 'store'])->name('periods.store');
        Route::patch('/periods/{period}',             [AdminPeriod::class, 'update'])->name('periods.update');
        Route::delete('/periods/{period}',            [AdminPeriod::class, 'destroy'])->name('periods.destroy');
        Route::patch('/periods/{period}/set-active',  [AdminPeriod::class, 'setActive'])->name('periods.set-active');

        // Talent Database
        Route::get('/talent-database', [TalentDatabaseController::class, 'index'])->name('talent-database');

        // QR Code generation (admin can generate for any student)
        Route::get('/qr/{slug}', [PublicPortfolioController::class, 'generateQr'])->name('qr.generate');
    });

// ─────────────────────────────────────────────────────────
// Mentor Routes
// ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:pembimbing'])
    ->prefix('mentor')
    ->name('mentor.')
    ->group(function () {
        Route::get('/dashboard', [MentorDashboard::class, 'index'])->name('dashboard');

        // Work Review
        Route::get('/works',                     [WorkReviewController::class, 'index'])->name('works.index');
        Route::get('/works/{work}',              [WorkReviewController::class, 'show'])->name('works.show');
        Route::patch('/works/{work}/review',     [WorkReviewController::class, 'review'])->name('works.review');

        // Project Review
        Route::get('/projects',                  [ProjectReviewController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}',        [ProjectReviewController::class, 'show'])->name('projects.show');
        Route::patch('/projects/{project}/review',[ProjectReviewController::class, 'review'])->name('projects.review');
    });

// ─────────────────────────────────────────────────────────
// Student Routes
// ─────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:mahasiswa'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [StudentDashboard::class, 'index'])->name('dashboard');

        // Profile
        Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');

        // QR Code for own portfolio
        Route::get('/qr', [PublicPortfolioController::class, 'generateQr']
        )->defaults('slug', null)->name('qr.generate');
        Route::get('/portfolio/qr', function () {
            $profile = auth()->user()->studentProfile;
            if (!$profile?->public_slug) {
                return back()->with('error', 'Lengkapi profil dan publish portfolio terlebih dahulu.');
            }
            return app(PublicPortfolioController::class)->generateQr($profile->public_slug);
        })->name('portfolio.qr');

        // Projects
        Route::get('/projects',                  [ProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/create',           [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects',                 [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}/edit',   [ProjectController::class, 'edit'])->name('projects.edit');
        Route::patch('/projects/{project}',      [ProjectController::class, 'update'])->name('projects.update');
        Route::patch('/projects/{project}/submit',[ProjectController::class, 'submit'])->name('projects.submit');
        Route::delete('/projects/{project}',     [ProjectController::class, 'destroy'])->name('projects.destroy');

        // Works
        Route::get('/works',                [WorkController::class, 'index'])->name('works.index');
        Route::get('/works/create',         [WorkController::class, 'create'])->name('works.create');
        Route::post('/works',               [WorkController::class, 'store'])->name('works.store');
        Route::get('/works/{work}/edit',    [WorkController::class, 'edit'])->name('works.edit');
        Route::patch('/works/{work}',       [WorkController::class, 'update'])->name('works.update');
        Route::patch('/works/{work}/submit',[WorkController::class, 'submit'])->name('works.submit');
        Route::delete('/works/{work}',      [WorkController::class, 'destroy'])->name('works.destroy');

        // Activities
        Route::get('/activities',               [ActivityController::class, 'index'])->name('activities.index');
        Route::get('/activities/create',        [ActivityController::class, 'create'])->name('activities.create');
        Route::post('/activities',              [ActivityController::class, 'store'])->name('activities.store');
        Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');

        // Certificates
        Route::get('/certificates',                   [CertificateController::class, 'index'])->name('certificates.index');
        Route::get('/certificates/create',            [CertificateController::class, 'create'])->name('certificates.create');
        Route::post('/certificates',                  [CertificateController::class, 'store'])->name('certificates.store');
        Route::delete('/certificates/{certificate}',  [CertificateController::class, 'destroy'])->name('certificates.destroy');
    });
