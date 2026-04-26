import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

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
        if (!confirm('This will automatically register your webhook with Mobile Text Alerts. Continue?')) return;
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
            <Head title="SMS Settings" />
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mobile Text Alerts</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure urgent SMS notifications and inbound message automation.</p>
                </div>

                <form onSubmit={save} className="space-y-6">
                    {/* Status Toggle */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${form.data.sms_enabled ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <span className="text-xl">📱</span>
                                </div>
                                <div>
                                    <span className="text-slate-900 dark:text-white font-semibold block">Enable SMS Integration</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Allow sending alerts and receiving inbound tickets via SMS.</p>
                                </div>
                            </div>
                            <div className="relative inline-flex items-center group">
                                <input type="checkbox" checked={form.data.sms_enabled} onChange={e => form.setData('sms_enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 rounded-full"></div>
                            </div>
                        </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* API Config */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4">
                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                                <span className="text-lg">🔑</span> API Configuration
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                                <input type="password" value={form.data.sms_api_key} onChange={e => form.setData('sms_api_key', e.target.value)}
                                    placeholder="••••••••••••••••" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sender Name</label>
                                <input value={form.data.sms_sender_name} onChange={e => form.setData('sms_sender_name', e.target.value)}
                                    placeholder="MOE LIMO" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" />
                            </div>
                        </div>

                        {/* Notification Numbers */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4">
                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                                <span className="text-lg">📞</span> Notification Numbers
                            </h3>
                            <div className="flex gap-2">
                                <input value={numInput} onChange={e => setNumInput(e.target.value)} placeholder="+1234567890" 
                                    className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNum())} />
                                <button type="button" onClick={addNum} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {form.data.sms_notification_numbers?.length === 0 && <p className="text-xs text-slate-400">No numbers added yet.</p>}
                                {form.data.sms_notification_numbers?.map((n, i) => (
                                    <span key={i} className="inline-flex items-center gap-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-lg font-bold border border-amber-500/20">
                                        {n}
                                        <button type="button" onClick={() => rmNum(n)} className="text-amber-500 hover:text-red-500 transition-colors text-lg line-height-0">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Webhook Configuration */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                                <span className="text-lg">⚓</span> Inbound Webhook
                            </h3>
                            <button type="button" onClick={registerWebhook} disabled={testResult?.loading}
                                className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded hover:bg-amber-500/20 transition-all border border-amber-500/20">
                                ⚡ Register Webhook Automatically
                            </button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Webhook URL</label>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 group">
                                    <code className="text-xs text-slate-600 dark:text-slate-300 font-mono flex-1 truncate">{webhookUrl}</code>
                                    <button type="button" onClick={() => navigator.clipboard.writeText(webhookUrl)} className="text-slate-400 hover:text-amber-500 transition-colors" title="Copy URL">
                                        📋
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 italic mt-2">Paste this into your Mobile Text Alerts dashboard under <strong>Webhooks</strong>.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Webhook Secret (Optional)</label>
                                <input type="text" value={form.data.sms_webhook_secret} onChange={e => form.setData('sms_webhook_secret', e.target.value)}
                                    placeholder="abc123-your-secret-here" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" />
                                <p className="text-[10px] text-slate-500 italic mt-2">Used to verify that inbound messages are authentic.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                        <div className="w-full sm:w-auto">
                            {testResult && !testResult.loading && (
                                <div className={`rounded-xl px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-left-4 ${testResult.success ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                    {testResult.success ? '✓' : '✗'} {testResult.message}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button type="button" onClick={test} disabled={testResult?.loading}
                                className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                                {testResult?.loading ? 'Sending...' : '📱 Test SMS'}
                            </button>
                            <button type="submit" disabled={form.processing}
                                className="flex-1 sm:flex-none px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 shadow-xl shadow-amber-500/20 transition-all">
                                {form.processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

