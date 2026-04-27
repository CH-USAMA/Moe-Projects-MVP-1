import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Smartphone, 
    Key, 
    Users, 
    Copy, 
    Anchor, 
    Zap, 
    Power,
    CheckCircle2,
    XCircle,
    ArrowRight,
    MessageSquare,
    Terminal,
    Phone,
    X,
    Plus,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SMSSettings({ settings }) {
    const [testResult, setTestResult] = useState(null);
    const form = useForm({
        sms_api_key: '',
        sms_sender_name: settings.sms_sender_name || '',
        sms_notification_numbers: settings.sms_notification_numbers || [],
        sms_webhook_secret: settings.sms_webhook_secret || '',
        sms_enabled: settings.sms_enabled ?? false,
    });
    const [numInput, setNumInput] = useState('');

    const addNum = () => {
        if (!numInput) return;
        const current = Array.isArray(form.data.sms_notification_numbers) ? form.data.sms_notification_numbers : [];
        if (current.includes(numInput)) return;
        form.setData('sms_notification_numbers', [...current, numInput]);
        setNumInput('');
    };

    const rmNum = (n) => {
        form.setData('sms_notification_numbers', form.data.sms_notification_numbers.filter(x => x !== n));
    };

    const save = (e) => {
        e.preventDefault();
        form.post(route('settings.sms.update'), { preserveScroll: true });
    };

    const test = async () => {
        setTestResult({ loading: true });
        try {
            const r = await fetch(route('settings.sms.test'), { 
                method: 'POST', 
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 
                    'Accept': 'application/json' 
                } 
            });
            setTestResult(await r.json());
        } catch (e) {
            setTestResult({ success: false, message: e.message });
        }
    };

    const registerWebhook = async () => {
        if (!confirm('Do you want to automatically register the webhook URL with Mobile Text Alerts?')) return;
        setTestResult({ loading: true });
        try {
            const r = await fetch(route('settings.sms.register-webhook'), { 
                method: 'POST', 
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 
                    'Accept': 'application/json' 
                } 
            });
            const data = await r.json();
            setTestResult(data);
        } catch (e) {
            setTestResult({ success: false, message: e.message });
        }
    };

    const webhookUrl = window.location.origin + '/webhooks/sms';

    return (
        <AuthenticatedLayout header="SMS Settings">
            <Head title="SMS Configuration" />
            
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-10">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Mobile Text Configuration</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Configure your SMS gateway and notifications</p>
                </div>

                <form onSubmit={save} className="space-y-8">
                    {/* Activation Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${form.data.sms_enabled ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <span className="text-lg font-serif font-bold text-gray-900 dark:text-white tracking-tight">SMS Service</span>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Enable or disable automatic SMS alerts</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={form.data.sms_enabled} 
                                onChange={e => form.setData('sms_enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* API Access Config */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
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
                                        value={form.data.sms_api_key} 
                                        onChange={e => form.setData('sms_api_key', e.target.value)}
                                        placeholder="••••••••••••••••" 
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 ml-1 flex items-center gap-2">
                                        <Terminal size={12} className="text-amber-500" /> Sender Name
                                    </label>
                                    <input 
                                        value={form.data.sms_sender_name} 
                                        onChange={e => form.setData('sms_sender_name', e.target.value)}
                                        placeholder="Moe Limousine" 
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner" 
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Notification Matrix */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none">
                                <Users size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Phone size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Notification Numbers</h3>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div className="flex gap-3">
                                    <input 
                                        value={numInput} 
                                        onChange={e => setNumInput(e.target.value)} 
                                        placeholder="+1 (555) 000-0000" 
                                        className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNum())} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addNum} 
                                        className="px-6 bg-white/5 text-amber-500 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <AnimatePresence>
                                        {form.data.sms_notification_numbers?.length === 0 && (
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">No numbers added</p>
                                        )}
                                        {form.data.sms_notification_numbers?.map((n, i) => (
                                            <motion.span 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                key={i} 
                                                className="inline-flex items-center gap-2 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2.5 rounded-xl uppercase tracking-widest"
                                            >
                                                {n}
                                                <button type="button" onClick={() => rmNum(n)} className="text-amber-500/50 hover:text-red-500 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Inbound Webhook */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none">
                            <Anchor size={120} />
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-10 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <MessageSquare size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Inbound Webhook</h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={registerWebhook} 
                                disabled={testResult?.loading}
                                className="px-6 py-3 bg-amber-500 text-black rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
                            >
                                <Zap size={14} /> Register Webhook Automatically
                            </button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Anchor size={12} className="text-blue-400" /> Webhook URL
                                </label>
                                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 group">
                                    <code className="text-xs text-blue-400 font-mono flex-1 truncate">{webhookUrl}</code>
                                    <button 
                                        type="button" 
                                        onClick={() => navigator.clipboard.writeText(webhookUrl)} 
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-600 font-medium tracking-tight">Use this URL in your Mobile Text Alerts dashboard to receive incoming messages.</p>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-emerald-400" /> Webhook Secret
                                </label>
                                <input 
                                    type="text" 
                                    value={form.data.sms_webhook_secret} 
                                    onChange={e => form.setData('sms_webhook_secret', e.target.value)}
                                    placeholder="Enter your webhook secret..." 
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner" 
                                />
                                <p className="text-[10px] text-gray-600 font-medium tracking-tight">Used to verify that incoming requests are coming from a trusted source.</p>
                            </div>
                        </div>
                    </motion.div>

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
                                onClick={test} 
                                disabled={testResult?.loading}
                                className="px-8 py-5 bg-white/5 text-gray-400 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {testResult?.loading ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <Smartphone size={14} />
                                )}
                                {testResult?.loading ? 'Testing...' : 'Test Connection'}
                            </button>
                            <button 
                                type="submit" 
                                disabled={form.processing}
                                className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
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


