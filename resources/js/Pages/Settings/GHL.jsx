import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

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
        alert('Webhook URL copied to clipboard!');
    };

    return (
        <AuthenticatedLayout header="GoHighLevel Settings">
            <Head title="GHL Settings" />
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">GoHighLevel Integration</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Sync opportunities, contacts, and stages between Moe Limo and GHL.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Toggle */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${form.data.ghl_enabled ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <span className="text-xl">🔗</span>
                                </div>
                                <div>
                                    <span className="text-slate-900 dark:text-white font-semibold block">Enable GHL Integration</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Automate ticket creation from GHL opportunities.</p>
                                </div>
                            </div>
                            <div className="relative inline-flex items-center group">
                                <input type="checkbox" checked={form.data.ghl_enabled} onChange={e => form.setData('ghl_enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 rounded-full"></div>
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
                                <input type="password" value={form.data.ghl_api_key} onChange={e => form.setData('ghl_api_key', e.target.value)}
                                    placeholder="••••••••••••••••" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Pipeline Mapping (JSON)</label>
                                <textarea value={form.data.ghl_pipeline_mapping} onChange={e => form.setData('ghl_pipeline_mapping', e.target.value)} rows={3}
                                    placeholder='{"pipeline_id": "priority_level"}' className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none" />
                            </div>
                        </div>

                        {/* Webhook Config */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4">
                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                                <span className="text-lg">🛰️</span> Inbound Webhook
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Copy this URL and paste it into your GoHighLevel Workflow (Webhook Action) to send events to Moe Limo.
                            </p>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl break-all">
                                    <code className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                                        {window.location.origin}/webhooks/ghl
                                    </code>
                                </div>
                                <button type="button" onClick={() => copyToClipboard(`${window.location.origin}/webhooks/ghl`)}
                                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Copy URL
                                </button>
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
                            <button type="button" onClick={handleTest} disabled={testResult?.loading}
                                className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                                {testResult?.loading ? 'Testing...' : '🔌 Test Connection'}
                            </button>
                            <button type="submit" disabled={form.processing}
                                className="flex-1 sm:flex-none px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 shadow-xl shadow-blue-500/20 transition-all">
                                {form.processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
