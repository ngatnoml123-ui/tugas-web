<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImportController extends Controller
{
    public function template(): StreamedResponse
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="template_import_mahasiswa.csv"',
        ];

        $columns = ['nama', 'email', 'nim', 'universitas', 'program_studi', 'semester', 'divisi_pkl'];

        return response()->stream(function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            fputcsv($file, ['Ahmad Mahasiswa', 'ahmad@example.com', '12345678', 'Universitas Contoh', 'Teknik Informatika', '5', 'Web Development']);
            fputcsv($file, ['Siti Mahasiswi', 'siti@example.com', '87654321', 'Institut Contoh', 'Sistem Informasi', '3', 'UI/UX Design']);
            fclose($file);
        }, 200, $headers);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file'      => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
            'period_id' => ['nullable', 'exists:internship_periods,id'],
            'mentor_id' => ['nullable', 'exists:users,id'],
        ]);

        $studentRole = Role::where('name', 'mahasiswa')->firstOrFail();

        $file   = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        fgetcsv($handle); // skip header

        $created = 0;
        $skipped = 0;
        $errors  = [];
        $row     = 1;

        while (($line = fgetcsv($handle)) !== false) {
            $row++;

            if (count($line) < 2) {
                $errors[] = "Baris {$row}: Format tidak valid.";
                continue;
            }

            [$name, $email, $nim, $university, $study_program, $semester, $division] = array_pad($line, 7, null);

            $name  = trim($name ?? '');
            $email = trim(strtolower($email ?? ''));

            if (empty($name) || empty($email)) {
                $errors[] = "Baris {$row}: Nama atau email kosong.";
                $skipped++;
                continue;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Baris {$row}: Email '{$email}' tidak valid.";
                $skipped++;
                continue;
            }

            if (User::where('email', $email)->exists()) {
                $errors[] = "Baris {$row}: Email '{$email}' sudah terdaftar, dilewati.";
                $skipped++;
                continue;
            }

            try {
                $user = User::create([
                    'name'      => $name,
                    'email'     => $email,
                    'password'  => Hash::make('password123'),
                    'role_id'   => $studentRole->id,
                    'is_active' => true,
                ]);

                $slug = Str::slug($user->name . '-' . Str::random(4));
                while (StudentProfile::where('public_slug', $slug)->exists()) {
                    $slug = Str::slug($user->name . '-' . Str::random(4));
                }

                StudentProfile::create([
                    'user_id'       => $user->id,
                    'nim'           => trim($nim ?? ''),
                    'university'    => trim($university ?? ''),
                    'study_program' => trim($study_program ?? ''),
                    'semester'      => is_numeric($semester) ? (int) $semester : null,
                    'public_slug'   => $slug,
                ]);

                if ($request->filled('period_id') && $request->filled('mentor_id')) {
                    Internship::create([
                        'student_user_id' => $user->id,
                        'mentor_user_id'  => $request->mentor_id,
                        'period_id'       => $request->period_id,
                        'division'        => trim($division ?? '-'),
                        'start_date'      => now()->toDateString(),
                        'status'          => 'active',
                    ]);
                }

                $created++;
            } catch (\Throwable $e) {
                $errors[] = "Baris {$row}: Gagal — {$e->getMessage()}";
                $skipped++;
            }
        }

        fclose($handle);

        $message = "{$created} akun mahasiswa berhasil dibuat" .
            ($skipped > 0 ? ", {$skipped} baris dilewati." : '.');

        return back()->with('success', $message)->with('import_errors', $errors);
    }
}
