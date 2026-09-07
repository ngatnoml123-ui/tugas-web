<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityEvidence extends Model
{
    protected $table = 'activity_evidences';

    protected $fillable = [
        'activity_id',
        'file_path',
        'file_original_name',
        'file_mime_type',
        'file_size',
        'caption',
    ];

    protected $appends = [
        'file_url',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function getFileUrlAttribute(): string
    {
        return \Illuminate\Support\Facades\Storage::url($this->file_path);
    }
}
