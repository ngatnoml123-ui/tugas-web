$profile = \App\Models\StudentProfile::where('public_slug', 'ahmad-mahasiswa-8a24')->firstOrFail();
$user = \App\Models\User::find($profile->user_id);
$internship = \App\Models\Internship::where('student_user_id', $user->id)->first();

if (!$internship) {
    echo 'No internship found for this user.';
    exit;
}

// Create a Project
$project = \App\Models\Project::create([
    'internship_id' => $internship->id,
    'student_user_id' => $user->id,
    'title' => 'Sistem Informasi Akademik Terpadu',
    'description' => 'Membangun sistem informasi akademik dari awal hingga deployment. Menggunakan framework Laravel dan React.',
    'role_in_project' => 'Fullstack Developer',
    'technologies' => ['Laravel', 'React', 'Tailwind', 'MySQL'],
    'output_types' => ['Source Code', 'Design UI/UX'],
    'project_status' => 'completed',
    'verification_status' => 'published',
    'reviewed_by' => $internship->mentor_user_id,
    'reviewed_at' => now(),
    'is_featured' => true,
]);

// Create Works for the Project
// Work 1: UI/UX Design (Thumbnail)
\App\Models\Work::create([
    'student_user_id' => $user->id,
    'internship_id' => $internship->id,
    'project_id' => $project->id,
    'title' => 'Mockup UI/UX SIAKAD',
    'description' => 'Desain antarmuka sistem informasi.',
    'category' => 'design',
    'sub_category' => 'Figma Design',
    'external_link' => 'https://figma.com',
    'verification_status' => 'published',
    'reviewed_by' => $internship->mentor_user_id,
    'reviewed_at' => now(),
    'is_confidential' => false,
]);

// Work 2: Laporan Teknis (File without thumbnail)
\App\Models\Work::create([
    'student_user_id' => $user->id,
    'internship_id' => $internship->id,
    'project_id' => $project->id,
    'title' => 'Laporan Teknis Pengembangan',
    'description' => 'Dokumentasi REST API dan arsitektur database.',
    'category' => 'documentation',
    'sub_category' => 'API Docs',
    'file_path' => 'dummy/laporan.pdf', // Dummy path
    'file_original_name' => 'Laporan_Teknis_SIAKAD.pdf',
    'file_size' => 1048576, // 1MB
    'verification_status' => 'published',
    'reviewed_by' => $internship->mentor_user_id,
    'reviewed_at' => now(),
    'is_confidential' => false,
]);

// Create a Certificate
\App\Models\Certificate::create([
    'student_user_id' => $user->id,
    'title' => 'Sertifikat Penyelesaian Magang',
    'issuer' => 'PT Saka Inovasi Network',
    'type' => 'certificate',
    'issued_date' => now()->subDays(5),
    'credential_url' => 'https://example.com/verify/12345',
    'file_path' => 'dummy/sertifikat.pdf', // Dummy path
    'file_original_name' => 'Sertifikat_Ahmad.pdf',
    'verification_status' => 'published',
    'verified_by' => $internship->mentor_user_id,
    'verified_at' => now(),
    'is_public' => true,
]);

echo 'Dummy data created successfully!';