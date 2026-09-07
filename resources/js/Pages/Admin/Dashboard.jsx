import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, FolderOpen, Briefcase, Award, CheckCircle, Clock, Globe } from 'lucide-react';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#65a30d', '#c026d3'];

function StatCard({ icon: Icon, label, value, color, sub }) {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}><Icon size={22} /></div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                <p className="font-medium text-gray-900">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminDashboard({ stats, charts, recentStudents }) {
    return (
        <AppLayout title="Admin Dashboard">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="page-title">Dashboard Admin</h1>
                    <p className="page-subtitle">Ikhtisar sistem Saka InternHub secara keseluruhan</p>
                </div>

                {/* Stats Row 1 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users}       label="Total Mahasiswa" value={stats.totalStudents}  color="bg-primary-50 text-primary-600" />
                    <StatCard icon={Users}       label="Total Pembimbing" value={stats.totalMentors}   color="bg-purple-50 text-purple-600" />
                    <StatCard icon={FolderOpen}  label="Total Projects"  value={stats.totalProjects}  color="bg-emerald-50 text-emerald-600" />
                    <StatCard icon={Briefcase}   label="Total Karya"     value={stats.totalWorks}     color="bg-amber-50 text-amber-600" />
                </div>

                {/* Stats Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={Globe}       label="Karya Dipublikasikan" value={stats.publishedWorks} color="bg-blue-50 text-blue-600" />
                    <StatCard icon={Clock}       label="Menunggu Review"      value={stats.pendingReview}  color="bg-amber-50 text-amber-600" />
                    <StatCard icon={Award}       label="Total Sertifikat"     value={stats.totalCerts}    color="bg-emerald-50 text-emerald-600" />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar: Students by study_program */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Mahasiswa per Program Studi</h3>
                        </div>
                        <div className="card-body">
                            {charts.byStudyProgram.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={charts.byStudyProgram} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="study_program" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Mahasiswa" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
                            )}
                        </div>
                    </div>

                    {/* Pie: Works by Category */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Karya per Kategori</h3>
                        </div>
                        <div className="card-body">
                            {charts.byWorkCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={charts.byWorkCategory}
                                            dataKey="count"
                                            nameKey="category"
                                            cx="50%" cy="50%"
                                            outerRadius={80}
                                            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {charts.byWorkCategory.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val, name) => [val, name]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar: Top Skills */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Top Skills Mahasiswa</h3>
                        </div>
                        <div className="card-body">
                            {charts.topSkills.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={charts.topSkills}
                                        layout="vertical"
                                        margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={55} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Mahasiswa" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
                            )}
                        </div>
                    </div>

                    {/* Line: Students by Period */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Mahasiswa per Periode PKL</h3>
                        </div>
                        <div className="card-body">
                            {charts.byPeriod.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={charts.byPeriod} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="internships_count" name="Mahasiswa"
                                            stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Students */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Mahasiswa Terbaru</h3>
                        <Link href="/admin/students" className="text-sm text-primary-600 hover:underline">Lihat semua →</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentStudents.map((student) => (
                            <div key={student.id} className="px-6 py-3 flex items-center gap-3">
                                <img src={student.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {student.student_profile?.university || '-'} ·
                                        {student.student_profile?.study_program || '-'}
                                    </p>
                                </div>
                                <span className={`badge ${student.is_active ? 'badge-active' : 'badge-draft'}`}>
                                    {student.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                        ))}
                        {recentStudents.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">Belum ada mahasiswa terdaftar.</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
