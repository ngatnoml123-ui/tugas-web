<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certificate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_user_id',
        'title',
        'issuer',
        'type',
        'issued_date',
        'expired_date',
        'credential_id',
        'credential_url',
        'description',
        'file_path',
        'file_original_name',
        'verification_status',
        'verified_by',
        'verified_at',
        'verification_notes',
        'is_public',
    ];

    protected $appends = [
        'file_url',
    ];

    protected $casts = [
        'issued_date'  => 'date',
        'expired_date' => 'date',
        'verified_at'  => 'datetime',
        'is_public'    => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function verificationLogs(): MorphMany
    {
        return $this->morphMany(VerificationLog::class, 'verifiable');
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? \Illuminate\Support\Facades\Storage::url($this->file_path) : null;
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'certificate'  => 'Sertifikat',
            'award'        => 'Penghargaan',
            'seminar'      => 'Seminar',
            'workshop'     => 'Workshop',
            'training'     => 'Training',
            'achievement'  => 'Achievement',
            default        => ucfirst($this->type),
        };
    }
}
