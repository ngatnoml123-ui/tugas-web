<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel `works` = Karya Mahasiswa (Modul 5).
     * Terpisah dari projects, namun dapat dikaitkan ke project (opsional).
     * Punya alur verifikasi sendiri (submit → review → revision → approved → published).
     */
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('internship_id')->constrained('internships')->cascadeOnDelete();

            // Opsional: karya bisa dikaitkan ke project tertentu
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            // Kategori utama karya
            $table->enum('category', [
                'software',    // Website, Mobile App, Desktop App, Sistem Informasi
                'design',      // UI/UX, Graphic Design, Prototype
                'data',        // Dashboard, Data Analysis, Data Visualization
                'research',    // Research, Article, Paper
                'documentation', // Technical Doc, User Manual, SOP
                'other',       // Digital Content, Video, Presentation, Innovation
            ]);

            // Sub-kategori (free text agar fleksibel)
            $table->string('sub_category')->nullable(); // e.g. "Website", "UI/UX", "Dashboard"

            // Karya bisa berupa file upload DAN/ATAU external link
            $table->string('file_path')->nullable();      // path file yang diunggah
            $table->string('file_original_name')->nullable();
            $table->string('file_mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable(); // bytes
            $table->string('external_link')->nullable();  // URL demo / GitHub / Figma

            // Cover image untuk preview di portofolio publik
            $table->string('thumbnail_path')->nullable();

            // Tags teknologi yang digunakan (JSON array)
            $table->json('technologies')->nullable();

            // Verification workflow (terpisah dari project)
            $table->enum('verification_status', [
                'draft',
                'submitted',
                'revision',
                'approved',
                'published',
            ])->default('draft');

            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();     // feedback pembimbing / alasan revisi

            $table->boolean('is_confidential')->default(false); // tidak tampil di publik jika true

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
