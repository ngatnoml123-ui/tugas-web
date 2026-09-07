import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title="Masuk ke Akun" subtitle="Selamat datang kembali di Saka InternHub">
            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            className={`form-input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="email@contoh.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="form-group">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="form-label mb-0" htmlFor="password">Password</label>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                    <input
                        id="remember"
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">Ingat saya</label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary w-full btn-lg"
                >
                    {processing ? 'Masuk...' : (
                        <>
                            Masuk <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-primary-600 font-medium hover:underline">
                        Daftar sebagai Mahasiswa
                    </Link>
                </p>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-primary-700 mb-2">Demo Admin:</p>
                <p className="text-xs text-gray-600">Email: <code className="bg-white px-1 rounded">admin@sakainternhub.id</code></p>
                <p className="text-xs text-gray-600 mt-1">Password: <code className="bg-white px-1 rounded">Admin@Saka2026</code></p>
            </div>
        </AuthLayout>
    );
}
