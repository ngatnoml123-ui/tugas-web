<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pengaturan tampilan portofolio publik per mahasiswa.
     * Admin/mahasiswa dapat memilih section mana yang ditampilkan.
     */
    public function up(): void
    {
        Schema::create('portfolio_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_user_id')->unique()->constrained('users')->cascadeOnDelete();

            // Toggle section yang tampil di halaman publik
            $table->boolean('show_about')->default(true);
            $table->boolean('show_skills')->default(true);
            $table->boolean('show_projects')->default(true);
            $table->boolean('show_works')->default(true);
            $table->boolean('show_experience')->default(true);
            $table->boolean('show_certificates')->default(true);
            $table->boolean('show_contact')->default(true);

            // Warna tema portofolio (opsional kustomisasi ringan)
            $table->string('theme_color')->default('#2563EB'); // Biru utama

            // QR Code — disimpan sebagai path file SVG/PNG yang digenerate
            $table->string('qr_code_path')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_settings');
    }
};
