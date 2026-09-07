import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Mail, Phone, QrCode, Download, MapPin, BookOpen, Building, Calendar, Award, X, Code, Palette, BarChart, FileText, File, Sparkles, Trophy, Mic, Wrench, Star } from 'lucide-react';

const CategoryIcon = ({ category, size = 18, className = "" }) => {
    const icons = { software: Code, design: Palette, data: BarChart, research: FileText, documentation: File, other: Sparkles };
    const Icon = icons[category] || File;
    return <Icon size={size} className={className} />;
};

const CertIcon = ({ type, size = 18, className = "" }) => {
    const icons = { certificate: Award, award: Trophy, seminar: Mic, workshop: Wrench, training: BookOpen, achievement: Star };
    const Icon = icons[type] || Award;
    return <Icon size={size} className={className} />;
};

function Section({ id, title, children, show = true }) {
    if (!show) return null;
    return (
        <section id={id} className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-600 rounded-full inline-block" />
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function Portfolio({ user, profile, settings, projects, works, certificates, activities, portfolioUrl }) {
    const [selectedWork, setSelectedWork] = useState(null);
    const themeColor = settings.theme_color || '#2563eb';

    const groupedWorks = works.reduce((acc, work) => {
        if (!acc[work.category]) acc[work.category] = [];
        acc[work.category].push(work);
        return acc;
    }, {});

    const internship = user.internships_as_student?.[0];

    return (
        <>
            <Head title={`${user.name} — Portofolio Digital | Saka InternHub`}>
                <meta head-key="description" name="description" content={profile.bio || `Portofolio digital ${user.name} dari Saka InternHub`} />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* ── Hero Header ── */}
                <div style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1d4ed8 100%)` }}
                    className="text-white py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/30 flex-shrink-0"
                            />
                            <div className="text-center sm:text-left flex-1">
                                <p className="text-blue-200 text-sm font-medium mb-1">Portofolio Digital</p>
                                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                                {profile.internship_field && (
                                    <p className="text-blue-100 mt-1">{profile.internship_field}</p>
                                )}
                                {profile.university && (
                                    <p className="text-blue-200 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                                        <BookOpen size={14} /> {profile.university} · {profile.study_program}
                                    </p>
                                )}
                                {/* Contact */}
                                {settings.show_contact && (
                                    <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                                        {profile.phone && (
                                            <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 text-blue-100 hover:text-white text-sm transition-colors">
                                                <Phone size={14} /> {profile.phone}
                                            </a>
                                        )}
                                        {user.email && (
                                            <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 text-blue-100 hover:text-white text-sm transition-colors">
                                                <Mail size={14} /> {user.email}
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* QR Download */}
                                <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                                    <a href={`/student/portfolio/qr`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-lg transition-all">
                                        <Download size={13} /> Download QR Code
                                    </a>
                                    <button onClick={() => { navigator.clipboard.writeText(portfolioUrl); alert('Link disalin!'); }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-lg transition-all">
                                        Salin Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* About */}
                    {settings.show_about && profile.bio && (
                        <Section id="about" title="Tentang Saya">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                            </div>
                        </Section>
                    )}

                    {/* Skills */}
                    {settings.show_skills && profile.skills && profile.skills.length > 0 && (
                        <Section id="skills" title="Skills & Kompetensi">
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <span key={skill}
                                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-full font-medium hover:border-primary-300 hover:text-primary-700 transition-colors shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Experience / Internship */}
                    {settings.show_experience && internship && (
                        <Section id="experience" title="Pengalaman PKL">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <Building size={22} className="text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">PT Saka Inovasi Network</h3>
                                        <p className="text-primary-600 font-medium text-sm">{internship.division}</p>
                                        <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                                            <Calendar size={13} />
                                            {internship.period?.name ||
                                                `${new Date(internship.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} —
                                                ${internship.end_date ? new Date(internship.end_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Sekarang'}`
                                            }
                                        </p>
                                        {internship.mentor && (
                                            <p className="text-gray-500 text-xs mt-1">
                                                Pembimbing: {internship.mentor.name}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`badge flex-shrink-0 ${internship.status === 'active' ? 'badge-active' : 'badge-completed'}`}>
                                        {internship.status === 'active' ? 'Aktif' : 'Selesai'}
                                    </span>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* Projects */}
                    {settings.show_projects && projects.length > 0 && (
                        <Section id="projects" title="Project Portfolio">
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-200 hover:shadow-card-hover transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{project.title}</h3>
                                                <p className="text-primary-600 text-sm font-medium">{project.role_in_project}</p>
                                                {project.description && (
                                                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">{project.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                    {(project.technologies || []).map((t) => (
                                                        <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{t}</span>
                                                    ))}
                                                </div>

                                                {/* Attached Works (Attachments) */}
                                                {project.works && project.works.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lampiran / Hasil Karya</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {project.works.map((work) => (
                                                                <button key={work.id} onClick={() => setSelectedWork(work)} type="button"
                                                                    className="flex items-center gap-3 p-2 text-left rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group/file w-full">
                                                                    {work.thumbnail_path ? (
                                                                        <img src={work.thumbnail_url} alt={work.title} className="w-10 h-10 rounded object-cover border border-gray-100" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-lg border border-gray-200">
                                                                            <CategoryIcon category={work.category} size={20} />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover/file:text-primary-700 transition-colors">{work.title}</p>
                                                                        <p className="text-[10px] text-gray-500 truncate">
                                                                            {work.file_original_name || (work.external_link ? 'External Link' : 'Dokumen Lampiran')}
                                                                            {work.file_size ? ` • ${(work.file_size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="badge badge-published flex-shrink-0">Published</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Works by Category */}
                    {settings.show_works && works.length > 0 && (
                        <Section id="works" title="Karya">
                            {Object.entries(groupedWorks).map(([cat, catWorks]) => (
                                <div key={cat} className="mb-5">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span><CategoryIcon category={cat} size={18} className="text-gray-500" /></span>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        <span className="text-gray-300 font-normal">({catWorks.length})</span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {catWorks.map((work) => (
                                            <div key={work.id} onClick={() => setSelectedWork(work)} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-200 hover:shadow-card-hover transition-all group cursor-pointer">
                                                {work.thumbnail_path && (
                                                    <div className="h-36 overflow-hidden">
                                                        <img src={work.thumbnail_url} alt={work.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{work.title}</h4>
                                                    {work.sub_category && (
                                                        <p className="text-xs text-gray-500 mt-0.5">{work.sub_category}</p>
                                                    )}
                                                    {work.technologies && work.technologies.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {work.technologies.slice(0, 4).map((t) => (
                                                                <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {work.external_link && (
                                                        <a href={work.external_link} target="_blank"
                                                            className="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:underline">
                                                            <ExternalLink size={11} /> Lihat Demo
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* Certificates */}
                    {settings.show_certificates && certificates.length > 0 && (
                        <Section id="certificates" title="Sertifikat & Achievement">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-200 transition-all">
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 text-primary-500"><CertIcon type={cert.type} size={24} /></span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm">{cert.title}</h4>
                                                {cert.issuer && <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>}
                                                {cert.issued_date && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(cert.issued_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-3 mt-1.5">
                                                    {cert.file_path && (
                                                        <a href={cert.file_url} target="_blank"
                                                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline">
                                                            <Download size={10} /> Lihat Sertifikat
                                                        </a>
                                                    )}
                                                    {cert.credential_url && (
                                                        <a href={cert.credential_url} target="_blank"
                                                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline">
                                                            <ExternalLink size={10} /> Verifikasi
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Activities */}
                    {activities && activities.length > 0 && (
                        <Section id="activities" title="Aktivitas PKL Terbaru">
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {activities.map((activity, index) => (
                                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-100 text-primary-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <Calendar size={16} />
                                        </div>
                                        {/* Card */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-primary-300 hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                                <h4 className="font-bold text-gray-900">{activity.title}</h4>
                                                <time className="text-xs font-medium text-primary-600 sm:text-gray-500">
                                                    {new Date(activity.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </time>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                                            
                                            {activity.evidences && activity.evidences.length > 0 && (
                                                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                                                    {activity.evidences.map((evidence) => (
                                                        <a key={evidence.id} href={evidence.file_url} target="_blank"
                                                            className="flex-shrink-0 relative group/img cursor-pointer">
                                                            {evidence.file_mime_type?.startsWith('image/') ? (
                                                                <img src={evidence.file_url} alt="Evidence" 
                                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                                            ) : (
                                                                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-gray-400">
                                                                    <FileText size={24} />
                                                                </div>
                                                            )}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 py-6 px-4 mt-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-gray-400 text-sm">
                            Portofolio Digital oleh <strong className="text-primary-600">Saka InternHub</strong> ·
                            PT Saka Inovasi Network · &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>

            {/* Work Detail Modal */}
            {selectedWork && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedWork(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedWork(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10">
                            <X size={20} />
                        </button>

                        {selectedWork.thumbnail_path && (
                            <div className="w-full h-48 sm:h-64 bg-gray-100 relative">
                                <img src={selectedWork.thumbnail_url} alt={selectedWork.title}
                                    className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-gray-600"><CategoryIcon category={selectedWork.category} size={24} /></span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                                    {selectedWork.category} {selectedWork.sub_category ? ` • ${selectedWork.sub_category}` : ''}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedWork.title}</h2>
                            
                            {selectedWork.description && (
                                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                                    {selectedWork.description}
                                </p>
                            )}

                            {selectedWork.technologies && selectedWork.technologies.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Teknologi / Tools:</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedWork.technologies.map((t) => (
                                            <span key={t} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                {selectedWork.file_path && (
                                    <a href={selectedWork.file_url} target="_blank"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors">
                                        <Download size={16} /> Unduh File 
                                    </a>
                                )}
                                {selectedWork.external_link && (
                                    <a href={selectedWork.external_link} target="_blank"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-colors">
                                        <ExternalLink size={16} /> Lihat Demo / Link URL
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
