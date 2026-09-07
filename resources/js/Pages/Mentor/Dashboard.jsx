import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Users, Eye, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';

export default function MentorDashboard({ mentor, internships, pendingWorks, pendingProjects, stats }) {
    const profile = mentor.mentor_profile;

    return (
        <AppLayout title="Dashboard Pembimbing">
            <div className="space-y-6">
                {/* Welcome */}
                <div className="card bg-gradient-to-r from-primary-700 to-primary-900 text-white p-6 border-0">
                    <p className="text-primary-200 text-sm">Selamat datang,</p>
                    <h2 className="text-xl font-bold mt-0.5">{mentor.name}</h2>
                    {profile && (
                        <p className="text-primary-200 text-sm mt-1">{profile.position} — {profile.division}</p>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Mahasiswa Aktif', value: stats.students,  color: 'bg-blue-50 text-blue-600',    icon: Users },
                        { label: 'Perlu Review',    value: stats.pending,   color: 'bg-amber-50 text-amber-600',  icon: Clock },
                        { label: 'Sudah Disetujui', value: stats.approved,  color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
                        { label: 'Dipublikasikan',  value: stats.published, color: 'bg-primary-50 text-primary-600', icon: Eye },
                    ].map(({ label, value, color, icon: Icon }) => (
                        <div key={label} className="stat-card">
                            <div className={`stat-icon ${color}`}><Icon size={22} /></div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{value}</p>
                                <p className="text-sm text-gray-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pending Reviews - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Works */}
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Karya Menunggu Review</h3>
                            <Link href="/mentor/works" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                                Lihat semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        {pendingWorks.length === 0 ? (
                            <div className="card-body text-center py-8 text-gray-400">
                                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-300" />
                                <p className="text-sm">Semua karya sudah ditinjau. Tidak ada yang menunggu.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {pendingWorks.slice(0, 5).map((work) => (
                                    <div key={work.id} className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src={work.student?.avatar_url} alt=""
                                                className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{work.title}</p>
                                                <p className="text-xs text-gray-500">{work.student?.name} · {work.category}</p>
                                            </div>
                                        </div>
                                        <Link href={`/mentor/works/${work.id}`} className="btn-primary btn-sm">
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Projects */}
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Project Menunggu Review</h3>
                            <Link href="/mentor/projects" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                                Lihat semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        {pendingProjects.length === 0 ? (
                            <div className="card-body text-center py-8 text-gray-400">
                                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-300" />
                                <p className="text-sm">Semua project sudah ditinjau. Tidak ada yang menunggu.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {pendingProjects.slice(0, 5).map((project) => (
                                    <div key={project.id} className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src={project.student?.avatar_url} alt=""
                                                className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{project.title}</p>
                                                <p className="text-xs text-gray-500">{project.student?.name} · {project.role_in_project}</p>
                                            </div>
                                        </div>
                                        <Link href={`/mentor/projects/${project.id}`} className="btn-primary btn-sm">
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Students List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="font-semibold text-gray-900">Mahasiswa Bimbingan ({internships.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {internships.map((internship) => (
                            <div key={internship.id} className="px-6 py-3 flex items-center gap-3">
                                <img src={internship.student?.avatar_url} alt=""
                                    className="w-9 h-9 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{internship.student?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {internship.student?.student_profile?.university} ·
                                        {internship.student?.student_profile?.study_program}
                                    </p>
                                </div>
                                <span className={`badge ${internship.status === 'active' ? 'badge-active' : 'badge-completed'}`}>
                                    {internship.status === 'active' ? 'Aktif' : 'Selesai'}
                                </span>
                            </div>
                        ))}
                        {internships.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                Belum ada mahasiswa bimbingan.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
