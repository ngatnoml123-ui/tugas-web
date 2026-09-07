import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    FolderOpen, Briefcase, Activity, Award,
    CheckCircle, Clock, ArrowRight, User, Building, Calendar
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, href }) {
    const colorMap = {
        blue:    'bg-primary-50 text-primary-600',
        green:   'bg-emerald-50 text-emerald-600',
        amber:   'bg-amber-50 text-amber-600',
        purple:  'bg-purple-50 text-purple-600',
    };

    const card = (
        <div className="stat-card">
            <div className={`stat-icon ${colorMap[color] || colorMap.blue}`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
        </div>
    );

    return href ? <Link href={href} className="block">{card}</Link> : card;
}

const statusColors = {
    draft:     'badge-draft',
    submitted: 'badge-submitted',
    revision:  'badge-revision',
    approved:  'badge-approved',
    published: 'badge-published',
};

const statusLabels = {
    draft:     'Draft',
    submitted: 'Menunggu Review',
    revision:  'Perlu Revisi',
    approved:  'Disetujui',
    published: 'Dipublikasi',
};

const categoryColors = {
    software:      'bg-blue-100 text-blue-700',
    design:        'bg-purple-100 text-purple-700',
    data:          'bg-emerald-100 text-emerald-700',
    research:      'bg-amber-100 text-amber-700',
    documentation: 'bg-gray-100 text-gray-700',
    other:         'bg-pink-100 text-pink-700',
};

export default function StudentDashboard({ user, internship, stats, recentActivities, recentWorks }) {
    const profile = user.student_profile;
    const isProfileComplete = profile?.nim && profile?.university && profile?.study_program;

    return (
        <AppLayout title="Dashboard Mahasiswa">
            <div className="space-y-6">
                {/* ── Welcome Banner ── */}
                <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 sm:p-8 border-0 overflow-hidden relative">
                    <div className="absolute right-0 top-0 bottom-0 opacity-10">
                        <svg viewBox="0 0 200 200" className="h-full" fill="white">
                            <circle cx="150" cy="100" r="120" />
                        </svg>
                    </div>
                    <div className="relative">
                        <p className="text-primary-200 text-sm font-medium">Selamat datang,</p>
                        <h2 className="text-2xl font-bold mt-0.5">{user.name}</h2>
                        {internship ? (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-primary-100 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Building size={14} /> {internship.division}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {internship.period?.name}
                                </span>
                                <span className={`badge ${internship.status === 'active' ? 'bg-emerald-400/30 text-white' : 'bg-white/20 text-white'}`}>
                                    {internship.status === 'active' ? 'PKL Aktif' : internship.status}
                                </span>
                            </div>
                        ) : (
                            <p className="text-primary-200 text-sm mt-2">Belum memiliki data PKL aktif.</p>
                        )}
                    </div>
                </div>

                {/* ── Profile Incomplete Warning ── */}
                {!isProfileComplete && (
                    <div className="alert-warning">
                        <User size={18} className="flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Lengkapi profil Anda</p>
                            <p className="text-sm mt-0.5">
                                Beberapa data profil belum diisi.{' '}
                                <Link href="/student/profile" className="font-semibold underline">
                                    Lengkapi sekarang →
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={FolderOpen} label="Projects"    value={stats.projects}     color="blue"   href="/student/projects" />
                    <StatCard icon={Briefcase}  label="Karya"        value={stats.works}        color="purple" href="/student/works" />
                    <StatCard icon={Activity}   label="Aktivitas"    value={stats.activities}   color="green"  href="/student/activities" />
                    <StatCard icon={Award}      label="Sertifikat"   value={stats.certificates} color="amber"  href="/student/certificates" />
                </div>

                {/* ── Verification Summary ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="card p-5 flex items-center gap-4">
                        <div className="stat-icon bg-emerald-50 text-emerald-600">
                            <CheckCircle size={22} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stats.published}</p>
                            <p className="text-sm text-gray-500">Dipublikasikan</p>
                        </div>
                    </div>
                    <div className="card p-5 flex items-center gap-4">
                        <div className="stat-icon bg-amber-50 text-amber-600">
                            <Clock size={22} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                            <p className="text-sm text-gray-500">Menunggu Review</p>
                        </div>
                    </div>
                </div>

                {/* ── Recent Works ── */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Karya Terbaru</h3>
                        <Link href="/student/works" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="card-body">
                        {recentWorks.length === 0 ? (
                            <div className="text-center py-8">
                                <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 text-sm">Belum ada karya.</p>
                                <Link href="/student/works/create" className="btn-primary btn-sm mt-3 inline-flex">
                                    Tambah Karya
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recentWorks.map((work) => (
                                    <div key={work.id} className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{work.title}</h4>
                                            <span className={statusColors[work.verification_status] || 'badge-draft'}>
                                                {statusLabels[work.verification_status] || work.verification_status}
                                            </span>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[work.category] || 'bg-gray-100 text-gray-700'}`}>
                                            {work.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Activities ── */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Aktivitas Terkini</h3>
                        <Link href="/student/activities" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentActivities.length === 0 ? (
                            <div className="p-6 text-center">
                                <Activity size={32} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 text-sm">Belum ada aktivitas.</p>
                                <Link href="/student/activities/create" className="btn-primary btn-sm mt-3 inline-flex">
                                    Catat Aktivitas
                                </Link>
                            </div>
                        ) : (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="px-6 py-3 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(activity.activity_date).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`badge ${
                                        activity.status === 'completed' ? 'badge-approved' :
                                        activity.status === 'in_progress' ? 'badge-submitted' : 'badge-draft'
                                    }`}>
                                        {activity.status === 'completed' ? 'Selesai' :
                                         activity.status === 'in_progress' ? 'Berjalan' : 'Pending'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
