import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Award, ExternalLink, FileText, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

const TYPE_LABELS = {
    certificate: { label: 'Sertifikat', emoji: '📜' },
    award:       { label: 'Penghargaan', emoji: '🏆' },
    seminar:     { label: 'Seminar',    emoji: '🎤' },
    workshop:    { label: 'Workshop',   emoji: '🛠️' },
    training:    { label: 'Training',   emoji: '📚' },
    achievement: { label: 'Achievement', emoji: '⭐' },
};

const VERIFY_STATUS = {
    pending:  { label: 'Menunggu Verifikasi', cls: 'badge-submitted', icon: Clock },
    verified: { label: 'Terverifikasi',       cls: 'badge-approved', icon: CheckCircle },
    rejected: { label: 'Ditolak',            cls: 'badge-revision', icon: XCircle },
};

export default function CertificatesIndex({ certificates }) {
    const deleteCert = (id) => {
        if (confirm('Hapus sertifikat ini?')) router.delete(`/student/certificates/${id}`);
    };

    return (
        <AppLayout title="Sertifikat & Achievement">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Sertifikat & Achievement</h1>
                        <p className="page-subtitle">Dokumentasikan pencapaian Anda</p>
                    </div>
                    <Link href="/student/certificates/create" className="btn-primary">
                        <Plus size={18} /> Tambah Sertifikat
                    </Link>
                </div>

                {certificates.data.length === 0 ? (
                    <div className="card card-body text-center py-16">
                        <Award size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-700 font-medium">Belum ada sertifikat</h3>
                        <p className="text-gray-400 text-sm mt-1">Upload sertifikat dan achievement Anda.</p>
                        <Link href="/student/certificates/create" className="btn-primary btn-sm mt-4 inline-flex">
                            <Plus size={16} /> Tambah Sertifikat
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificates.data.map((cert) => {
                            const typeInfo = TYPE_LABELS[cert.type] || TYPE_LABELS.certificate;
                            const statusInfo = VERIFY_STATUS[cert.verification_status] || VERIFY_STATUS.pending;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={cert.id} className="card card-hover p-5">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-2xl flex-shrink-0">{typeInfo.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{cert.title}</h3>
                                            {cert.issuer && (
                                                <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        <span className="badge bg-gray-100 text-gray-600">{typeInfo.label}</span>
                                        <span className={statusInfo.cls}><StatusIcon size={10} /> {statusInfo.label}</span>
                                        {cert.is_public && (
                                            <span className="badge bg-blue-100 text-blue-700">Publik</span>
                                        )}
                                    </div>

                                    {cert.issued_date && (
                                        <p className="text-xs text-gray-500 mb-3">
                                            Diterbitkan: {new Date(cert.issued_date).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    )}

                                    {cert.verification_notes && cert.verification_status === 'rejected' && (
                                        <div className="mb-3 p-2 bg-red-50 rounded text-xs text-red-600 border border-red-100">
                                            <strong>Alasan:</strong> {cert.verification_notes}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                        {cert.file_path && (
                                            <a href={`/storage/${cert.file_path}`} target="_blank"
                                                className="btn-secondary btn-sm flex-1 justify-center">
                                                <FileText size={13} /> Lihat File
                                            </a>
                                        )}
                                        {cert.credential_url && (
                                            <a href={cert.credential_url} target="_blank"
                                                className="btn-ghost btn-sm p-1.5" title="Verifikasi Online">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                        {cert.verification_status !== 'verified' && (
                                            <button onClick={() => deleteCert(cert.id)}
                                                className="btn-ghost btn-sm p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {certificates.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {certificates.links.map((link, i) => (
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
