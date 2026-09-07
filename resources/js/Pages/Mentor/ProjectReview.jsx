import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Eye, FolderOpen, Clock, CheckCircle, RefreshCw, Globe, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

const STATUS_COLORS = {
    draft: 'badge-draft', submitted: 'badge-submitted',
    revision: 'badge-revision', approved: 'badge-approved', published: 'badge-published'
};
const STATUS_LABELS = {
    draft: 'Draft', submitted: 'Menunggu Review', revision: 'Perlu Revisi',
    approved: 'Disetujui', published: 'Dipublikasikan'
};

export default function ProjectReview({ projects }) {
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = filterStatus ? projects.data.filter((p) => p.verification_status === filterStatus) : projects.data;

    return (
        <AppLayout title="Review Project Mahasiswa">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Review Project Mahasiswa</h1>
                        <p className="page-subtitle">Tinjau dan berikan persetujuan project mahasiswa bimbingan Anda</p>
                    </div>
                </div>

                {/* Status filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { value: '', label: 'Semua', icon: LayoutGrid },
                        { value: 'submitted', label: 'Menunggu', icon: Clock },
                        { value: 'approved',  label: 'Disetujui', icon: CheckCircle },
                        { value: 'revision',  label: 'Revisi', icon: RefreshCw },
                        { value: 'published', label: 'Dipublikasikan', icon: Globe },
                    ].map(({ value, label, icon: Icon }) => (
                        <button key={value} onClick={() => setFilterStatus(value)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 ${
                                filterStatus === value
                                    ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                            }`}>
                            <Icon size={14} className={filterStatus === value ? 'text-white' : 'text-gray-400'} />
                            {label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="card card-body text-center py-12 text-gray-400">
                        <FolderOpen size={36} className="mx-auto mb-3 text-gray-200" />
                        <p>Tidak ada project dengan status ini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((project) => (
                            <div key={project.id} className="card card-hover p-5 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                            <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                                            <span className={STATUS_COLORS[project.verification_status]}>{STATUS_LABELS[project.verification_status]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <img src={project.student?.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                                            <span className="text-xs text-gray-600">{project.student?.name}</span>
                                            <span className="badge bg-gray-100 text-gray-600 text-[10px]">
                                                {project.role}
                                            </span>
                                        </div>
                                        {project.review_notes && project.verification_status === 'revision' && (
                                            <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                                                Revisi: {project.review_notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/mentor/projects/${project.id}`} className="btn-primary btn-sm flex-shrink-0">
                                    <Eye size={14} /> Review
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {projects.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {projects.links.map((link, i) => (
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
