import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { Search, Database, ExternalLink, Eye, Code, User } from 'lucide-react';
import { useState } from 'react';

export default function TalentDatabase({ students, universities, study_programs, filters }) {
    const [form, setForm] = useState({
        name:       filters.name || '',
        university: filters.university || '',
        study_program:      filters.study_program || '',
        skill:      filters.skill || '',
        division:   filters.division || '',
        technology: filters.technology || '',
    });

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/admin/talent-database', form, { preserveState: true });
    };

    const clearFilter = () => {
        setForm({ name: '', university: '', study_program: '', skill: '', division: '', technology: '' });
        router.get('/admin/talent-database');
    };

    const hasFilter = Object.values(form).some(Boolean);

    return (
        <AppLayout title="Talent Database">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title flex items-center gap-2">
                            <Database size={22} className="text-primary-600" /> Talent Database
                        </h1>
                        <p className="page-subtitle">Cari dan temukan mahasiswa berdasarkan kompetensi spesifik</p>
                    </div>
                    <span className="badge bg-primary-100 text-primary-700 text-sm px-3 py-1.5">
                        {students.total} Mahasiswa
                    </span>
                </div>

                {/* Search & Filter Panel */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Search size={16} /> Filter Pencarian</h3>
                        {hasFilter && (
                            <button onClick={clearFilter} className="text-sm text-red-600 hover:underline">Hapus Filter</button>
                        )}
                    </div>
                    <form onSubmit={applyFilter} className="card-body">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            <div className="form-group">
                                <label className="form-label">Nama Mahasiswa</label>
                                <input type="text" className="form-input" placeholder="Cari nama..."
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Universitas</label>
                                <input type="text" list="universities" className="form-input" placeholder="Nama universitas..."
                                    value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                                <datalist id="universities">
                                    {universities.map((u) => <option key={u} value={u} />)}
                                </datalist>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Program Studi</label>
                                <input type="text" list="study_programs" className="form-input" placeholder="Program studi..."
                                    value={form.study_program} onChange={(e) => setForm({ ...form, study_program: e.target.value })} />
                                <datalist id="study_programs">
                                    {study_programs.map((m) => <option key={m} value={m} />)}
                                </datalist>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Skill / Kompetensi</label>
                                <input type="text" className="form-input" placeholder="Contoh: React, Laravel, Figma..."
                                    value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Divisi PKL</label>
                                <input type="text" className="form-input" placeholder="Contoh: IT, UI/UX, Data..."
                                    value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Teknologi yang Digunakan</label>
                                <input type="text" className="form-input" placeholder="Contoh: Python, MySQL..."
                                    value={form.technology} onChange={(e) => setForm({ ...form, technology: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            <Search size={16} /> Cari Talent
                        </button>
                    </form>
                </div>

                {/* Results */}
                {students.data.length === 0 ? (
                    <div className="card card-body text-center py-12">
                        <User size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500">Tidak ada mahasiswa yang sesuai dengan kriteria pencarian.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.data.map((student) => {
                            const profile = student.student_profile;
                            const lastInternship = student.internships_as_student?.[0];
                            const publishedWorks = student.works?.length || 0;
                            const publishedProjects = student.projects?.length || 0;

                            return (
                                <div key={student.id} className="card card-hover p-5">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={student.avatar_url} alt=""
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                                            <p className="text-xs text-gray-500 truncate">{profile?.university || '-'}</p>
                                            <p className="text-xs text-primary-600 truncate">{profile?.study_program || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {profile?.bio && (
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{profile.bio}</p>
                                    )}

                                    {/* PKL Info */}
                                    {lastInternship && (
                                        <div className="text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded-lg">
                                            <p className="font-medium text-gray-700">PKL: {lastInternship.division}</p>
                                            <p>{lastInternship.period?.name}</p>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {profile?.skills && profile.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {profile.skills.slice(0, 5).map((skill) => (
                                                <span key={skill}
                                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                                        form.skill && skill.toLowerCase().includes(form.skill.toLowerCase())
                                                            ? 'bg-primary-500 text-white'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {skill}
                                                </span>
                                            ))}
                                            {profile.skills.length > 5 && (
                                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-400 rounded-full">
                                                    +{profile.skills.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                                        <div className="bg-primary-50 rounded-lg p-2">
                                            <p className="text-lg font-bold text-primary-700">{publishedProjects}</p>
                                            <p className="text-[10px] text-gray-500">Projects</p>
                                        </div>
                                        <div className="bg-emerald-50 rounded-lg p-2">
                                            <p className="text-lg font-bold text-emerald-700">{publishedWorks}</p>
                                            <p className="text-[10px] text-gray-500">Karya</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {profile?.public_slug && (
                                            <a href={`/p/${profile.public_slug}`} target="_blank"
                                                className="btn-primary btn-sm flex-1 justify-center">
                                                <Eye size={13} /> Portofolio
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {students.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${
                                    link.active ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
