import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Filter, Eye, CheckCircle, RotateCcw, Globe, Clock, RefreshCw, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

const STATUS_COLORS = {
    draft: 'badge-draft', submitted: 'badge-submitted',
    revision: 'badge-revision', approved: 'badge-approved', published: 'badge-published'
};
const STATUS_LABELS = {
    draft: 'Draft', submitted: 'Menunggu Review', revision: 'Perlu Revisi',
    approved: 'Disetujui', published: 'Dipublikasikan'
};

const CATEGORY_COLORS = {
    software: 'bg-blue-100 text-blue-700', design: 'bg-purple-100 text-purple-700',
    data: 'bg-emerald-100 text-emerald-700', research: 'bg-amber-100 text-amber-700',
    documentation: 'bg-gray-100 text-gray-700', other: 'bg-pink-100 text-pink-700'
};

export default function WorkReview({ works }) {
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = filterStatus ? works.data.filter((w) => w.verification_status === filterStatus) : works.data;

    return (
        <AppLayout title="Review Karya Mahasiswa">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Review Karya Mahasiswa</h1>
                        <p className="page-subtitle">Tinjau dan berikan persetujuan karya mahasiswa bimbingan Anda</p>
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
                        <Eye size={36} className="mx-auto mb-3 text-gray-200" />
                        <p>Tidak ada karya dengan status ini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((work) => (
                            <div key={work.id} className="card card-hover p-5 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                        {work.thumbnail_path ? (
                                            <img src={`/storage/${work.thumbnail_path}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📄</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                            <h3 className="font-semibold text-gray-900 text-sm">{work.title}</h3>
                                            <span className={STATUS_COLORS[work.verification_status]}>{STATUS_LABELS[work.verification_status]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <img src={work.student?.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                                            <span className="text-xs text-gray-600">{work.student?.name}</span>
                                            <span className={`badge ${CATEGORY_COLORS[work.category] || 'bg-gray-100 text-gray-600'} text-[10px]`}>
                                                {work.category}
                                            </span>
                                        </div>
                                        {work.review_notes && work.verification_status === 'revision' && (
                                            <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                                                Revisi: {work.review_notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/mentor/works/${work.id}`} className="btn-primary btn-sm flex-shrink-0">
                                    <Eye size={14} /> Review
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {works.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {works.links.map((link, i) => (
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
