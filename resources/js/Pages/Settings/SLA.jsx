import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Clock, 
    AlertCircle, 
    ShieldAlert, 
    Timer, 
    Power, 
    CheckCircle2, 
    Save, 
    Activity,
    Bell,
    Settings2,
    Zap,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SLASettings({ settings }) {
    const form = useForm({
        sla_enabled: settings.sla_enabled ?? true,
        sla_level1_hours: settings.sla_level1_hours ?? 1,
        sla_level1_color: settings.sla_level1_color ?? '#10b981', // emerald-500
        sla_level2_hours: settings.sla_level2_hours ?? 2,
        sla_level2_color: settings.sla_level2_color ?? '#f59e0b', // amber-500
        sla_level3_hours: settings.sla_level3_hours ?? 3,
        sla_level3_color: settings.sla_level3_color ?? '#ef4444', // red-500
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('settings.sla.update'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="SLA Settings">
            <Head title="SLA Configuration" />
            
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-10">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Response Time Thresholds</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Configure your support response time levels</p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Activation Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${form.data.sla_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
                                <Timer size={24} />
                            </div>
                            <div>
                                <span className="text-lg font-serif font-bold text-gray-900 dark:text-white tracking-tight">SLA Service Status</span>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Enable or disable automatic response time tracking</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={form.data.sla_enabled} 
                                onChange={e => form.setData('sla_enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Level 1 - Low Priority */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-white pointer-events-none group-hover:scale-110 transition-transform">
                                <Activity size={80} />
                            </div>
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Bell size={18} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Level 1 Priority</h3>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Response Limit (Hours)</label>
                                    <input 
                                        type="number" 
                                        value={form.data.sla_level1_hours} 
                                        onChange={e => form.setData('sla_level1_hours', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Status Color</label>
                                    <div className="flex items-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3">
                                        <input 
                                            type="color" 
                                            value={form.data.sla_level1_color} 
                                            onChange={e => form.setData('sla_level1_color', e.target.value)}
                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" 
                                        />
                                        <span className="text-xs font-mono text-gray-400 uppercase">{form.data.sla_level1_color}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Normal Urgency</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </motion.div>

                        {/* Level 2 - Medium Priority */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-white pointer-events-none group-hover:scale-110 transition-transform">
                                <AlertCircle size={80} />
                            </div>
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <Zap size={18} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Level 2 Priority</h3>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Response Limit (Hours)</label>
                                    <input 
                                        type="number" 
                                        value={form.data.sla_level2_hours} 
                                        onChange={e => form.setData('sla_level2_hours', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Status Color</label>
                                    <div className="flex items-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3">
                                        <input 
                                            type="color" 
                                            value={form.data.sla_level2_color} 
                                            onChange={e => form.setData('sla_level2_color', e.target.value)}
                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" 
                                        />
                                        <span className="text-xs font-mono text-gray-400 uppercase">{form.data.sla_level2_color}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Medium Urgency</span>
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            </div>
                        </motion.div>

                        {/* Level 3 - Critical Priority */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group hover:bg-white/[0.05] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-white pointer-events-none group-hover:scale-110 transition-transform">
                                <ShieldAlert size={80} />
                            </div>
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <ShieldAlert size={18} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Level 3 Priority</h3>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Response Limit (Hours)</label>
                                    <input 
                                        type="number" 
                                        value={form.data.sla_level3_hours} 
                                        onChange={e => form.setData('sla_level3_hours', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Status Color</label>
                                    <div className="flex items-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3">
                                        <input 
                                            type="color" 
                                            value={form.data.sla_level3_color} 
                                            onChange={e => form.setData('sla_level3_color', e.target.value)}
                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" 
                                        />
                                        <span className="text-xs font-mono text-gray-400 uppercase">{form.data.sla_level3_color}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">High Urgency</span>
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button 
                            type="submit" 
                            disabled={form.processing}
                            className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {form.processing ? 'Saving...' : (
                                <>
                                    Save Settings <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

