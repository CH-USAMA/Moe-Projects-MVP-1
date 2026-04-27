import { Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, CheckCircle2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputError from '@/Components/InputError';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                                required
                                autoComplete="name"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Your email address is unverified.
                        </div>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest hover:text-amber-700 dark:hover:text-amber-300 transition-colors bg-amber-500/10 px-4 py-2 rounded-xl"
                        >
                            Resend Verification Email
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </motion.div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-10 py-4 bg-black dark:bg-amber-500 text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 flex items-center gap-3 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : (
                            <>
                                Save Profile <Save size={14} />
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {recentlySuccessful && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, transition: { duration: 1 } }}
                                className="flex items-center gap-2 text-emerald-500"
                            >
                                <CheckCircle2 size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Saved Successfully</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </section>
    );
}

