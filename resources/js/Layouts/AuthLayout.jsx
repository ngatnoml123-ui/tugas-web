import { Shield } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                        <Shield size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Saka InternHub</h1>
                    <p className="text-primary-200 text-sm mt-1">PT Saka Inovasi Network</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {(title || subtitle) && (
                        <div className="mb-6">
                            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
                            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-primary-200/60 text-xs mt-6">
                    &copy; {new Date().getFullYear()} PT Saka Inovasi Network. Platform Portofolio Digital.
                </p>
            </div>
        </div>
    );
}
