import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, Plus, X, Calendar } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ActivityForm({ internship, projects, activity }) {
    const [evidencePreviews, setEvidencePreviews] = useState([]);
    const fileRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        internship_id: activity?.internship_id || internship?.id || '',
        project_id:    activity?.project_id || '',
        activity_date: activity?.activity_date || new Date().toISOString().split('T')[0],
        title:         activity?.title || '',
        description:   activity?.description || '',
        output:        activity?.output || '',
        status:        activity?.status || 'completed',
        evidences:     [],
        captions:      [],
    });

    const handleEvidenceChange = (e) => {
        const files = Array.from(e.target.files);
        setData('evidences', files);
        setEvidencePreviews(files.map((f) => ({
            name: f.name,
            preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        })));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/student/activities', { forceFormData: true });
    };

    return (
        <AppLayout title="Catat Aktivitas">
            <div className="max-w-2xl mx-auto">
                <div className="page-header">
                    <div className="flex items-center gap-3">
                        <Link href="/student/activities" className="btn-ghost btn-sm p-2"><ArrowLeft size={18} /></Link>
                        <div>
                            <h1 className="page-title">Catat Aktivitas PKL</h1>
                            <p className="page-subtitle">Dokumentasikan kegiatan harian Anda</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
                    <div className="card card-body space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Date */}
                            <div className="form-group">
                                <label className="form-label flex items-center gap-1.5"><Calendar size={14} /> Tanggal Aktivitas *</label>
                                <input type="date" className={`form-input ${errors.activity_date ? 'border-red-500' : ''}`}
                                    value={data.activity_date}
                                    onChange={(e) => setData('activity_date', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]} required />
                                {errors.activity_date && <p className="form-error">{errors.activity_date}</p>}
                            </div>

                            {/* Status */}
                            <div className="form-group">
                                <label className="form-label">Status *</label>
                                <select className="form-select" value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}>
                                    <option value="completed">✅ Selesai</option>
                                    <option value="in_progress">🔄 Sedang Berjalan</option>
                                    <option value="pending">⏳ Pending</option>
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Judul Aktivitas *</label>
                            <input type="text" className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                                value={data.title} onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Membuat desain UI halaman login" required />
                            {errors.title && <p className="form-error">{errors.title}</p>}
                        </div>

                        {/* Link to project */}
                        {projects.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Kaitkan dengan Project (opsional)</label>
                                <select className="form-select" value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}>
                                    <option value="">-- Tidak dikaitkan --</option>
                                    {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Deskripsi Kegiatan *</label>
                            <textarea className={`form-textarea ${errors.description ? 'border-red-500' : ''}`} rows={4}
                                value={data.description} onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara detail kegiatan yang Anda lakukan hari ini..." required />
                            {errors.description && <p className="form-error">{errors.description}</p>}
                        </div>

                        {/* Output */}
                        <div className="form-group">
                            <label className="form-label">Output / Hasil Kegiatan</label>
                            <textarea className="form-textarea" rows={2} value={data.output}
                                onChange={(e) => setData('output', e.target.value)}
                                placeholder="Apa hasil yang dicapai dari kegiatan ini?" />
                        </div>

                        {/* Evidence Upload */}
                        <div className="form-group">
                            <label className="form-label">Evidence (Bukti Kegiatan, maks. 10MB/file)</label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-primary-400 transition-colors cursor-pointer"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Klik untuk upload bukti (foto, screenshot, dokumen)</p>
                                <p className="text-xs text-gray-400 mt-1">Bisa lebih dari satu file</p>
                                <input ref={fileRef} type="file" multiple className="hidden" onChange={handleEvidenceChange} />
                            </div>

                            {evidencePreviews.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {evidencePreviews.map((ev, i) => (
                                        <div key={i} className="border rounded-lg overflow-hidden">
                                            {ev.preview ? (
                                                <img src={ev.preview} alt={ev.name} className="w-full h-20 object-cover" />
                                            ) : (
                                                <div className="h-20 bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <span className="text-xs text-center px-2">{ev.name}</span>
                                                </div>
                                            )}
                                            <div className="p-1">
                                                <input type="text" className="form-input text-xs py-1"
                                                    placeholder="Keterangan..."
                                                    onChange={(e) => {
                                                        const caps = [...(data.captions || [])];
                                                        caps[i] = e.target.value;
                                                        setData('captions', caps);
                                                    }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between gap-3">
                        <Link href="/student/activities" className="btn-secondary btn-lg">Batal</Link>
                        <button type="submit" disabled={processing} className="btn-primary btn-lg">
                            {processing ? 'Menyimpan...' : 'Simpan Aktivitas'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
