import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthLayout title="Daftar Mahasiswa" subtitle="Buat akun portofolio digital Anda">
            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Nama Lengkap</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                        </span>
                        <input
                            id="name"
                            type="text"
                            className={`form-input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Nama Lengkap Anda"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

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
                            className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="email@contoh.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Min. 8 karakter"
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

                {/* Confirm Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="password_confirmation">Konfirmasi Password</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                        </span>
                        <input
                            id="password_confirmation"
                            type="password"
                            className="form-input pl-10"
                            placeholder="Ulangi password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary w-full btn-lg mt-2"
                >
                    {processing ? 'Mendaftar...' : (
                        <>
                            Buat Akun <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-primary-600 font-medium hover:underline">
                        Masuk
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
