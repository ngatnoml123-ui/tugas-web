import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, User, FolderOpen, Briefcase,
    Activity, Award, Users, Database, LogOut,
    ChevronLeft, Menu, X, Shield, Eye, Bell, Calendar,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const studentLinks = [
    { href: '/student/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { href: '/student/profile',      label: 'Profil Saya',  icon: User },
    { href: '/student/projects',     label: 'Projects',     icon: FolderOpen },
    { href: '/student/works',        label: 'Karya',        icon: Briefcase },
    { href: '/student/activities',   label: 'Aktivitas',    icon: Activity },
    { href: '/student/certificates', label: 'Sertifikat',   icon: Award },
];

const mentorLinks = [
    { href: '/mentor/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
    { href: '/mentor/projects',  label: 'Review Project',icon: FolderOpen },
    { href: '/mentor/works',     label: 'Review Karya',  icon: Eye },
];

const adminLinks = [
    { href: '/admin/dashboard',        label: 'Dashboard',         icon: LayoutDashboard },
    { href: '/admin/students',         label: 'Mahasiswa',         icon: Users },
    { href: '/admin/mentors',          label: 'Mentor',            icon: Shield },
    { href: '/admin/periods',          label: 'Periode PKL',       icon: Calendar },
    { href: '/admin/talent-database',  label: 'Talent Database',   icon: Database },
];

function NavLink({ href, label, icon: Icon }) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href + '/');

    return (
        <Link
            href={href}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );
}

export default function AppLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role?.name;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const links = role === 'admin' ? adminLinks
                : role === 'pembimbing' ? mentorLinks
                : studentLinks;

    const dashboardHref = role === 'admin'      ? '/admin/dashboard'
                        : role === 'pembimbing' ? '/mentor/dashboard'
                        : '/student/dashboard';

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [usePage().url]);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* ── Overlay (mobile) ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200
                flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link href={dashboardHref} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">Saka InternHub</p>
                            <p className="text-[10px] text-gray-400 leading-none mt-0.5">PT Saka Inovasi Network</p>
                        </div>
                    </Link>
                    <button
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <p className="sidebar-group-label">
                        {role === 'admin' ? 'Administrasi' : role === 'pembimbing' ? 'Pembimbing' : 'Mahasiswa'}
                    </p>
                    {links.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-2">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.role?.display_name}</p>
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut size={16} />
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top navbar */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex-1">
                        {title && (
                            <h1 className="text-sm font-semibold text-gray-900 hidden sm:block">{title}</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                        />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
