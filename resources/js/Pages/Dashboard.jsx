import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
// Temporary test转换

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

const StatCard = ({ label, value, color, icon, trend }) => (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all group shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xl opacity-80">{icon}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${color}`}>{label}</span>
        </div>
        <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
            {trend && <span className="text-[10px] text-emerald-500 font-bold mb-1">↑ {trend}</span>}
        </div>
    </div>
);

const STATUS_COLORS = {
    open: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pending: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    waiting: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    resolved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    closed: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export default function Dashboard({ stats, charts, recentTickets, agentStats, slaSettings, filters }) {
    
    const handleDateFilter = (range) => {
        router.get(route('dashboard'), { date_range: range }, { preserveState: true, replace: true });
    };

    const getSLAStyle = (ticket) => {
        if (!slaSettings?.sla_enabled || !['open', 'pending', 'waiting'].includes(ticket.status)) return null;
        const hoursOpen = (new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60);
        if (hoursOpen >= (slaSettings.sla_level3_hours || 3)) return { color: slaSettings.sla_level3_color || '#ef4444' };
        if (hoursOpen >= (slaSettings.sla_level2_hours || 2)) return { color: slaSettings.sla_level2_color || '#f59e0b' };
        if (hoursOpen >= (slaSettings.sla_level1_hours || 1)) return { color: slaSettings.sla_level1_color || '#10b981' };
        return null;
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Top Bar with Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Operations Overview</h2>
                    <p className="text-sm text-slate-500">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-1.5 shadow-sm">
                    <span className="text-slate-400 text-xs">🔍</span>
                    <select 
                        value={filters.date_range} 
                        onChange={(e) => handleDateFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer"
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                <StatCard label="Total" value={stats.totalTickets} color="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300" icon="🎫" />
                <StatCard label="Unread" value={stats.unreadCount} color="bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" icon="📩" />
                <StatCard label="Delayed" value={stats.delayedCount} color="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" icon="⚠️" />
                <StatCard label="Open" value={stats.openTickets} color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" icon="📬" />
                <StatCard label="Resolved" value={stats.resolvedTickets} color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" icon="✅" />
                <StatCard label="Customers" value={stats.totalCustomers} color="bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" icon="👥" />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Source Distribution (Donut Chart) */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Service Distribution</h3>
                    <div className="flex items-center justify-around h-64">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                {(() => {
                                    let offset = 0;
                                    const total = charts.sourceDistribution.reduce((sum, d) => sum + d.value, 0) || 1;
                                    return charts.sourceDistribution.map((entry, i) => {
                                        const percent = (entry.value / total) * 100;
                                        const dash = `${percent} ${100 - percent}`;
                                        const currentOffset = offset;
                                        offset += percent;
                                        return (
                                            <circle
                                                key={entry.name}
                                                cx="50" cy="50" r="40"
                                                fill="transparent"
                                                stroke={COLORS[i % COLORS.length]}
                                                strokeWidth="12"
                                                strokeDasharray={dash}
                                                strokeDashoffset={-currentOffset}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        );
                                    });
                                })()}
                                <circle cx="50" cy="50" r="30" className="fill-white dark:fill-slate-900" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{charts.sourceDistribution.reduce((sum, d) => sum + d.value, 0)}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Tickets</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {charts.sourceDistribution.map((entry, i) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{entry.name}</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white ml-auto">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Breakdown (Horizontal Bar Chart) */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Status Breakdown</h3>
                    <div className="space-y-6 h-64 flex flex-col justify-center">
                        {charts.statusDistribution.map((entry, i) => {
                            const total = Math.max(...charts.statusDistribution.map(d => d.value)) || 1;
                            const pct = (entry.value / total) * 100;
                            return (
                                <div key={entry.name}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{entry.name}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{entry.value}</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
                        <h2 className="text-slate-900 dark:text-white font-bold">Recent Activity</h2>
                        <Link href={route('tickets.index')} className="text-amber-600 dark:text-amber-400 text-sm font-bold hover:opacity-80 transition-all">View all →</Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
                        {recentTickets?.length === 0 && (
                            <div className="px-6 py-16 text-center text-slate-500">No activity yet.</div>
                        )}
                        {recentTickets?.map((ticket) => {
                            const sla = getSLAStyle(ticket);
                            return (
                                <Link key={ticket.id} href={route('tickets.show', ticket.id)} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono font-bold">#{ticket.id}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${STATUS_COLORS[ticket.status] || ''}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                                {ticket.source === 'sms' ? '📱 SMS' : ticket.source === 'ghl' ? '🔗 GHL' : ticket.source === 'email' ? '📧 Email' : '👤 Manual'}
                                            </span>
                                            {sla && (
                                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sla.color }} />
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{ticket.subject}</p>
                                        <p className="text-xs text-slate-500 mt-1">{ticket.customer?.name || ticket.customer?.email}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{ticket.assigned_agent?.name?.split(' ')[0] || 'Unassigned'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                            {ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-transparent">
                        <h2 className="text-slate-900 dark:text-white font-bold">Agent Performance</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {(!agentStats || agentStats.length === 0) && (
                            <p className="text-slate-500 text-sm text-center py-8">No performance metrics yet.</p>
                        )}
                        {agentStats?.map((agent) => {
                            const pct = agent.total > 0 ? Math.round((agent.resolved / agent.total) * 100) : 0;
                            return (
                                <div key={agent.assigned_to}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                                                {agent.assigned_agent?.name?.substring(0, 1)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{agent.assigned_agent?.name || 'Unknown'}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{agent.resolved}/{agent.total} solved</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
