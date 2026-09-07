<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nim',
        'university',
        'study_program',
        'semester',
        'phone',
        'address',
        'internship_field',
        'skills',
        'bio',
        'public_slug',
        'is_portfolio_published',
    ];

    protected $casts = [
        'skills'                 => 'array',
        'is_portfolio_published' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
