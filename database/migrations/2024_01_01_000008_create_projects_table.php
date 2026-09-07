<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->foreignId('student_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('title');
            $table->text('description')->nullable();
            $table->string('role_in_project');       // Frontend Dev, UI/UX Designer, dll.

            // Stored as JSON arrays
            $table->json('technologies')->nullable(); // ["React","Laravel","MySQL"]
            $table->json('output_types')->nullable(); // ["Website","Documentation"]

            $table->enum('project_status', [
                'planning',
                'development',
                'testing',
                'completed',
            ])->default('planning');

            // Verification workflow
            $table->enum('verification_status', [
                'draft',
                'submitted',
                'revision',
                'approved',
                'published',
            ])->default('draft');

            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();

            // Visibility flag (only meaningful when verification_status = published)
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
