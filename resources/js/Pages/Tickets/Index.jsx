import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    Inbox, 
    Star, 
    LayoutGrid, 
    Coffee, 
    Mail, 
    Link2, 
    Smartphone, 
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    Filter,
    ChevronRight,
    User,
    Clock,
    AlertCircle,
    Command,
    Shield,
    Activity,
    ArrowRight,
    CheckCircle2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
    open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    waiting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const PRIORITY_DOTS = {
    low: 'bg-gray-400', 
    medium: 'bg-blue-400', 
    high: 'bg-orange-400', 
    urgent: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse',
};

const SOURCE_ICONS = { 
    email: Mail, 
    ghl: Link2, 
    sms: Smartphone, 
    manual: Edit3 
};

export default function TicketIndex({ tickets, agents, customers, filters, slaSettings }) {
    const [showCreate, setShowCreate] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const form = useForm({ customer_email: '', customer_name: '', subject: '', body: '', priority: 'medium' });

    const applyFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value || undefined };
        if (key === 'date_range' && value !== 'custom') {
            delete newFilters.start_date;
            delete newFilters.end_date;
        }
        router.get(route('tickets.index'), newFilters, { preserveState: true, replace: true });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        form.post(route('tickets.store'), { onSuccess: () => { setShowCreate(false); form.reset(); } });
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(tickets.data.map(t => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const runBulkAction = (action) => {
        if (selectedIds.length === 0) return;
        if (action === 'delete' && !confirm('Are you sure you want to delete selected tickets?')) return;
        
        router.post(route('tickets.bulk'), {
            ids: selectedIds,
            action: action
        }, {
            onSuccess: () => setSelectedIds([]),
            preserveScroll: true
        });
    };

    const getSLAStyle = (ticket) => {
        if (!slaSettings?.sla_enabled || !['open', 'pending', 'waiting'].includes(ticket.status)) return null;
        const hoursOpen = (new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60);
        if (hoursOpen >= (slaSettings.sla_level3_hours || 3)) return { color: slaSettings.sla_level3_color || '#ef4444', label: 'Critical' };
        if (hoursOpen >= (slaSettings.sla_level2_hours || 2)) return { color: slaSettings.sla_level2_color || '#f59e0b', label: 'Overdue' };
        if (hoursOpen >= (slaSettings.sla_level1_hours || 1)) return { color: slaSettings.sla_level1_color || '#10b981', label: 'Warning' };
        return null;
    };

    const getTimeOpenLabel = (date) => {
        const mins = Math.floor((new Date() - new Date(date)) / (1000 * 60));
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h`;
        return `${Math.floor(hrs / 24)}d`;
    };

    return (
        <AuthenticatedLayout header="Support Tickets Inbox">
            <Head title="Tickets" />

            <div className="max-w-[1600px] mx-auto pb-20">
                <div className="flex flex-col gap-10 mb-12">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">All Tickets</h2>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                <Inbox size={12} /> Manage your support requests
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setCreating(true)} 
                                className="px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/10 dark:shadow-white/10 flex items-center gap-2 group"
                            >
                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
                                Add Ticket
                            </button>
                        </div>
                    </div>

                    {/* Navigation & Search & PerPage */}
                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-1 flex items-center gap-1 bg-gray-100 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-1 overflow-x-auto no-scrollbar">
                            {[
                                { id: '', label: 'All', icon: Inbox },
                                { id: 'important', label: 'Important', icon: Star },
                                { id: 'normal', label: 'Primary', icon: LayoutGrid },
                                { id: 'casual', label: 'Secondary', icon: Coffee },
                            ].map((tab) => (
                                <button 
                                    key={tab.id}
                                    onClick={() => applyFilter('category', tab.id)}
                                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap group ${
                                        (filters.category || '') === tab.id 
                                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <tab.icon size={12} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    defaultValue={filters.search || ''}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                                />
                            </div>

                            <div className="flex items-center gap-3 px-5 py-3 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl">
                                <Activity size={14} className="text-gray-500" />
                                <select 
                                    value={filters.per_page || '20'} 
                                    onChange={(e) => applyFilter('per_page', e.target.value)} 
                                    className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer p-0"
                                >
                                    {[10, 20, 50, 100].map(v => <option key={v} value={v} className="bg-[#0a0a0a]">{v} / page</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex gap-4 flex-wrap items-center">
                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                            <Filter size={14} className="text-amber-500" />
                            <select value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer min-w-[120px] p-0">
                                <option value="" className="bg-[#0a0a0a]">Status: All</option>
                                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-[#0a0a0a] uppercase">{s}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                            <Shield size={14} className="text-blue-400" />
                            <select value={filters.priority || ''} onChange={(e) => applyFilter('priority', e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer min-w-[120px] p-0">
                                <option value="" className="bg-[#0a0a0a]">Priority: All</option>
                                <option value="low" className="bg-[#0a0a0a]">Low</option>
                                <option value="medium" className="bg-[#0a0a0a]">Medium</option>
                                <option value="high" className="bg-[#0a0a0a]">High</option>
                                <option value="urgent" className="bg-[#0a0a0a]">Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                            <User size={14} className="text-emerald-400" />
                            <select value={filters.customer_id || ''} onChange={(e) => applyFilter('customer_id', e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer min-w-[140px] p-0">
                                <option value="" className="bg-[#0a0a0a]">Customer: All</option>
                                {customers?.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name || c.email}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl ml-auto">
                            <Clock size={14} className="text-gray-500" />
                            <select value={filters.date_range || ''} onChange={(e) => applyFilter('date_range', e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer min-w-[130px] p-0">
                                <option value="" className="bg-[#0a0a0a]">Date Range: All</option>
                                <option value="today" className="bg-[#0a0a0a]">Today</option>
                                <option value="yesterday" className="bg-[#0a0a0a]">Yesterday</option>
                                <option value="last_week" className="bg-[#0a0a0a]">Past Week</option>
                                <option value="previous_month" className="bg-[#0a0a0a]">Past Month</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-10 py-6 bg-white dark:bg-white/[0.08] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-full shadow-2xl"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700 dark:text-white/70 whitespace-nowrap">
                                <span className="text-amber-500">{selectedIds.length}</span> Tickets Selected
                            </span>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex gap-8">
                                <button onClick={() => runBulkAction('mark_read')} className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Mark as Read
                                </button>
                                <button onClick={() => runBulkAction('delete')} className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500 hover:text-red-400 transition-all flex items-center gap-2">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <button onClick={() => setSelectedIds([])} className="p-2 text-gray-500 hover:text-white transition-all">
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Create Ticket Drawer */}
                <AnimatePresence>
                    {showCreate && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="bg-gray-50 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-gray-900 dark:text-white pointer-events-none">
                                    <Plus size={200} />
                                </div>
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Create New Ticket</h3>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Fill in the details below to create a new ticket</p>
                                    </div>
                                    <button onClick={() => setShowCreate(false)} className="p-4 rounded-full bg-white/5 text-gray-400 hover:text-white transition-all"><X size={24} /></button>
                                </div>
                                <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-10 relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Customer Email *</label>
                                        <input value={form.data.customer_email} onChange={e => form.setData('customer_email', e.target.value)} required type="email" placeholder="customer@email.com" className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Customer Name</label>
                                        <input value={form.data.customer_name} onChange={e => form.setData('customer_name', e.target.value)} placeholder="Full Name" className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 shadow-inner" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Ticket Subject *</label>
                                        <input value={form.data.subject} onChange={e => form.setData('subject', e.target.value)} required placeholder="Brief summary of the issue" className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 shadow-inner" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Message Content *</label>
                                        <textarea value={form.data.body} onChange={e => form.setData('body', e.target.value)} required rows={5} placeholder="Provide detailed information..." className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-[2rem] px-8 py-6 text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-amber-500/20 shadow-inner" />
                                    </div>
                                    <div className="sm:col-span-2 flex gap-6 justify-end pt-6">
                                        <button type="button" onClick={() => setShowCreate(false)} className="px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">Cancel</button>
                                        <button type="submit" disabled={form.processing} className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl shadow-amber-600/20 flex items-center gap-3">
                                            {form.processing ? 'Saving...' : (
                                                <>
                                                    Create Ticket <ArrowRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tickets Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-sm"
                >
                    <div className="px-8 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <input 
                                type="checkbox" 
                                onChange={toggleSelectAll} 
                                checked={selectedIds.length === tickets.data.length && tickets.data.length > 0} 
                                className="rounded-lg bg-gray-100 dark:bg-black border-gray-300 dark:border-white/10 text-amber-500 focus:ring-amber-500/20 w-5 h-5 transition-all" 
                            />
                            <div>
                                <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em]">Current Tickets</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-1.5">
                                {agents?.slice(0, 4).map((a, i) => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[7px] font-bold text-gray-700 dark:text-white" title={a.name}>
                                        {a.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                        {tickets.data?.length === 0 && (
                            <div className="px-12 py-40 text-center relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <Inbox size={300} />
                                </div>
                                <p className="text-sm font-serif italic text-gray-500 relative z-10">No tickets found in this view.</p>
                            </div>
                        )}
                        {tickets.data?.map((ticket, index) => {
                            const sla = getSLAStyle(ticket);
                            const SourceIcon = SOURCE_ICONS[ticket.source] || Edit3;
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    key={ticket.id} 
                                    className={`flex items-center gap-6 px-8 py-4 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all group relative overflow-hidden ${
                                        selectedIds.includes(ticket.id) 
                                            ? 'bg-amber-500/10 dark:bg-amber-500/[0.05]' 
                                            : !ticket.is_read 
                                                ? 'bg-amber-500/[0.02]' 
                                                : ''
                                    }`}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(ticket.id)} 
                                        onChange={() => toggleSelect(ticket.id)} 
                                        className="rounded-lg bg-gray-100 dark:bg-black border-gray-300 dark:border-white/10 text-amber-500 focus:ring-amber-500/20 w-5 h-5 transition-all relative z-10" 
                                    />
                                    
                                    <Link href={route('tickets.show', ticket.id)} className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex-1 min-w-0 flex items-center gap-6">
                                            <div className="shrink-0 flex flex-col items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${PRIORITY_DOTS[ticket.priority]} shadow-lg`} />
                                                {sla && (
                                                    <div 
                                                        className="w-2 h-2 rounded-full" 
                                                        style={{ backgroundColor: sla.color, boxShadow: `0 0 8px ${sla.color}60` }} 
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-gray-500 text-[9px] font-mono tracking-tighter">#{ticket.id}</span>
                                                    <SourceIcon size={10} className="text-gray-500" />
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${STATUS_COLORS[ticket.status]}`}>
                                                        {ticket.status}
                                                    </span>
                                                    {!ticket.is_read && (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                                                            <span className="text-[7px] font-bold text-amber-500 uppercase tracking-widest">New</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className={`text-sm font-semibold tracking-tight transition-colors group-hover:text-amber-500 truncate ${!ticket.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                    {ticket.subject}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate max-w-[200px]">{ticket.customer?.name || ticket.customer?.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-8 min-w-[200px]">
                                            <div className="text-right flex flex-col items-end gap-1">
                                                {sla ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-bold uppercase tracking-widest transition-all" 
                                                        style={{ color: sla.color, borderColor: `${sla.color}40`, backgroundColor: `${sla.color}10` }}>
                                                        <Clock size={8} />
                                                        {getTimeOpenLabel(ticket.created_at)}
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">{getTimeOpenLabel(ticket.created_at)}</span>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <User size={9} className="text-gray-500" />
                                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{ticket.assigned_agent?.name?.split(' ')[0] || 'Unassigned'}</span>
                                                </div>
                                            </div>

                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>

                                    {/* Actions Overlay */}
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-5 group-hover:translate-x-0 hidden xl:flex items-center gap-2">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); router.post(route('tickets.toggle-read', ticket.id), {}, { preserveScroll: true }); }}
                                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-amber-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/5"
                                        >
                                            {ticket.is_read ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); if(confirm('Are you sure?')) router.delete(route('tickets.destroy', ticket.id), { preserveScroll: true }); }}
                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {tickets.links && tickets.links.length > 3 && (
                        <div className="px-12 py-10 border-t border-white/5 flex justify-center gap-3 bg-white/[0.01]">
                            {tickets.links.map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.url || '#'} 
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                                        link.active 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                                            : link.url 
                                                ? 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 border border-transparent' 
                                                : 'text-gray-300 dark:text-gray-800 cursor-not-allowed'
                                    }`} 
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}



