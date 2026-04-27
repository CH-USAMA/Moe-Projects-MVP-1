import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    Tag, 
    Ticket, 
    Calendar, 
    Link2, 
    Trash2, 
    Bell, 
    ShieldCheck, 
    History, 
    ExternalLink, 
    Save, 
    Plus, 
    X,
    Activity,
    Smartphone,
    Globe,
    Star,
    Coffee,
    Inbox,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    waiting: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-white/5 text-gray-500 border-white/5',
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

            <div className="max-w-7xl mx-auto pb-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Header Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="h-32 bg-gradient-to-r from-amber-600/20 via-blue-600/10 to-indigo-600/20 relative">
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />
                            </div>
                            
                            <div className="px-10 pb-10 relative">
                                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-10">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-2xl relative z-10">
                                        <div className="w-full h-full rounded-[1.4rem] bg-black/20 backdrop-blur-xl flex items-center justify-center text-3xl font-serif font-bold text-white tracking-tighter">
                                            {initials}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-3xl font-serif font-bold text-white tracking-tight truncate">
                                            {customer.name || 'Anonymous Customer'}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <Mail size={14} className="text-blue-400/50" />
                                            <p className="text-gray-400 font-medium text-sm">{customer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleGHLSync} 
                                            disabled={syncing}
                                            className="px-6 py-3 bg-white/5 text-blue-400 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {syncing ? <RefreshCw size={14} className="animate-spin" /> : <Link2 size={14} />}
                                            Sync CRM
                                        </button>
                                        <button 
                                            onClick={() => { if(confirm('Delete customer and all tickets?')) router.delete(route('customers.destroy', customer.id)) }}
                                            className="p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSave} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                                <input 
                                                    value={form.data.name} 
                                                    onChange={e => form.setData('name', e.target.value)}
                                                    placeholder="Enter name..." 
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                                <input 
                                                    value={form.data.phone} 
                                                    onChange={e => form.setData('phone', e.target.value)}
                                                    placeholder="+1..." 
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-8 border-y border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 mb-4 block">Priority Level</label>
                                            <div className="flex gap-3">
                                                {[
                                                    { id: 'important', icon: <Star size={14} />, label: 'VIP' },
                                                    { id: 'normal', icon: <Inbox size={14} />, label: 'Standard' },
                                                    { id: 'casual', icon: <Coffee size={14} />, label: 'Casual' }
                                                ].map(cat => (
                                                    <button 
                                                        key={cat.id} 
                                                        type="button" 
                                                        onClick={() => form.setData('category', cat.id)}
                                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${form.data.category === cat.id ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                                    >
                                                        {cat.icon} {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-8">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative inline-flex items-center">
                                                    <input type="checkbox" checked={form.data.notifications_enabled} onChange={e => form.setData('notifications_enabled', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Alerts</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative inline-flex items-center">
                                                    <input type="checkbox" checked={form.data.logging_enabled} onChange={e => form.setData('logging_enabled', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Logging</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Tag size={12} className="text-blue-400" /> Organizational Tags
                                        </label>
                                        <div className="flex gap-2 flex-wrap min-h-[40px]">
                                            <AnimatePresence>
                                                {form.data.tags.map(tag => (
                                                    <motion.span 
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        key={tag} 
                                                        className="inline-flex items-center gap-2 text-[10px] bg-white/5 text-gray-300 px-4 py-2 rounded-xl font-bold uppercase tracking-wider border border-white/5 shadow-sm group/tag"
                                                    >
                                                        {tag}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeTag(tag)} 
                                                            className="text-gray-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </motion.span>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                        <div className="flex gap-3 max-w-md">
                                            <input 
                                                value={tagInput} 
                                                onChange={e => setTagInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                placeholder="Add identifier tag..." 
                                                className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={addTag} 
                                                className="px-6 py-3 bg-white/5 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={form.processing}
                                            className="px-10 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {form.processing ? 'Saving...' : (
                                                <>
                                                    <Save size={16} /> Update Profile
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* Ticket History Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                        <History size={18} />
                                    </div>
                                    <h3 className="text-white font-serif font-bold text-lg tracking-tight">Interaction History</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/5">
                                    {customer.tickets?.length || 0} Tickets
                                </span>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {customer.tickets?.length === 0 && (
                                    <div className="px-10 py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-700 mb-4">
                                            <Inbox size={32} />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">No interaction history detected</p>
                                    </div>
                                )}
                                {customer.tickets?.map((t, idx) => (
                                    <Link 
                                        key={t.id} 
                                        href={route('tickets.show', t.id)} 
                                        className="flex flex-col md:flex-row md:items-center gap-6 px-10 py-6 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                                            <span className="text-[9px] font-bold text-gray-600 group-hover:text-amber-500 transition-colors uppercase tracking-tighter">REF</span>
                                            <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">#{t.id}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-bold text-white group-hover:text-amber-500 transition-colors truncate">
                                                {t.subject}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-gray-600" />
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={12} className="text-gray-600" />
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t.source}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-6">
                                            <span className={`text-[9px] px-4 py-2 rounded-xl font-bold uppercase tracking-[0.2em] border ${STATUS_COLORS[t.status] || STATUS_COLORS.open}`}>
                                                {t.status}
                                            </span>
                                            <ArrowRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Insights Panel */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 sticky top-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <Activity size={18} />
                                </div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Customer Insights</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Client Since</p>
                                            <p className="text-sm font-bold text-white">{new Date(customer.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <Ticket size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total Lifecycle</p>
                                            <p className="text-sm font-bold text-white">{customer.tickets?.length || 0} Tickets</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500/50" />
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">CRM Synchronization</h4>
                                </div>
                                
                                <div className="p-5 bg-[#0a0a0a] rounded-2xl border border-white/5 space-y-3">
                                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">GHL Record Identity</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <code className="text-[11px] text-blue-400 font-mono break-all leading-tight">
                                            {customer.external_ids?.ghl_opportunity_id || 'NOT_SYNCED'}
                                        </code>
                                        {customer.external_ids?.ghl_opportunity_id && (
                                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-[10px] text-gray-600 leading-relaxed italic px-2">
                                    This profile is synced with the external CRM pipeline. Updates to priority or tags will be transmitted on the next sync cycle.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper to make it compatible with old icons in the code if needed
function CheckCircle2({ size, className }) {
    return <ShieldCheck size={size} className={className} />;
}
