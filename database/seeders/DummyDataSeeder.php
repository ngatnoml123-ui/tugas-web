<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\MentorProfile;
use App\Models\InternshipPeriod;
use App\Models\Internship;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $mentorRole = Role::where('name', 'pembimbing')->first();
        $studentRole = Role::where('name', 'mahasiswa')->first();

        // 1. Create Mentors
        $mentor1 = User::firstOrCreate(['email' => 'mentor1@sakainternhub.id'], [
            'name' => 'Budi Pembimbing, S.Kom',
            'password' => Hash::make('password123'),
            'role_id' => $mentorRole->id,
        ]);
        MentorProfile::firstOrCreate(['user_id' => $mentor1->id], [
            'position' => 'Senior Developer',
            'division' => 'IT',
            'phone' => '081234567890',
        ]);

        $mentor2 = User::firstOrCreate(['email' => 'mentor2@sakainternhub.id'], [
            'name' => 'Siti Designer, S.Ds',
            'password' => Hash::make('password123'),
            'role_id' => $mentorRole->id,
        ]);
        MentorProfile::firstOrCreate(['user_id' => $mentor2->id], [
            'position' => 'Lead UI/UX',
            'division' => 'Design',
            'phone' => '081298765432',
        ]);

        // 2. Create Internship Period
        $period = InternshipPeriod::firstOrCreate(['name' => 'Batch Ganjil 2026'], [
            'start_date' => '2026-08-01',
            'end_date' => '2026-12-31',
            'is_active' => true,
        ]);

        // 3. Create Students
        $student1 = User::firstOrCreate(['email' => 'student1@sakainternhub.id'], [
            'name' => 'Ahmad Mahasiswa',
            'password' => Hash::make('password123'),
            'role_id' => $studentRole->id,
        ]);
        StudentProfile::firstOrCreate(['user_id' => $student1->id], [
            'nim' => '1010101',
            'university' => 'Universitas Teknologi',
            'study_program' => 'Teknik Informatika',
            'skills' => ['Laravel', 'React', 'Tailwind'],
            'public_slug' => 'ahmad-mahasiswa',
            'is_portfolio_published' => true,
        ]);
        Internship::firstOrCreate(['student_user_id' => $student1->id], [
            'period_id' => $period->id,
            'mentor_user_id' => $mentor1->id,
            'division' => 'Web Development',
            'start_date' => '2026-08-01',
            'status' => 'active',
        ]);

        $student2 = User::firstOrCreate(['email' => 'student2@sakainternhub.id'], [
            'name' => 'Diana Desainer',
            'password' => Hash::make('password123'),
            'role_id' => $studentRole->id,
        ]);
        StudentProfile::firstOrCreate(['user_id' => $student2->id], [
            'nim' => '2020202',
            'university' => 'Institut Seni',
            'study_program' => 'Desain Komunikasi Visual',
            'skills' => ['Figma', 'UI/UX', 'Illustrator'],
            'public_slug' => 'diana-desainer',
            'is_portfolio_published' => true,
        ]);
        Internship::firstOrCreate(['student_user_id' => $student2->id], [
            'period_id' => $period->id,
            'mentor_user_id' => $mentor2->id,
            'division' => 'UI/UX Design',
            'start_date' => '2026-08-01',
            'status' => 'active',
        ]);
    }
}
