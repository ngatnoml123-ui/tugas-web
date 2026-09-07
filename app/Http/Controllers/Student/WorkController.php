<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\Project;
use App\Models\VerificationLog;
use App\Models\Work;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $works = Work::where('student_user_id', $user->id)
            ->with(['project', 'internship.period'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Student/Works/Index', [
            'works' => $works,
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();

        $internship = Internship::where('student_user_id', $user->id)
            ->where('status', 'active')
            ->with('period')
            ->first();

        $projects = Project::where('student_user_id', $user->id)->get(['id', 'title']);

        return Inertia::render('Student/Works/Form', [
            'internship' => $internship,
            'projects'   => $projects,
            'work'       => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'internship_id'  => ['required', 'exists:internships,id'],
            'project_id'     => ['nullable', 'exists:projects,id'],
            'title'          => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'category'       => ['required', 'in:software,design,data,research,documentation,other'],
            'sub_category'   => ['nullable', 'string', 'max:100'],
            'external_link'  => ['nullable', 'url'],
            'technologies'   => ['nullable', 'array'],
            'is_confidential'=> ['boolean'],
            'file'           => ['nullable', 'file', 'max:20480'],
            'thumbnail'      => ['nullable', 'image', 'max:5120'],
        ]);

        $data = array_merge($validated, [
            'student_user_id'     => $user->id,
            'verification_status' => 'draft',
        ]);

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $data['file_path']          = $file->store("works/{$user->id}", 'public');
            $data['file_original_name'] = $file->getClientOriginalName();
            $data['file_mime_type']     = $file->getMimeType();
            $data['file_size']          = $file->getSize();
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_path'] = $request->file('thumbnail')->store("works/{$user->id}/thumbnails", 'public');
        }

        Work::create($data);

        return redirect()->route('student.works.index')
            ->with('success', 'Karya berhasil ditambahkan.');
    }

    public function edit(Work $work): Response
    {
        $this->authorize('update', $work);

        $projects = Project::where('student_user_id', Auth::id())->get(['id', 'title']);

        return Inertia::render('Student/Works/Form', [
            'work'       => $work->load('internship.period', 'project'),
            'internship' => $work->internship,
            'projects'   => $projects,
        ]);
    }

    public function update(Request $request, Work $work): RedirectResponse
    {
        $this->authorize('update', $work);

        if (in_array($work->verification_status, ['approved', 'published'])) {
            return back()->with('error', 'Karya yang sudah disetujui tidak dapat diedit.');
        }

        $validated = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'category'        => ['required', 'in:software,design,data,research,documentation,other'],
            'sub_category'    => ['nullable', 'string', 'max:100'],
            'external_link'   => ['nullable', 'url'],
            'technologies'    => ['nullable', 'array'],
            'is_confidential' => ['boolean'],
            'file'            => ['nullable', 'file', 'max:20480'],
            'thumbnail'       => ['nullable', 'image', 'max:5120'],
        ]);

        $data = array_merge($validated, ['verification_status' => 'draft']);

        if ($request->hasFile('file')) {
            if ($work->file_path) Storage::disk('public')->delete($work->file_path);
            $file = $request->file('file');
            $data['file_path']          = $file->store("works/{$work->student_user_id}", 'public');
            $data['file_original_name'] = $file->getClientOriginalName();
            $data['file_mime_type']     = $file->getMimeType();
            $data['file_size']          = $file->getSize();
        }

        if ($request->hasFile('thumbnail')) {
            if ($work->thumbnail_path) Storage::disk('public')->delete($work->thumbnail_path);
            $data['thumbnail_path'] = $request->file('thumbnail')->store("works/{$work->student_user_id}/thumbnails", 'public');
        }

        $work->update($data);

        return redirect()->route('student.works.index')
            ->with('success', 'Karya berhasil diperbarui.');
    }

    public function submit(Work $work): RedirectResponse
    {
        $this->authorize('update', $work);

        if (!in_array($work->verification_status, ['draft', 'revision'])) {
            return back()->with('error', 'Karya ini sudah dalam proses review.');
        }

        $oldStatus = $work->verification_status;
        $work->update(['verification_status' => 'submitted']);

        VerificationLog::create([
            'verifiable_type' => Work::class,
            'verifiable_id'   => $work->id,
            'actor_id'        => Auth::id(),
            'from_status'     => $oldStatus,
            'to_status'       => 'submitted',
            'notes'           => 'Mahasiswa mengajukan karya untuk review.',
            'acted_at'        => now(),
        ]);

        return back()->with('success', 'Karya berhasil diajukan untuk review pembimbing.');
    }

    public function destroy(Work $work): RedirectResponse
    {
        $this->authorize('delete', $work);

        if (in_array($work->verification_status, ['approved', 'published'])) {
            return back()->with('error', 'Karya yang sudah disetujui tidak dapat dihapus.');
        }

        if ($work->file_path)      Storage::disk('public')->delete($work->file_path);
        if ($work->thumbnail_path) Storage::disk('public')->delete($work->thumbnail_path);

        $work->delete();

        return redirect()->route('student.works.index')
            ->with('success', 'Karya berhasil dihapus.');
    }
}
