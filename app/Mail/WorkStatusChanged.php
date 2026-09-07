<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Work;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WorkStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Work $work,
        public User $reviewer,
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = match ($this->work->verification_status) {
            'approved'  => '✅ Disetujui',
            'revision'  => '🔄 Perlu Revisi',
            'published' => '🌐 Dipublikasikan',
            default     => ucfirst($this->work->verification_status),
        };

        return new Envelope(
            subject: "[Saka InternHub] Karya Anda: {$statusLabel} — {$this->work->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.work-status-changed',
        );
    }
}
