<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Log audit setiap perubahan status verifikasi.
     * Menggunakan polymorphic relation → bisa mencatat perubahan di
     * tabel projects, works, maupun certificates.
     */
    public function up(): void
    {
        Schema::create('verification_logs', function (Blueprint $table) {
            $table->id();

            // Polymorphic: verifiable_type = "App\Models\Project" | "App\Models\Work" | "App\Models\Certificate"
            $table->morphs('verifiable');

            $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete(); // siapa yang melakukan
            $table->string('from_status');
            $table->string('to_status');
            $table->text('notes')->nullable();           // alasan / feedback
            $table->timestamp('acted_at')->useCurrent();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_logs');
    }
};
