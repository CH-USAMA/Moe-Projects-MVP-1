import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock, ShieldCheck, CheckCircle2, Save, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputError from '@/Components/InputError';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div className="grid md:grid-cols-1 gap-8">
                    {/* Current Password */}
                    <div className="relative group max-w-md">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Current Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                <Key size={18} />
                            </div>
                            <input
                                id="current_password"
                                ref={currentPasswordInput}
                                type="password"
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                placeholder="Enter current password"
                                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                                autoComplete="current-password"
                            />
                        </div>
                        <InputError message={errors.current_password} className="mt-2" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* New Password */}
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    ref={passwordInput}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-10 py-4 bg-black dark:bg-amber-500 text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 flex items-center gap-3 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : (
                            <>
                                Save Changes <Save size={14} />
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

