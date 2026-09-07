<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('title');                  // Nama sertifikat / penghargaan
            $table->string('issuer')->nullable();     // Penerbit / lembaga

            // Tipe: sertifikat, penghargaan, seminar, workshop, training, achievement
            $table->enum('type', [
                'certificate',
                'award',
                'seminar',
                'workshop',
                'training',
                'achievement',
            ])->default('certificate');

            $table->date('issued_date')->nullable();
            $table->date('expired_date')->nullable();
            $table->string('credential_id')->nullable(); // ID sertifikat resmi
            $table->string('credential_url')->nullable(); // Link verifikasi
            $table->text('description')->nullable();

            // File sertifikat yang diunggah
            $table->string('file_path')->nullable();
            $table->string('file_original_name')->nullable();

            // Verification by pembimbing/admin
            $table->enum('verification_status', [
                'pending',
                'verified',
                'rejected',
            ])->default('pending');

            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();

            // Tampil di portofolio publik atau tidak
            $table->boolean('is_public')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
