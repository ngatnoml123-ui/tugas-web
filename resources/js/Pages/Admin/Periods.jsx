import AppLayout from "@/Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
import { Plus, Calendar, Pencil, Trash2, CheckCircle, X, Users } from "lucide-react";
import { useState } from "react";

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function PeriodForm({ data, setData, errors, processing, onCancel, submitLabel }) {
    return (
        <div className="space-y-4">
            <div className="form-group">
                <label className="form-label">Nama Periode *</label>
                <input type="text" className={`form-input ${errors.name ? "border-red-400" : ""}`}
                    value={data.name} onChange={(e) => setData("name", e.target.value)}
                    placeholder="Contoh: Batch Ganjil 2026" required />
                {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                    <label className="form-label">Tanggal Mulai *</label>
                    <input type="date" className={`form-input ${errors.start_date ? "border-red-400" : ""}`}
                        value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} required />
                    {errors.start_date && <p className="form-error">{errors.start_date}</p>}
                </div>
                <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input type="date" className="form-input"
                        value={data.end_date} onChange={(e) => setData("end_date", e.target.value)} />
                    {errors.end_date && <p className="form-error">{errors.end_date}</p>}
                </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary-600"
                    checked={data.is_active} onChange={(e) => setData("is_active", e.target.checked)} />
                <span className="text-sm text-gray-700">Jadikan periode aktif</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="btn-secondary">Batal</button>
                <button type="submit" disabled={processing} className="btn-primary">
                    {processing ? "Menyimpan..." : submitLabel}
                </button>
            </div>
        </div>
    );
}

export default function AdminPeriods({ periods }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState(null);

    const addForm = useForm({ name: "", start_date: "", end_date: "", is_active: true });
    const editForm = useForm({ name: "", start_date: "", end_date: "", is_active: false });

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post("/admin/periods", {
            onSuccess: () => { addForm.reset(); setShowAddModal(false); },
        });
    };

    const openEdit = (period) => {
        setEditingPeriod(period);
        editForm.setData({
            name:       period.name,
            start_date: period.start_date?.slice(0, 10) ?? "",
            end_date:   period.end_date?.slice(0, 10) ?? "",
            is_active:  period.is_active,
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.patch(`/admin/periods/${editingPeriod.id}`, {
            onSuccess: () => setEditingPeriod(null),
        });
    };

    const handleDelete = (period) => {
        if (confirm(`Hapus periode "${period.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(`/admin/periods/${period.id}`);
        }
    };

    const handleSetActive = (period) => {
        router.patch(`/admin/periods/${period.id}/set-active`);
    };

    const fmt = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <AppLayout title="Kelola Periode PKL">
            <div className="max-w-3xl mx-auto space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Periode PKL</h1>
                        <p className="page-subtitle">Kelola periode/batch Magang & PKL</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
                        <Plus size={15} /> Tambah Periode
                    </button>
                </div>

                {periods.length === 0 ? (
                    <div className="card card-body text-center py-12 text-gray-400">
                        <Calendar size={36} className="mx-auto mb-3 text-gray-200" />
                        <p>Belum ada periode. Tambahkan periode pertama.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {periods.map((period) => (
                            <div key={period.id} className={`card p-5 flex items-center justify-between gap-4 ${period.is_active ? "ring-2 ring-primary-200 bg-primary-50/30" : ""}`}>
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${period.is_active ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400"}`}>
                                        <Calendar size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-900">{period.name}</h3>
                                            {period.is_active && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    <CheckCircle size={10} /> Aktif
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {fmt(period.start_date)} — {fmt(period.end_date)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <Users size={11} /> {period.internships_count} mahasiswa PKL terdaftar
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {!period.is_active && (
                                        <button onClick={() => handleSetActive(period)}
                                            className="btn-secondary btn-sm text-xs" title="Jadikan Aktif">
                                            <CheckCircle size={13} /> Aktifkan
                                        </button>
                                    )}
                                    <button onClick={() => openEdit(period)}
                                        className="btn-ghost btn-sm p-1.5" title="Edit">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(period)}
                                        className="btn-ghost btn-sm p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
                                        title="Hapus" disabled={period.internships_count > 0}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Periode Baru">
                <form onSubmit={handleAdd}>
                    <PeriodForm data={addForm.data} setData={addForm.setData}
                        errors={addForm.errors} processing={addForm.processing}
                        onCancel={() => setShowAddModal(false)} submitLabel="Tambah Periode" />
                </form>
            </Modal>

            {/* Modal Edit */}
            <Modal open={!!editingPeriod} onClose={() => setEditingPeriod(null)} title="Edit Periode">
                <form onSubmit={handleEdit}>
                    <PeriodForm data={editForm.data} setData={editForm.setData}
                        errors={editForm.errors} processing={editForm.processing}
                        onCancel={() => setEditingPeriod(null)} submitLabel="Simpan Perubahan" />
                </form>
            </Modal>
        </AppLayout>
    );
}
