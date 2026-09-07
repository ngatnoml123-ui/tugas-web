<?php

namespace App\Mail;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Project $project,
        public User $mentor
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Status Project Anda Berubah: ' . $this->project->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project_status_changed',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
