import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, Award } from 'lucide-react';
import { useRef } from 'react';

const TYPES = [
    { value: 'certificate', label: '📜 Sertifikat' },
    { value: 'award',       label: '🏆 Penghargaan' },
    { value: 'seminar',     label: '🎤 Seminar' },
    { value: 'workshop',    label: '🛠️ Workshop' },
    { value: 'training',    label: '📚 Training' },
    { value: 'achievement', label: '⭐ Achievement' },
];

export default function CertificateForm({ certificate }) {
    const isEditing = !!certificate;
    const fileRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        title:          certificate?.title || '',
        issuer:         certificate?.issuer || '',
        type:           certificate?.type || 'certificate',
        issued_date:    certificate?.issued_date || '',
        expired_date:   certificate?.expired_date || '',
        credential_id:  certificate?.credential_id || '',
        credential_url: certificate?.credential_url || '',
        description:    certificate?.description || '',
        is_public:      certificate?.is_public ?? true,
        file:           null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/student/certificates', { forceFormData: true });
    };

    return (
        <AppLayout title="Tambah Sertifikat">
            <div className="max-w-2xl mx-auto">
                <div className="page-header">
                    <div className="flex items-center gap-3">
                        <Link href="/student/certificates" className="btn-ghost btn-sm p-2"><ArrowLeft size={18} /></Link>
                        <div>
                            <h1 className="page-title">Tambah Sertifikat</h1>
                            <p className="page-subtitle">Upload sertifikat dan achievement Anda</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
                    <div className="card card-body space-y-4">
                        {/* Type */}
                        <div className="form-group">
                            <label className="form-label">Tipe *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {TYPES.map(({ value, label }) => (
                                    <button key={value} type="button"
                                        onClick={() => setData('type', value)}
                                        className={`py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                                            data.type === value
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Judul Sertifikat / Penghargaan *</label>
                            <input type="text" className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                                value={data.title} onChange={(e) => setData('title', e.target.value)}
                                placeholder="Nama sertifikat atau penghargaan" required />
                            {errors.title && <p className="form-error">{errors.title}</p>}
                        </div>

                        {/* Issuer */}
                        <div className="form-group">
                            <label className="form-label">Penerbit / Lembaga</label>
                            <input type="text" className="form-input" value={data.issuer}
                                onChange={(e) => setData('issuer', e.target.value)}
                                placeholder="Nama lembaga/organisasi penerbit" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Issued Date */}
                            <div className="form-group">
                                <label className="form-label">Tanggal Terbit</label>
                                <input type="date" className="form-input" value={data.issued_date}
                                    onChange={(e) => setData('issued_date', e.target.value)} />
                            </div>

                            {/* Expired Date */}
                            <div className="form-group">
                                <label className="form-label">Tanggal Kadaluarsa (opsional)</label>
                                <input type="date" className="form-input" value={data.expired_date}
                                    onChange={(e) => setData('expired_date', e.target.value)}
                                    min={data.issued_date} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Credential ID */}
                            <div className="form-group">
                                <label className="form-label">Credential ID (opsional)</label>
                                <input type="text" className="form-input" value={data.credential_id}
                                    onChange={(e) => setData('credential_id', e.target.value)}
                                    placeholder="ID sertifikat resmi" />
                            </div>

                            {/* Credential URL */}
                            <div className="form-group">
                                <label className="form-label">Link Verifikasi (opsional)</label>
                                <input type="url" className={`form-input ${errors.credential_url ? 'border-red-500' : ''}`}
                                    value={data.credential_url} onChange={(e) => setData('credential_url', e.target.value)}
                                    placeholder="https://..." />
                                {errors.credential_url && <p className="form-error">{errors.credential_url}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Deskripsi (opsional)</label>
                            <textarea className="form-textarea" rows={2} value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Keterangan tambahan..." />
                        </div>

                        {/* File upload */}
                        <div className="form-group">
                            <label className="form-label">File Sertifikat (PDF/gambar, maks. 10MB)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-primary-400 transition-colors cursor-pointer"
                                onClick={() => fileRef.current?.click()}>
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                    {data.file ? data.file.name : (certificate?.file_original_name || 'Klik untuk upload file sertifikat')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
                                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                    onChange={(e) => setData('file', e.target.files[0])} />
                            </div>
                        </div>

                        {/* Public toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={data.is_public}
                                onChange={(e) => setData('is_public', e.target.checked)} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Tampilkan di Portofolio Publik</p>
                                <p className="text-xs text-gray-500">Sertifikat akan ditampilkan setelah diverifikasi</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-between gap-3">
                        <Link href="/student/certificates" className="btn-secondary btn-lg">Batal</Link>
                        <button type="submit" disabled={processing} className="btn-primary btn-lg">
                            {processing ? 'Menyimpan...' : 'Tambah Sertifikat'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
