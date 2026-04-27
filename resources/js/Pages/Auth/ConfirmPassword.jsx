import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Security Re-Authorization" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="text-amber-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-2">Secure Zone</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mb-4">Re-Authorization Required</p>
                    <div className="text-xs text-gray-400 leading-relaxed px-4">
                        You are attempting to access a high-security administrative sector. Please re-authorize your session by confirming your passcode.
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Enter Secure Passcode"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full group bg-gradient-to-r from-amber-600 to-amber-400 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Authorizing...' : (
                                <>
                                    Authorize Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
