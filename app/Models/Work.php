<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Work extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_user_id',
        'internship_id',
        'project_id',
        'title',
        'description',
        'category',
        'sub_category',
        'file_path',
        'file_original_name',
        'file_mime_type',
        'file_size',
        'external_link',
        'thumbnail_path',
        'technologies',
        'verification_status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'is_confidential',
    ];

    protected $appends = [
        'file_url',
        'thumbnail_url',
    ];

    protected $casts = [
        'technologies'    => 'array',
        'reviewed_at'     => 'datetime',
        'is_confidential' => 'boolean',
        'file_size'       => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function verificationLogs(): MorphMany
    {
        return $this->morphMany(VerificationLog::class, 'verifiable');
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? \Illuminate\Support\Facades\Storage::url($this->file_path) : null;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path ? \Illuminate\Support\Facades\Storage::url($this->thumbnail_path) : null;
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'software'      => 'Software',
            'design'        => 'Design',
            'data'          => 'Data',
            'research'      => 'Research',
            'documentation' => 'Documentation',
            'other'         => 'Other',
            default         => ucfirst($this->category),
        };
    }
}
