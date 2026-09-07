<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InternshipPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function index(): Response
    {
        $periods = InternshipPeriod::withCount('internships')
            ->orderByDesc('start_date')
            ->get();

        return Inertia::render('Admin/Periods', [
            'periods' => $periods,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active'  => ['boolean'],
        ]);

        InternshipPeriod::create([
            'name'       => $request->name,
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
            'is_active'  => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Periode \"{$request->name}\" berhasil ditambahkan.");
    }

    public function update(Request $request, InternshipPeriod $period): RedirectResponse
    {
        $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active'  => ['boolean'],
        ]);

        $period->update([
            'name'       => $request->name,
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
            'is_active'  => $request->boolean('is_active'),
        ]);

        return back()->with('success', "Periode \"{$period->name}\" berhasil diperbarui.");
    }

    public function destroy(InternshipPeriod $period): RedirectResponse
    {
        if ($period->internships()->count() > 0) {
            return back()->with('error', "Periode ini tidak dapat dihapus karena masih memiliki {$period->internships()->count()} data mahasiswa PKL.");
        }

        $period->delete();
        return back()->with('success', 'Periode berhasil dihapus.');
    }

    public function setActive(InternshipPeriod $period): RedirectResponse
    {
        InternshipPeriod::query()->update(['is_active' => false]);
        $period->update(['is_active' => true]);

        return back()->with('success', "Periode \"{$period->name}\" sekarang menjadi periode aktif.");
    }
}
