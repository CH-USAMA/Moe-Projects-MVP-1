import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

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
        <AuthenticatedLayout header="SLA & Alerting">
            <Head title="SLA Settings" />
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ticket Response SLAs</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Set time thresholds to visually highlight tickets that haven't been responded to.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${form.data.sla_enabled ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <span className="text-xl">⏳</span>
                                </div>
                                <div>
                                    <span className="text-slate-900 dark:text-white font-semibold block">Enable SLA Highlighting</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Tickets will change color in the list based on their "Time Open" status.</p>
                                </div>
                            </div>
                            <div className="relative inline-flex items-center group">
                                <input type="checkbox" checked={form.data.sla_enabled} onChange={e => form.setData('sla_enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 rounded-full"></div>
                            </div>
                        </label>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Level 1 */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4 border-l-4" style={{ borderLeftColor: form.data.sla_level1_color }}>
                            <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2">Level 1 Alert</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hours Threshold</label>
                                    <input type="number" value={form.data.sla_level1_hours} onChange={e => form.setData('sla_level1_hours', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Highlight Color</label>
                                    <input type="color" value={form.data.sla_level1_color} onChange={e => form.setData('sla_level1_color', e.target.value)}
                                        className="w-full h-10 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {/* Level 2 */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4 border-l-4" style={{ borderLeftColor: form.data.sla_level2_color }}>
                            <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2">Level 2 Alert</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hours Threshold</label>
                                    <input type="number" value={form.data.sla_level2_hours} onChange={e => form.setData('sla_level2_hours', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Highlight Color</label>
                                    <input type="color" value={form.data.sla_level2_color} onChange={e => form.setData('sla_level2_color', e.target.value)}
                                        className="w-full h-10 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {/* Level 3 */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4 border-l-4" style={{ borderLeftColor: form.data.sla_level3_color }}>
                            <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2">Level 3 Alert</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hours Threshold</label>
                                    <input type="number" value={form.data.sla_level3_hours} onChange={e => form.setData('sla_level3_hours', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Highlight Color</label>
                                    <input type="color" value={form.data.sla_level3_color} onChange={e => form.setData('sla_level3_color', e.target.value)}
                                        className="w-full h-10 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={form.processing}
                            className="px-12 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-bold hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 shadow-xl shadow-emerald-500/20 transition-all">
                            {form.processing ? 'Saving...' : 'Save SLA Policy'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
