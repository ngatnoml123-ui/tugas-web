import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { Plus, Activity as ActivityIcon, Calendar, CheckCircle, Clock, AlertCircle, Trash2, Image } from 'lucide-react';

const STATUS_CONFIG = {
    completed:   { label: 'Selesai',    cls: 'badge-approved', icon: CheckCircle },
    in_progress: { label: 'Berjalan',   cls: 'badge-submitted', icon: Clock },
    pending:     { label: 'Pending',    cls: 'badge-draft', icon: AlertCircle },
};

export default function ActivitiesIndex({ activities }) {
    const deleteActivity = (id) => {
        if (confirm('Hapus aktivitas ini?')) router.delete(`/student/activities/${id}`);
    };

    return (
        <AppLayout title="Log Aktivitas">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Log Aktivitas PKL</h1>
                        <p className="page-subtitle">Catat kegiatan harian selama PKL</p>
                    </div>
                    <Link href="/student/activities/create" className="btn-primary">
                        <Plus size={18} /> Catat Aktivitas
                    </Link>
                </div>

                {activities.data.length === 0 ? (
                    <div className="card card-body text-center py-16">
                        <ActivityIcon size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-700 font-medium">Belum ada aktivitas</h3>
                        <p className="text-gray-400 text-sm mt-1">Mulai catat kegiatan PKL Anda.</p>
                        <Link href="/student/activities/create" className="btn-primary btn-sm mt-4 inline-flex">
                            <Plus size={16} /> Catat Aktivitas
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activities.data.map((activity) => {
                            const statusConfig = STATUS_CONFIG[activity.status] || STATUS_CONFIG.pending;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div key={activity.id} className="card card-hover p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar size={12} />
                                                    {new Date(activity.activity_date).toLocaleDateString('id-ID', {
                                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </span>
                                                <span className={statusConfig.cls}>
                                                    <StatusIcon size={10} /> {statusConfig.label}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                                            {activity.output && (
                                                <p className="text-sm text-gray-500 mt-1.5">
                                                    <strong className="text-gray-700">Output:</strong> {activity.output}
                                                </p>
                                            )}

                                            {/* Evidence files */}
                                            {activity.evidences && activity.evidences.length > 0 && (
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    {activity.evidences.map((ev) => (
                                                        <a key={ev.id} href={`/storage/${ev.file_path}`} target="_blank"
                                                            className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-700 text-xs rounded-lg transition-colors">
                                                            <Image size={12} />
                                                            {ev.caption || ev.file_original_name}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => deleteActivity(activity.id)}
                                            className="btn-ghost btn-sm p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {activities.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {activities.links.map((link, i) => (
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
