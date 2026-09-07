import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { User, Camera, Plus, X } from 'lucide-react';

const COMMON_SKILLS = [
    'Laravel', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP',
    'JavaScript', 'TypeScript', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design',
    'Data Analysis', 'Machine Learning', 'Docker', 'Git', 'Linux',
    'REST API', 'GraphQL', 'Flutter', 'React Native',
];

export default function Profile({ user, profile }) {
    const [avatarPreview, setAvatarPreview] = useState(user.avatar_url);
    const [skillInput, setSkillInput] = useState('');
    const fileRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        name:             user.name || '',
        nim:              profile?.nim || '',
        university:       profile?.university || '',
        study_program:            profile?.study_program || '',
        semester:         profile?.semester || '',
        phone:            profile?.phone || '',
        address:          profile?.address || '',
        internship_field: profile?.internship_field || '',
        skills:           profile?.skills || [],
        bio:              profile?.bio || '',
        avatar:           null,
        _method:          'PATCH',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const addSkill = (skill) => {
        if (skill && !data.skills.includes(skill)) {
            setData('skills', [...data.skills, skill]);
        }
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        setData('skills', data.skills.filter((s) => s !== skill));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/student/profile', { forceFormData: true });
    };

    return (
        <AppLayout title="Profil Saya">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Profil Mahasiswa</h1>
                        <p className="page-subtitle">Lengkapi data diri untuk portofolio publik Anda</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* ── Avatar ── */}
                    <div className="card card-body flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-100"
                            />
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 shadow"
                            >
                                <Camera size={13} />
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.role?.display_name}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {profile?.public_slug
                                    ? <>Portofolio: <a href={`/p/${profile.public_slug}`} target="_blank" className="text-primary-600 hover:underline">/p/{profile.public_slug}</a></>
                                    : 'Slug portofolio akan dibuat otomatis'}
                            </p>
                        </div>
                    </div>

                    {/* ── Data Pribadi ── */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User size={16} /> Data Pribadi
                            </h3>
                        </div>
                        <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group sm:col-span-2">
                                <label className="form-label">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="form-error">{errors.name}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">NIM</label>
                                <input type="text" className="form-input" value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">No. HP</label>
                                <input type="tel" className="form-input" value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)} placeholder="08xxxxxxxxx" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Universitas</label>
                                <input type="text" className="form-input" value={data.university}
                                    onChange={(e) => setData('university', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Program Studi</label>
                                <input type="text" className="form-input" value={data.study_program}
                                    onChange={(e) => setData('study_program', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Semester</label>
                                <input type="number" min="1" max="14" className="form-input" value={data.semester}
                                    onChange={(e) => setData('semester', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bidang PKL</label>
                                <input type="text" className="form-input" value={data.internship_field}
                                    onChange={(e) => setData('internship_field', e.target.value)}
                                    placeholder="IT, Software Development, UI/UX, Data, dll." />
                            </div>
                            <div className="form-group sm:col-span-2">
                                <label className="form-label">Alamat</label>
                                <textarea className="form-textarea" rows={2} value={data.address}
                                    onChange={(e) => setData('address', e.target.value)} />
                            </div>
                            <div className="form-group sm:col-span-2">
                                <label className="form-label">Bio / Deskripsi Singkat</label>
                                <textarea className="form-textarea" rows={3} value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    placeholder="Ceritakan sedikit tentang diri Anda, passion, dan tujuan karir..." />
                                <p className="form-hint">{data.bio.length}/1000 karakter</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Skills ── */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Skills & Kompetensi</h3>
                        </div>
                        <div className="card-body space-y-4">
                            {/* Selected skills */}
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {data.skills.map((skill) => (
                                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-900">
                                            <X size={13} />
                                        </button>
                                    </span>
                                ))}
                                {data.skills.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">Belum ada skill dipilih.</p>
                                )}
                            </div>

                            {/* Custom skill input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="form-input flex-1"
                                    placeholder="Ketik skill custom..."
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput.trim()); }
                                    }}
                                />
                                <button type="button" onClick={() => addSkill(skillInput.trim())} className="btn-secondary">
                                    <Plus size={16} /> Tambah
                                </button>
                            </div>

                            {/* Quick-add buttons */}
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Pilih cepat:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {COMMON_SKILLS.filter((s) => !data.skills.includes(s)).map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => addSkill(skill)}
                                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-600 rounded-full transition-colors"
                                        >
                                            + {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={processing} className="btn-primary btn-lg">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
