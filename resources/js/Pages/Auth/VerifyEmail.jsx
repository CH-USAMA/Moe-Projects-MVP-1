import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="text-amber-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-2">Verify Email</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mb-4">Support Center</p>
                    <div className="text-xs text-gray-400 leading-relaxed px-4">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                    </div>
                </div>

                {status === 'verification-link-sent' && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium text-center"
                    >
                        A new verification link has been sent to the email address you provided during registration.
                    </motion.div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full group bg-gradient-to-r from-amber-600 to-amber-400 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Sending...' : (
                                <>
                                    Resend Verification Email <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center mt-8">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Log Out <LogOut size={14} />
                        </Link>
                    </div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}

