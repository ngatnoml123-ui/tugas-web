<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel `internships` merepresentasikan satu instance PKL mahasiswa.
     * Seorang mahasiswa bisa PKL lebih dari sekali (multi-periode).
     */
    public function up(): void
    {
        Schema::create('internships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mentor_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('period_id')->constrained('internship_periods')->restrictOnDelete();

            $table->string('division');              // IT, UI/UX, Software Dev, Data, dll.
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->text('notes')->nullable();       // catatan admin

            $table->timestamps();

            // Satu mahasiswa hanya boleh punya satu PKL aktif per periode
            $table->unique(['student_user_id', 'period_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internships');
    }
};
