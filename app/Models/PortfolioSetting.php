<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioSetting extends Model
{
    protected $fillable = [
        'student_user_id',
        'show_about',
        'show_skills',
        'show_projects',
        'show_works',
        'show_experience',
        'show_certificates',
        'show_contact',
        'theme_color',
        'qr_code_path',
    ];

    protected $casts = [
        'show_about'        => 'boolean',
        'show_skills'       => 'boolean',
        'show_projects'     => 'boolean',
        'show_works'        => 'boolean',
        'show_experience'   => 'boolean',
        'show_certificates' => 'boolean',
        'show_contact'      => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function getQrCodeUrlAttribute(): ?string
    {
        return $this->qr_code_path ? \Illuminate\Support\Facades\Storage::url($this->qr_code_path) : null;
    }
}
