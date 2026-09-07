<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->foreignId('student_user_id')->constrained('users')->cascadeOnDelete();

            // Relasi opsional ke project dan/atau work
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('work_id')->nullable()->constrained('works')->nullOnDelete();

            $table->date('activity_date');
            $table->string('title');                  // judul singkat aktivitas
            $table->text('description');              // deskripsi kegiatan
            $table->text('output')->nullable();       // hasil / keluaran

            $table->enum('status', [
                'pending',
                'in_progress',
                'completed',
            ])->default('completed');

            // Evidence: bisa lebih dari satu file → tabel activity_evidences
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
