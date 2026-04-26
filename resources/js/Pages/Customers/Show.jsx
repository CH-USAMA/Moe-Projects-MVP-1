import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_COLORS = {
    open: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    pending: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
    waiting: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    resolved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    closed: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
};

export default function CustomerShow({ customer }) {
    const [syncing, setSyncing] = useState(false);
    const form = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        tags: Array.isArray(customer.tags) ? customer.tags : [],
        category: customer.category || 'normal',
        notifications_enabled: customer.notifications_enabled,
        logging_enabled: customer.logging_enabled,
    });

    const [tagInput, setTagInput] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        form.patch(route('customers.update', customer.id), { preserveScroll: true });
    };

    const addTag = () => {
        if (!tagInput || form.data.tags.includes(tagInput)) return;
        form.setData('tags', [...form.data.tags, tagInput]);
        setTagInput('');
    };

    const removeTag = (tag) => {
        form.setData('tags', form.data.tags.filter(t => t !== tag));
    };

    const handleGHLSync = () => {
        setSyncing(true);
        router.post(route('customers.sync-ghl', customer.id), {}, {
            onFinish: () => setSyncing(false),
            preserveScroll: true
        });
    };

    const initials = (customer.name || 'C')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <AuthenticatedLayout header="Customer Profile">
            <Head title={`Customer — ${customer.name || customer.email}`} />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Profile Card */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                        <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-500" />
                        <div className="px-6 pb-6 relative">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 flex items-center justify-center text-2xl font-bold text-amber-500 shadow-xl">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                                        {customer.name || 'Unnamed Customer'}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{customer.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleGHLSync} disabled={syncing}
                                        className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg text-sm font-bold hover:bg-blue-500/20 transition-all disabled:opacity-50">
                                        {syncing ? 'Syncing...' : '🔗 Sync GHL'}
                                    </button>
                                    <button onClick={() => { if(confirm('Delete customer and all tickets?')) router.delete(route('customers.destroy', customer.id)) }}
                                        className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-all">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4 mt-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input value={form.data.name} onChange={e => form.setData('name', e.target.value)}
                                        placeholder="Enter name..." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input value={form.data.phone} onChange={e => form.setData('phone', e.target.value)}
                                        placeholder="+1..." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-4 py-4 border-y border-slate-100 dark:border-slate-800/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Priority</label>
                                            <div className="flex gap-2 mt-2">
                                                {['important', 'normal', 'casual'].map(cat => (
                                                    <button key={cat} type="button" onClick={() => form.setData('category', cat)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${form.data.category === cat ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                                        {cat === 'important' ? '⭐ ' : cat === 'casual' ? '☕ ' : '📬 '}{cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative inline-flex items-center">
                                                    <input type="checkbox" checked={form.data.notifications_enabled} onChange={e => form.setData('notifications_enabled', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 rounded-full shadow-inner"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Notifications</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative inline-flex items-center">
                                                    <input type="checkbox" checked={form.data.logging_enabled} onChange={e => form.setData('logging_enabled', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 rounded-full shadow-inner"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Logging</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tags</label>
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        {form.data.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg font-medium border border-slate-200 dark:border-slate-700">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 transition-colors font-bold text-base">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Add a tag..." className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-amber-500/20" />
                                        <button type="button" onClick={addTag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Add</button>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 flex justify-end pt-4">
                                    <button type="submit" disabled={form.processing}
                                        className="px-10 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 shadow-xl shadow-amber-500/20 transition-all">
                                        {form.processing ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Ticket History */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/30 flex items-center justify-between">
                            <h3 className="text-slate-900 dark:text-white font-bold">Ticket History</h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{customer.tickets?.length || 0} Total</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
                            {customer.tickets?.length === 0 && (
                                <div className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-4">🎫</div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No ticket history for this customer.</p>
                                </div>
                            )}
                            {customer.tickets?.map(t => (
                                <Link key={t.id} href={route('tickets.show', t.id)} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                                        #{t.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{t.subject}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {new Date(t.created_at).toLocaleDateString()} • {t.source}
                                        </p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${STATUS_COLORS[t.status]}`}>
                                            {t.status}
                                        </span>
                                        <span className="text-slate-300 dark:text-slate-700">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 h-fit">
                    {/* Insights Card */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Customer Insights</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/30">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">📅</div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Since</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(customer.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/30">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">🎟️</div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Engagement</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{customer.tickets?.length || 0} Total Tickets</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800/30" />

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">External References</h4>
                            <div className="space-y-2">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/30">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">GHL Opportunity ID</p>
                                    <code className="text-xs text-blue-500 break-all font-mono">
                                        {customer.external_ids?.ghl_opportunity_id || 'Not Synced'}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
