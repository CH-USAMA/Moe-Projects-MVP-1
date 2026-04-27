import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Access Hub" />

            {status && (
                <div className="mb-6 text-center text-sm font-medium text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label className="block text-xs font-semibold text-amber-500/70 uppercase tracking-widest mb-2 ml-1">
                        Professional Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-amber-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                            placeholder="name@moelimo.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2 text-xs text-red-400" />
                </div>

                {/* Password Input */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-xs font-semibold text-amber-500/70 uppercase tracking-widest">
                            Secure Password
                        </label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-amber-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2 text-xs text-red-400" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="bg-black/40 border-white/10 text-amber-500 focus:ring-amber-500/50 rounded"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs text-white/60 group-hover:text-white transition-colors">
                            Remember Access
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-white/40 hover:text-amber-500 transition-colors duration-300"
                        >
                            Reset Password
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={processing}
                        className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {processing ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                            <>
                                Enter Hub
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </GuestLayout>
    );
}

