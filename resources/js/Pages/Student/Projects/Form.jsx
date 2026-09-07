import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useState } from 'react';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
    'Mobile Developer', 'Data Analyst', 'System Analyst', 'Project Manager', 'DevOps', 'QA Engineer'];

const COMMON_TECHS = ['Laravel', 'React', 'Vue.js', 'Node.js', 'Python', 'PHP', 'JavaScript', 'TypeScript',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Figma', 'Adobe XD', 'Docker', 'Flutter', 'React Native', 'TailwindCSS', 'Bootstrap'];

const OUTPUT_TYPES = ['Website', 'Mobile Application', 'Desktop Application', 'Prototype', 'Dashboard',
    'Research', 'Documentation', 'Data Visualization', 'API', 'System Integration'];

export default function ProjectForm({ project, internship }) {
    const isEditing = !!project;
    const [techInput, setTechInput] = useState('');

    const { data, setData, post, patch, processing, errors } = useForm({
        internship_id:   project?.internship_id || internship?.id || '',
        title:           project?.title || '',
        description:     project?.description || '',
        role_in_project: project?.role_in_project || '',
        technologies:    project?.technologies || [],
        output_types:    project?.output_types || [],
        project_status:  project?.project_status || 'planning',
    });

    const addTech = (tech) => {
        if (tech && !data.technologies.includes(tech)) {
            setData('technologies', [...data.technologies, tech]);
        }
        setTechInput('');
    };

    const toggleOutput = (output) => {
        if (data.output_types.includes(output)) {
            setData('output_types', data.output_types.filter((o) => o !== output));
        } else {
            setData('output_types', [...data.output_types, output]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(`/student/projects/${project.id}`);
        } else {
            post('/student/projects');
        }
    };

    return (
        <AppLayout title={isEditing ? 'Edit Project' : 'Tambah Project'}>
            <div className="max-w-2xl mx-auto">
                <div className="page-header">
                    <div className="flex items-center gap-3">
                        <Link href="/student/projects" className="btn-ghost btn-sm p-2">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="page-title">{isEditing ? 'Edit Project' : 'Tambah Project'}</h1>
                            <p className="page-subtitle">
                                {internship ? `PKL: ${internship.period?.name}` : 'Isi detail project Anda'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="card card-body space-y-4">
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Judul Project *</label>
                            <input type="text" className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                                value={data.title} onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Sistem Informasi Manajemen Inventori" required />
                            {errors.title && <p className="form-error">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Deskripsi Project</label>
                            <textarea className="form-textarea" rows={4} value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan tujuan, latar belakang, dan hasil project..." />
                        </div>

                        {/* Role */}
                        <div className="form-group">
                            <label className="form-label">Peran dalam Project *</label>
                            <select className={`form-select ${errors.role_in_project ? 'border-red-500' : ''}`}
                                value={data.role_in_project} onChange={(e) => setData('role_in_project', e.target.value)} required>
                                <option value="">-- Pilih Peran --</option>
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.role_in_project && <p className="form-error">{errors.role_in_project}</p>}
                        </div>

                        {/* Project Status */}
                        <div className="form-group">
                            <label className="form-label">Status Project *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { val: 'planning',    label: 'Perencanaan', color: 'gray' },
                                    { val: 'development', label: 'Development', color: 'blue' },
                                    { val: 'testing',     label: 'Testing',     color: 'amber' },
                                    { val: 'completed',   label: 'Selesai',     color: 'green' },
                                ].map(({ val, label }) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setData('project_status', val)}
                                        className={`py-2 px-3 text-sm rounded-lg border-2 transition-all font-medium ${
                                            data.project_status === val
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Technologies */}
                        <div className="form-group">
                            <label className="form-label">Teknologi / Tools</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {data.technologies.map((t) => (
                                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                                        {t} <button type="button" onClick={() => setData('technologies', data.technologies.filter((x) => x !== t))}><X size={11} /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-2">
                                <input type="text" className="form-input flex-1" placeholder="Tambah teknologi..."
                                    value={techInput} onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput.trim()); } }} />
                                <button type="button" onClick={() => addTech(techInput.trim())} className="btn-secondary btn-sm"><Plus size={14} /></button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {COMMON_TECHS.filter((t) => !data.technologies.includes(t)).map((t) => (
                                    <button key={t} type="button" onClick={() => addTech(t)}
                                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-600 rounded-full transition-colors">
                                        + {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Output Types */}
                        <div className="form-group">
                            <label className="form-label">Tipe Output</label>
                            <div className="flex flex-wrap gap-2">
                                {OUTPUT_TYPES.map((out) => (
                                    <button
                                        key={out}
                                        type="button"
                                        onClick={() => toggleOutput(out)}
                                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                                            data.output_types.includes(out)
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                                        }`}
                                    >
                                        {out}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-3">
                        <Link href="/student/projects" className="btn-secondary btn-lg">Batal</Link>
                        <button type="submit" disabled={processing} className="btn-primary btn-lg">
                            {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Project')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
