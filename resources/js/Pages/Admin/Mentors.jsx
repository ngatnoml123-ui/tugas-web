import AppLayout from "@/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { Search, ToggleLeft, Trash2, Plus, X, Users } from "lucide-react";
import { useState } from "react";

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

export default function AdminMentors({ mentors, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "", email: "", position: "", division: "", phone: "", employee_id: "",
    });

    const applyFilter = (e) => {
        e.preventDefault();
        router.get("/admin/mentors", { search }, { preserveState: true });
    };

    const toggleActive = (userId) => router.patch(`/admin/mentors/${userId}/toggle`);

    const deleteMentor = (userId) => {
        if (confirm("Hapus akun mentor ini?")) {
            router.delete(`/admin/mentors/${userId}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/mentors", {
            onSuccess: () => { reset(); setShowAddModal(false); },
        });
    };

    return (
        <AppLayout title="Kelola Mentor">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Kelola Mentor / Pembimbing</h1>
                        <p className="page-subtitle">Manajemen akun pembimbing PKL</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge bg-primary-100 text-primary-700 text-sm px-3 py-1.5">
                            {mentors.total} Mentor
                        </span>
                        <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
                            <Plus size={15} /> Tambah Mentor
                        </button>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={applyFilter} className="card card-body">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className="form-input pl-9" placeholder="Cari nama atau email..."
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary">Cari</button>
                    </div>
                </form>

                {/* Table */}
                <div className="card overflow-hidden">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mentor</th>
                                    <th className="hidden md:table-cell">Jabatan / Divisi</th>
                                    <th className="hidden lg:table-cell">No. HP</th>
                                    <th className="hidden lg:table-cell">Mahasiswa Bimbingan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mentors.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-400">
                                            <Users size={32} className="mx-auto mb-2 text-gray-200" />
                                            Belum ada mentor terdaftar
                                        </td>
                                    </tr>
                                ) : mentors.data.map((mentor) => {
                                    const profile = mentor.mentor_profile;
                                    const studentCount = mentor.internships_as_mentor?.length ?? 0;
                                    return (
                                        <tr key={mentor.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <img src={mentor.avatar_url} alt=""
                                                        className="w-9 h-9 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{mentor.name}</p>
                                                        <p className="text-xs text-gray-400">{mentor.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell">
                                                <p className="text-sm">{profile?.position || "-"}</p>
                                                <p className="text-xs text-gray-400">{profile?.division || "-"}</p>
                                            </td>
                                            <td className="hidden lg:table-cell text-sm text-gray-600">
                                                {profile?.phone || "-"}
                                            </td>
                                            <td className="hidden lg:table-cell">
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                                                    <Users size={13} className="text-gray-400" /> {studentCount}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${mentor.is_active ? "badge-active" : "badge-draft"}`}>
                                                    {mentor.is_active ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => toggleActive(mentor.id)}
                                                        className="btn-secondary btn-sm p-1.5" title="Toggle Status">
                                                        <ToggleLeft size={14} />
                                                    </button>
                                                    <button onClick={() => deleteMentor(mentor.id)}
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
                    {mentors.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-gray-100 flex justify-center gap-2">
                            {mentors.links.map((link, i) => (
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

            {/* ── Modal: Tambah Mentor ── */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Mentor Baru">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                        Password default: <strong>password123</strong> — mentor dapat mengubahnya setelah login.
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
                            <label className="form-label">ID Karyawan</label>
                            <input type="text" className="form-input" value={data.employee_id}
                                onChange={(e) => setData("employee_id", e.target.value)} placeholder="EMP-001" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">No. HP</label>
                            <input type="tel" className="form-input" value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)} placeholder="08xxxxxxxxx" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Jabatan</label>
                            <input type="text" className="form-input" value={data.position}
                                onChange={(e) => setData("position", e.target.value)} placeholder="Senior Developer" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Divisi</label>
                            <input type="text" className="form-input" value={data.division}
                                onChange={(e) => setData("division", e.target.value)} placeholder="IT, Design, Data, dll." />
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
        </AppLayout>
    );
}
