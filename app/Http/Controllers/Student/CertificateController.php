<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\VerificationLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $certificates = Certificate::where('student_user_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Student/Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Student/Certificates/Form', [
            'certificate' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'issuer'         => ['nullable', 'string', 'max:255'],
            'type'           => ['required', 'in:certificate,award,seminar,workshop,training,achievement'],
            'issued_date'    => ['nullable', 'date'],
            'expired_date'   => ['nullable', 'date', 'after:issued_date'],
            'credential_id'  => ['nullable', 'string', 'max:100'],
            'credential_url' => ['nullable', 'url'],
            'description'    => ['nullable', 'string'],
            'is_public'      => ['boolean'],
            'file'           => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $data = array_merge($validated, [
            'student_user_id'     => $user->id,
            'verification_status' => 'pending',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $data['file_path']          = $file->store("certificates/{$user->id}", 'public');
            $data['file_original_name'] = $file->getClientOriginalName();
        }

        Certificate::create($data);

        return redirect()->route('student.certificates.index')
            ->with('success', 'Sertifikat berhasil ditambahkan.');
    }

    public function destroy(Certificate $certificate): RedirectResponse
    {
        if ($certificate->student_user_id !== Auth::id()) {
            abort(403);
        }

        if ($certificate->verification_status === 'verified') {
            return back()->with('error', 'Sertifikat yang sudah diverifikasi tidak dapat dihapus.');
        }

        if ($certificate->file_path) {
            Storage::disk('public')->delete($certificate->file_path);
        }

        $certificate->delete();

        return back()->with('success', 'Sertifikat berhasil dihapus.');
    }
}
