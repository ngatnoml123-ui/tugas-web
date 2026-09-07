<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'password',
        'avatar',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    // ── Relations ──────────────────────────────────────────────
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class, 'user_id');
    }

    public function mentorProfile(): HasOne
    {
        return $this->hasOne(MentorProfile::class, 'user_id');
    }

    public function internshipsAsStudent(): HasMany
    {
        return $this->hasMany(Internship::class, 'student_user_id');
    }

    public function internshipsAsMentor(): HasMany
    {
        return $this->hasMany(Internship::class, 'mentor_user_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'student_user_id');
    }

    public function works(): HasMany
    {
        return $this->hasMany(Work::class, 'student_user_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'student_user_id');
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'student_user_id');
    }

    public function portfolioSetting(): HasOne
    {
        return $this->hasOne(PortfolioSetting::class, 'student_user_id');
    }

    // ── Helpers ─────────────────────────────────────────────────
    public function isAdmin(): bool
    {
        return $this->role?->name === 'admin';
    }

    public function isMentor(): bool
    {
        return $this->role?->name === 'pembimbing';
    }

    public function isStudent(): bool
    {
        return $this->role?->name === 'mahasiswa';
    }

    public function getRoleName(): string
    {
        return $this->role?->name ?? 'unknown';
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return \Illuminate\Support\Facades\Storage::url($this->avatar);
        }
        $name = urlencode($this->name);
        return "https://ui-avatars.com/api/?name={$name}&background=2563eb&color=fff&bold=true";
    }
}
