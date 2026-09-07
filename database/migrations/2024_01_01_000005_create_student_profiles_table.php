<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();

            // Identitas akademik
            $table->string('nim')->unique()->nullable();
            $table->string('university');
            $table->string('study_program');          // Program Studi
            $table->string('faculty')->nullable();
            $table->string('semester')->nullable();   // e.g. "6"

            // Bio & personal
            $table->text('bio')->nullable();
            $table->string('phone')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();  // external portfolio if any

            // Skills: stored as JSON array ["Laravel","React","Figma"]
            $table->json('skills')->nullable();

            // Public portfolio slug  e.g. "budi-santoso-2026"
            $table->string('public_slug')->unique()->nullable();

            // Whether the public portfolio page is visible
            $table->boolean('is_portfolio_published')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
