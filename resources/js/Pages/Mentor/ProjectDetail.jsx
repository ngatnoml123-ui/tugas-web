import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, CheckCircle, RotateCcw, Globe, Send, User } from 'lucide-react';

const STATUS_LABELS = {
    draft:     'Draft',
    submitted: 'Menunggu Review',
    revision:  'Perlu Revisi',
    approved:  'Disetujui',
    published: 'Dipublikasikan',
};

const STATUS_COLORS = {
    draft:     'badge-draft',
    submitted: 'badge-submitted',
    revision:  'badge-revision',
    approved:  'badge-approved',
    published: 'badge-published',
};

const STATUS_ICONS = {
    draft:     User,
    submitted: Send,
    revision:  RotateCcw,
    approved:  CheckCircle,
    published: Globe,
};

function ReviewActionPanel({ project }) {
    const { data, setData, patch, processing } = useForm({
        action: '',
        notes: project.review_notes || '',
    });

    const handleReview = (action) => {
        setData('action', action);
        patch(`/mentor/projects/${project.id}/review`, {
            data: { action, notes: data.notes },
        });
    };

    if (['draft'].includes(project.verification_status)) {
        return (
            <div className="alert-info">
                Project ini belum diajukan oleh mahasiswa. Tidak ada aksi yang tersedia.
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="font-semibold text-gray-900">Aksi Review</h3>
            </div>
            <div className="card-body space-y-4">
                <div className="form-group">
                    <label className="form-label">Catatan / Feedback (opsional)</label>
                    <textarea className="form-textarea" rows={3}
                        value={data.notes} onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Berikan feedback atau alasan keputusan..." />
                </div>

                <div className="flex flex-wrap gap-3">
                    {!['approved', 'published'].includes(project.verification_status) && (
                        <>
                            <button
                                type="button"
                                onClick={() => { if (confirm('Setujui project ini?')) handleReview('approve'); }}
                                disabled={processing}
                                className="btn-success flex-1 sm:flex-none"
                            >
                                <CheckCircle size={16} /> Setujui
                            </button>
                            <button
                                type="button"
                                onClick={() => { if (confirm('Kembalikan untuk direvisi?')) handleReview('revision'); }}
                                disabled={processing}
                                className="btn-danger flex-1 sm:flex-none"
                            >
                                <RotateCcw size={16} /> Minta Revisi
                            </button>
                        </>
                    )}
                    {project.verification_status === 'approved' && (
                        <button
                            type="button"
                            onClick={() => { if (confirm('Publikasikan project ke portofolio publik?')) handleReview('published'); }}
                            disabled={processing}
                            className="btn-primary flex-1 sm:flex-none"
                        >
                            <Globe size={16} /> Publikasikan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProjectDetail({ project }) {
    return (
        <AppLayout title="Review Project">
            <div className="max-w-3xl mx-auto space-y-5">
                <div className="page-header">
                    <div className="flex items-center gap-3">
                        <Link href="/mentor/projects" className="btn-ghost btn-sm p-2"><ArrowLeft size={18} /></Link>
                        <div>
                            <h1 className="page-title">Review Project</h1>
                            <p className="page-subtitle">Tinjau dan berikan keputusan</p>
                        </div>
                    </div>
                </div>

                {/* Project info */}
                <div className="card">
                    <div className="card-header flex items-start justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg">{project.title}</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Role: {project.role}</p>
                        </div>
                        <span className={`${STATUS_COLORS[project.verification_status] || 'badge-draft'} flex-shrink-0`}>
                            {STATUS_LABELS[project.verification_status] || project.verification_status}
                        </span>
                    </div>
                    <div className="card-body space-y-4">
                        {/* Student info */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img src={project.student?.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-medium text-gray-900 text-sm">{project.student?.name}</p>
                                <p className="text-xs text-gray-500">
                                    {project.student?.student_profile?.university} ·
                                    {project.student?.student_profile?.study_program}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi</p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{project.description}</p>
                            </div>
                        )}

                        {/* Date Range */}
                        {(project.start_date || project.end_date) && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Durasi</p>
                                <p className="text-sm text-gray-700">
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '?'} 
                                    {' - '} 
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Sekarang'}
                                </p>
                            </div>
                        )}

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Teknologi</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.technologies.map((t) => (
                                        <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-2">
                            {project.repository_url && (
                                <a href={project.repository_url} target="_blank" className="btn-secondary btn-sm">
                                    <ExternalLink size={14} /> Repository
                                </a>
                            )}
                            {project.live_url && (
                                <a href={project.live_url} target="_blank" className="btn-secondary btn-sm">
                                    <ExternalLink size={14} /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verification History */}
                {project.verification_logs && project.verification_logs.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Riwayat Verifikasi</h3>
                        </div>
                        <div className="card-body py-6">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {project.verification_logs.map((log) => {
                                    const Icon = STATUS_ICONS[log.to_status] || CheckCircle;
                                    return (
                                        <div key={log.id} className="relative flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-50 text-gray-500 shadow-sm shrink-0 z-10">
                                                <Icon size={16} />
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pt-1.5">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        <span className="text-gray-700">{log.actor?.name}</span>
                                                        <span className="mx-1 text-gray-400">mengubah status menjadi</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${STATUS_COLORS[log.to_status] || 'bg-gray-100 text-gray-700'}`}>
                                                            {STATUS_LABELS[log.to_status] || log.to_status}
                                                        </span>
                                                    </p>
                                                    <time className="text-xs text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                                                        {new Date(log.acted_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </time>
                                                </div>
                                                {log.notes && (
                                                    <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 font-medium">
                                                        <span className="text-xs uppercase tracking-wide text-red-500 block mb-1">Catatan Revisi:</span>
                                                        {log.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Action */}
                <ReviewActionPanel project={project} />
            </div>
        </AppLayout>
    );
}
