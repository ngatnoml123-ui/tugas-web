<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Internship extends Model
{
    protected $fillable = [
        'student_user_id',
        'mentor_user_id',
        'period_id',
        'division',
        'start_date',
        'end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_user_id');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(InternshipPeriod::class, 'period_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function works(): HasMany
    {
        return $this->hasMany(Work::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
}
