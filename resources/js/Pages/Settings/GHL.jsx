import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Link2, 
    Key, 
    Activity, 
    Copy, 
    Webhook, 
    ShieldCheck, 
    Zap, 
    Power,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RefreshCw,
    Terminal,
    Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GHLSettings({ settings }) {
    const [testResult, setTestResult] = useState(null);
    const form = useForm({
        ghl_api_key: '',
        ghl_webhook_url: settings.ghl_webhook_url || '',
        ghl_pipeline_mapping: settings.ghl_pipeline_mapping || '',
        ghl_enabled: settings.ghl_enabled ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('settings.ghl.update'), { preserveScroll: true });
    };

    const handleTest = async () => {
        setTestResult({ loading: true });
        try {
            const res = await fetch(route('settings.ghl.test'), { 
                method: 'POST', 
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 
                    'Accept': 'application/json' 
                } 
            });
            const data = await res.json();
            setTestResult(data);
        } catch (e) { 
            setTestResult({ success: false, message: e.message }); 
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <AuthenticatedLayout header="GHL Settings">
            <Head title="GoHighLevel Configuration" />
            
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-10">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">GoHighLevel Integration</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Sync your CRM opportunities and pipelines</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Activation Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${form.data.ghl_enabled ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-500'}`}>
                                <Link2 size={24} />
                            </div>
                            <div>
                                <span className="text-lg font-serif font-bold text-gray-900 dark:text-white tracking-tight">Integration Status</span>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Enable or disable GoHighLevel data synchronization</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={form.data.ghl_enabled} 
                                onChange={e => form.setData('ghl_enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-100 dark:bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* API Configuration */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none">
                                <Key size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">API Credentials</h3>
                            </div>
                            
                            <div className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 ml-1 flex items-center gap-2">
                                        <Key size={12} className="text-amber-500" /> API Secret Key
                                    </label>
                                    <input 
                                        type="password" 
                                        value={form.data.ghl_api_key} 
                                        onChange={e => form.setData('ghl_api_key', e.target.value)}
                                        placeholder="••••••••••••••••" 
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 ml-1 flex items-center gap-2">
                                        <Map size={12} className="text-blue-400" /> Pipeline Mapping (JSON)
                                    </label>
                                    <textarea 
                                        value={form.data.ghl_pipeline_mapping} 
                                        onChange={e => form.setData('ghl_pipeline_mapping', e.target.value)} 
                                        rows={4}
                                        placeholder='{"pipeline_id": "priority_level"}' 
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none shadow-inner" 
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Webhook Configuration */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none">
                                <Webhook size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Inbound Webhooks</h3>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Use this secure endpoint in your GoHighLevel workflows to send events to this platform.
                                </p>
                                <div className="p-6 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2rem] space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Webhook URL</span>
                                        <code className="text-xs text-blue-400 font-mono break-all leading-relaxed">
                                            {window.location.origin}/webhooks/ghl
                                        </code>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => copyToClipboard(`${window.location.origin}/webhooks/ghl`)}
                                        className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Copy size={14} /> Copy Webhook URL
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <div className="w-full md:w-auto">
                            <AnimatePresence mode="wait">
                                {testResult && !testResult.loading && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`px-6 py-4 rounded-2xl flex items-center gap-3 ${testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                    >
                                        {testResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{testResult.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button 
                                type="button" 
                                onClick={handleTest} 
                                disabled={testResult?.loading}
                                className="px-8 py-5 bg-white/5 text-gray-400 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {testResult?.loading ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <Terminal size={14} />
                                )}
                                {testResult?.loading ? 'Testing...' : 'Test Connection'}
                            </button>
                            <button 
                                type="submit" 
                                disabled={form.processing}
                                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {form.processing ? 'Saving...' : (
                                    <>
                                        Save Settings <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

