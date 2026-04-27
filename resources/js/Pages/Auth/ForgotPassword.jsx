import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="mb-8">
                    <Link 
                        href={route('login')} 
                        className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft size={14} /> Back to Login
                    </Link>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-2">Forgot Password</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mb-4">Support Center</p>
                    <div className="text-xs text-gray-400 leading-relaxed">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                    </div>
                </div>

                {status && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="Email Address"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full group bg-gradient-to-r from-amber-600 to-amber-400 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Sending...' : (
                                <>
                                    Email Password Reset Link <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}

