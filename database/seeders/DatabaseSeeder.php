<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Roles ──────────────────────────────────────────────────────────
        $roles = [
            ['name' => 'admin',       'display_name' => 'Admin PT Saka Inovasi Network', 'description' => 'Mengelola keseluruhan sistem'],
            ['name' => 'pembimbing',  'display_name' => 'Pembimbing Perusahaan',         'description' => 'Memantau dan memverifikasi mahasiswa'],
            ['name' => 'mahasiswa',   'display_name' => 'Mahasiswa PKL',                 'description' => 'Mengelola portofolio pribadi'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(['name' => $role['name']], array_merge($role, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');

        // ── 2. Admin User ─────────────────────────────────────────────────────
        $adminUserId = DB::table('users')->insertGetId([
            'role_id'    => $adminRoleId,
            'name'       => 'Administrator',
            'email'      => 'admin@sakainternhub.id',
            'password'   => Hash::make('Admin@Saka2026'),
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ── 3. Default Internship Period ──────────────────────────────────────
        DB::table('internship_periods')->insert([
            'name'       => 'Semester Genap 2025/2026',
            'start_date' => '2026-01-01',
            'end_date'   => '2026-06-30',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
