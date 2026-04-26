import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const STATUS_COLORS = {
    open: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    pending: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
    waiting: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    resolved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    closed: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
};

const PRIORITY_DOTS = {
    low: 'bg-slate-400', medium: 'bg-blue-400', high: 'bg-orange-400', urgent: 'bg-red-500 animate-pulse',
};

const SOURCE_ICONS = { email: '📧', ghl: '🔗', sms: '📱', manual: '✏️' };

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
        
        if (hoursOpen >= (slaSettings.sla_level3_hours || 3)) {
            return { color: slaSettings.sla_level3_color || '#ef4444', label: 'Critical' };
        }
        if (hoursOpen >= (slaSettings.sla_level2_hours || 2)) {
            return { color: slaSettings.sla_level2_color || '#f59e0b', label: 'Overdue' };
        }
        if (hoursOpen >= (slaSettings.sla_level1_hours || 1)) {
            return { color: slaSettings.sla_level1_color || '#10b981', label: 'Warning' };
        }
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
        <AuthenticatedLayout header="Tickets">
            <Head title="Tickets" />

            <div className="flex flex-col gap-4 mb-6">
                {/* Tabs / Inbox Folders */}
                <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800/50 mb-2 overflow-x-auto no-scrollbar scroll-smooth">
                    <button 
                        onClick={() => applyFilter('category', '')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${!filters.category ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                        📥 All Inbox
                    </button>
                    <button 
                        onClick={() => applyFilter('category', 'important')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${filters.category === 'important' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                        ⭐ Important
                    </button>
                    <button 
                        onClick={() => applyFilter('category', 'normal')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${filters.category === 'normal' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                        📬 Primary
                    </button>
                    <button 
                        onClick={() => applyFilter('category', 'casual')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${filters.category === 'casual' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                        ☕ Casual
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search tickets, customers, subjects..."
                            defaultValue={filters.search || ''}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm transition-all"
                        />
                    </div>
                    <button onClick={() => setShowCreate(!showCreate)} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap">
                        + New Ticket
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <select value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-amber-500/20 shadow-sm min-w-[120px]">
                        <option value="">All Status</option>
                        {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filters.priority || ''} onChange={(e) => applyFilter('priority', e.target.value)} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-amber-500/20 shadow-sm min-w-[120px]">
                        <option value="">All Priority</option>
                        <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                    </select>
                    <select value={filters.customer_id || ''} onChange={(e) => applyFilter('customer_id', e.target.value)} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-amber-500/20 shadow-sm min-w-[150px]">
                        <option value="">All Customers</option>
                        {customers?.map(c => <option key={c.id} value={c.id}>{c.name || c.email}</option>)}
                    </select>
                    <select value={filters.date_range || ''} onChange={(e) => applyFilter('date_range', e.target.value)} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-amber-500/20 shadow-sm min-w-[140px]">
                        <option value="">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last_week">Last Week</option>
                        <option value="previous_month">Previous Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400 ml-2">{selectedIds.length} tickets selected</span>
                    <div className="h-4 w-px bg-amber-500/20 mx-2" />
                    <button onClick={() => runBulkAction('mark_read')} className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:opacity-70">Mark as Read</button>
                    <button onClick={() => runBulkAction('mark_unread')} className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:opacity-70">Mark as Unread</button>
                    <button onClick={() => runBulkAction('delete')} className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:opacity-70">Delete</button>
                </div>
            )}

            {showCreate && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 mb-6 shadow-sm dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-slate-900 dark:text-white font-bold mb-4">Create New Ticket</h3>
                    <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Email *</label>
                            <input value={form.data.customer_email} onChange={e => form.setData('customer_email', e.target.value)} required type="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                            <input value={form.data.customer_name} onChange={e => form.setData('customer_name', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject *</label>
                            <input value={form.data.subject} onChange={e => form.setData('subject', e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message Body *</label>
                            <textarea value={form.data.body} onChange={e => form.setData('body', e.target.value)} required rows={3} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white resize-none" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                            <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 text-slate-500 font-bold text-sm">Cancel</button>
                            <button type="submit" disabled={form.processing} className="px-10 py-2.5 bg-slate-900 dark:bg-amber-500 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 shadow-lg shadow-amber-500/10">
                                {form.processing ? 'Creating...' : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/30 bg-slate-50/50 dark:bg-transparent flex items-center gap-4">
                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === tickets.data.length && tickets.data.length > 0} className="rounded dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select All Tickets</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {tickets.data?.length === 0 && (
                        <div className="px-6 py-20 text-center text-slate-500">No tickets found in this view.</div>
                    )}
                    {tickets.data?.map((ticket) => {
                        const sla = getSLAStyle(ticket);
                        return (
                            <div key={ticket.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group ${!ticket.is_read ? 'bg-amber-500/[0.02]' : ''}`}>
                                <input type="checkbox" checked={selectedIds.includes(ticket.id)} onChange={() => toggleSelect(ticket.id)} className="rounded dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500" />
                                
                                <div className="flex-1 min-w-0 flex items-center gap-4">
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full mb-1 ${PRIORITY_DOTS[ticket.priority]}`} />
                                        {sla && (
                                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sla.color }} />
                                        )}
                                    </div>

                                    <Link href={route('tickets.show', ticket.id)} className="flex-1 min-w-0 flex items-center gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono font-bold tracking-tight">#{ticket.id}</span>
                                                <span className="text-sm">{SOURCE_ICONS[ticket.source]}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${STATUS_COLORS[ticket.status]}`}>
                                                    {ticket.status}
                                                </span>
                                                {!ticket.is_read && <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />}
                                            </div>
                                            <p className={`text-sm truncate transition-colors group-hover:text-amber-500 ${!ticket.is_read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {ticket.subject}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{ticket.customer?.name || ticket.customer?.email}</p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0 hidden sm:flex flex-col items-end gap-1 group-hover:hidden transition-all">
                                            {sla ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tight" 
                                                    style={{ color: sla.color, borderColor: `${sla.color}40`, backgroundColor: `${sla.color}10` }}>
                                                    <span className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: sla.color }} />
                                                    {getTimeOpenLabel(ticket.created_at)}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">{getTimeOpenLabel(ticket.created_at)}</span>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ticket.assigned_agent?.name?.split(' ')[0] || 'Unassigned'}</span>
                                            </div>
                                        </div>

                                        {/* Hover Quick Actions */}
                                        <div className="hidden group-hover:flex items-center gap-2 transition-all">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); router.post(route('tickets.toggle-read', ticket.id), {}, { preserveScroll: true }); }}
                                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                                                title={ticket.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                            >
                                                {ticket.is_read ? '✉️' : '📩'}
                                            </button>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); if(confirm('Delete ticket?')) router.delete(route('tickets.destroy', ticket.id), { preserveScroll: true }); }}
                                                className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete Ticket"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {tickets.links && tickets.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800/30 flex justify-center gap-1 bg-slate-50/30 dark:bg-transparent">
                        {tickets.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${link.active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : link.url ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800' : 'text-slate-400 dark:text-slate-700 cursor-not-allowed'}`} />
                  