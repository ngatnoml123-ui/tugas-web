<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'internship_id',
        'student_user_id',
        'title',
        'description',
        'role_in_project',
        'technologies',
        'output_types',
        'project_status',
        'verification_status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'is_featured',
    ];

    protected $casts = [
        'technologies'    => 'array',
        'output_types'    => 'array',
        'reviewed_at'     => 'datetime',
        'is_featured'     => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function works(): HasMany
    {
        return $this->hasMany(Work::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function verificationLogs(): MorphMany
    {
        return $this->morphMany(VerificationLog::class, 'verifiable');
    }
}
