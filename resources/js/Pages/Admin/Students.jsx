import AppLayout from "@/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { Search, Filter, ToggleLeft, Trash2, Eye, Users, Plus, Upload, Download, X, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export default function AdminStudents({ students, periods, mentors, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [study_program, setMajor] = useState(filters.study_program || "");
    const [university, setUniversity] = useState(filters.university || "");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const fileRef = useRef();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "", email: "", nim: "", university: "", study_program: "",
        semester: "", period_id: "", mentor_id: "", division: "",
    });

    const importForm = useForm({ file: null, period_id: "", mentor_id: "" });

    const applyFilter = (e) => {
        e.preventDefault();
        router.get("/admin/students", { search, study_program, university }, { preserveState: true });
    };

    const toggleActive = (userId) => router.patch(`/admin/students/${userId}/toggle`);

    const deleteStudent = (userId) => {
        if (confirm("Hapus akun mahasiswa ini? Semua data terkait akan dihapus.")) {
            router.delete(`/admin/students/${userId}`);
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post("/admin/students", {
            onSuccess: () => { reset(); setShowAddModal(false); },
        });
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        importForm.post("/admin/import/students", {
            forceFormData: true,
            onSuccess: () => { importForm.reset(); setShowImportModal(false); },
        });
    };

    return (
        <AppLayout title="Kelola Mahasiswa">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Kelola Mahasiswa</h1>
                        <p className="page-subtitle">Manajemen akun mahasiswa PKL</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge bg-primary-100 text-primary-700 text-sm px-3 py-1.5">
                            {students.total} Mahasiswa
                        </span>
                        <button onClick={() => setShowImportModal(true)} className="btn-secondary btn-sm">
                            <Upload size={15} /> Import CSV
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
                            <Plus size={15} /> Tambah
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <form onSubmit={applyFilter} className="card card-body">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative sm:col-span-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className="form-input pl-9" placeholder="Cari nama atau email..."
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <input type="text" className="form-input" placeholder="Program Studi..."
                            value={study_program} onChange={(e) => setMajor(e.target.value)} />
                        <div className="flex gap-2">
                            <input type="text" className="form-input flex-1" placeholder="Universitas..."
                                value={university} onChange={(e) => setUniversity(e.target.value)} />
                            <button type="submit" className="btn-primary"><Filter size={16} /></button>
                        </div>
                    </div>
                </form>

                {/* Table */}
                <div className="card overflow-hidden">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mahasiswa</th>
                                    <th className="hidden md:table-cell">Universitas / Prodi</th>
                                    <th className="hidden lg:table-cell">PKL Terakhir</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400">
                                            Tidak ada mahasiswa ditemukan
                                        </td>
                                    </tr>
                                ) : students.data.map((student) => {
                                    const profile = student.student_profile;
                                    const lastInternship = student.internships_as_student?.[0];
                                    return (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <img src={student.avatar_url} alt=""
                                                        className="w-9 h-9 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{student.name}</p>
                                                        <p className="text-xs text-gray-400">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell">
                                                <p className="text-sm">{profile?.university || "-"}</p>
                                                <p className="text-xs text-gray-400">{profile?.study_program || "-"}</p>
                                            </td>
                                            <td className="hidden lg:table-cell">
                                                {lastInternship ? (
                                                    <>
                                                        <p className="text-sm">{lastInternship.period?.name}</p>
                                                        <p className="text-xs text-gray-400">{lastInternship.division}</p>
                                                    </>
                                                ) : "-"}
                                            </td>
                                            <td>
                                                <span className={`badge ${student.is_active ? "badge-active" : "badge-draft"}`}>
                                                    {student.is_active ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    {profile?.public_slug && (
                                                        <a href={`/p/${profile.public_slug}`} target="_blank"
                                                            className="btn-ghost btn-sm p-1.5" title="Lihat Portfolio">
                                                            <Eye size={14} />
                                                        </a>
                                                    )}
                                                    <button onClick={() => toggleActive(student.id)}
                                                        className="btn-secondary btn-sm p-1.5" title="Toggle Status">
                                                        <ToggleLeft size={14} />
                                                    </button>
                                                    <button onClick={() => deleteStudent(student.id)}
                                                        className="btn-ghost btn-sm p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50" title="Hapus">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {students.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-gray-100 flex justify-center gap-2">
                            {students.links.map((link, i) => (
                                <Link key={i} href={link.url || "#"}
                                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                                        link.active ? "bg-primary-600 text-white border-primary-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    } ${!link.url ? "opacity-50 pointer-events-none" : ""}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal: Tambah Mahasiswa ── */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Mahasiswa Baru">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                        Password default: <strong>password123</strong> — mahasiswa dapat mengubahnya setelah login.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Nama Lengkap *</label>
                            <input type="text" className={`form-input ${errors.name ? "border-red-400" : ""}`}
                                value={data.name} onChange={(e) => setData("name", e.target.value)} required />
                            {errors.name && <p className="form-error">{errors.name}</p>}
                        </div>
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Email *</label>
                            <input type="email" className={`form-input ${errors.email ? "border-red-400" : ""}`}
                                value={data.email} onChange={(e) => setData("email", e.target.value)} required />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">NIM</label>
                            <input type="text" className="form-input" value={data.nim}
                                onChange={(e) => setData("nim", e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Semester</label>
                            <input type="number" min="1" max="14" className="form-input" value={data.semester}
                                onChange={(e) => setData("semester", e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Universitas</label>
                            <input type="text" className="form-input" value={data.university}
                                onChange={(e) => setData("university", e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Program Studi</label>
                            <input type="text" className="form-input" value={data.study_program}
                                onChange={(e) => setData("study_program", e.target.value)} />
                        </div>
                    </div>
                    <hr className="border-gray-100" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penugasan PKL <span className="text-red-400">*</span></p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Periode PKL *</label>
                            <select className={`form-input ${errors.period_id ? "border-red-400" : ""}`} value={data.period_id}
                                onChange={(e) => setData("period_id", e.target.value)} required>
                                <option value="">— Pilih Periode —</option>
                                {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {errors.period_id && <p className="form-error">{errors.period_id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mentor Pembimbing *</label>
                            <select className={`form-input ${errors.mentor_id ? "border-red-400" : ""}`} value={data.mentor_id}
                                onChange={(e) => setData("mentor_id", e.target.value)} required>
                                <option value="">— Pilih Mentor —</option>
                                {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            {errors.mentor_id && <p className="form-error">{errors.mentor_id}</p>}
                        </div>
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Divisi PKL</label>
                            <input type="text" className="form-input" value={data.division}
                                onChange={(e) => setData("division", e.target.value)}
                                placeholder="Web Development, UI/UX, Data, dll." />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Batal</button>
                        <button type="submit" disabled={processing} className="btn-primary">
                            {processing ? "Menyimpan..." : "Buat Akun"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Import CSV ── */}
            <Modal open={showImportModal} onClose={() => setShowImportModal(false)} title="Import Mahasiswa via CSV">
                <form onSubmit={handleImportSubmit} className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center">
                        <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-3">Upload file CSV berisi data mahasiswa</p>
                        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden"
                            onChange={(e) => importForm.setData("file", e.target.files[0])} />
                        <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary btn-sm">
                            Pilih File CSV
                        </button>
                        {importForm.data.file && (
                            <p className="text-xs text-primary-600 mt-2 font-medium">
                                ✓ {importForm.data.file.name}
                            </p>
                        )}
                        {importForm.errors.file && <p className="form-error">{importForm.errors.file}</p>}
                    </div>

                    <a href="/admin/import/template" className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:underline">
                        <Download size={13} /> Download Template CSV
                    </a>

                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700 space-y-1">
                        <p className="font-semibold">Aturan Import:</p>
                        <p>• Email yang sudah terdaftar akan dilewati otomatis</p>
                        <p>• Password default semua akun baru: <strong>password123</strong></p>
                        <p>• Kolom: nama, email, nim, universitas, program_studi, semester, divisi_pkl</p>
                    </div>

                    <hr className="border-gray-100" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penugasan PKL (opsional, berlaku untuk semua)</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="form-group">
                            <label className="form-label">Periode PKL</label>
                            <select className="form-input" value={importForm.data.period_id}
                                onChange={(e) => importForm.setData("period_id", e.target.value)}>
                                <option value="">— Semua —</option>
                                {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mentor Pembimbing</label>
                            <select className="form-input" value={importForm.data.mentor_id}
                                onChange={(e) => importForm.setData("mentor_id", e.target.value)}>
                                <option value="">— Semua —</option>
                                {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowImportModal(false)} className="btn-secondary">Batal</button>
                        <button type="submit" disabled={importForm.processing || !importForm.data.file} className="btn-primary">
                            {importForm.processing ? "Memproses..." : "Import Sekarang"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
