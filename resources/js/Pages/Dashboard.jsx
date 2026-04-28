import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Ticket, 
    MailOpen, 
    AlertTriangle, 
    Inbox, 
    CheckCircle2, 
    Users, 
    TrendingUp, 
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#d97706', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

const StatCard = ({ label, value, color, icon: Icon, trend }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all group"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={20} className={color.replace('bg-', 'text-').replace('/10', '')} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{label}</p>
        </div>
    </motion.div>
);

const STATUS_COLORS = {
    open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    waiting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
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

            {/* Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">System Overview</h2>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-[10px]">Real-time ticket and performance metrics</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-2.5 shadow-sm">
                    <Filter size={14} className="text-gray-400" />
                    <select 
                        value={filters.date_range} 
                        onChange={(e) => handleDateFilter(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer uppercase tracking-wider"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                <StatCard label="Total Tickets" value={stats.totalTickets} color="bg-gray-500/10" icon={Ticket} />
                <StatCard label="Unread" value={stats.unreadCount} color="bg-amber-500/10" icon={MailOpen} trend="12%" />
                <StatCard label="Overdue" value={stats.delayedCount} color="bg-red-500/10" icon={AlertTriangle} />
                <StatCard label="Active" value={stats.openTickets} color="bg-blue-500/10" icon={Inbox} />
                <StatCard label="Resolved" value={stats.resolvedTickets} color="bg-emerald-500/10" icon={CheckCircle2} />
                <StatCard label="Customers" value={stats.totalCustomers} color="bg-violet-500/10" icon={Users} />
            </div>

            {/* Ticket Distribution */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Channel Distribution */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Ticket Sources</h3>
                        <div className="w-8 h-8 rounded-full bg-amber-500/5 flex items-center justify-center text-amber-500">
                            <TrendingUp size={14} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-around gap-8">
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
                                            <motion.circle
                                                key={entry.name}
                                                initial={{ strokeDasharray: "0 100" }}
                                                animate={{ strokeDasharray: dash }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                cx="50" cy="50" r="40"
                                                fill="transparent"
                                                stroke={COLORS[i % COLORS.length]}
                                                strokeWidth="8"
                                                strokeDashoffset={-currentOffset}
                                                className="transition-all"
                                            />
                                        );
                                    });
                                })()}
                                <circle cx="50" cy="50" r="32" className="fill-gray-50 dark:fill-[#0a0a0a]" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{charts.sourceDistribution.reduce((sum, d) => sum + d.value, 0)}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-full max-w-[200px]">
                            {charts.sourceDistribution.map((entry, i) => (
                                <div key={entry.name} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{entry.name}</span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white ml-auto">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Status Efficiency */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm"
                >
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8">Ticket Status</h3>
                    <div className="space-y-6">
                        {charts.statusDistribution.map((entry, i) => {
                            const total = Math.max(...charts.statusDistribution.map(d => d.value)) || 1;
                            const pct = (entry.value / total) * 100;
                            return (
                                <div key={entry.name}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{entry.name}</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{entry.value}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1.2, delay: 0.8 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Tickets */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-gray-900 dark:text-white font-bold tracking-tight">Recent Tickets</h2>
                        <Link href={route('tickets.index')} className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-amber-400 transition-all flex items-center gap-2 group">
                            View All
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {recentTickets?.length === 0 && (
                            <div className="px-8 py-20 text-center text-gray-500 text-sm italic">All caught up! No recent tickets.</div>
                        )}
                        {recentTickets?.map((ticket) => {
                            const sla = getSLAStyle(ticket);
                            return (
                                <Link key={ticket.id} href={route('tickets.show', ticket.id)} className="flex items-center gap-6 px-8 py-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-gray-400 text-[10px] font-mono tracking-tighter">#{ticket.id}</span>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${STATUS_COLORS[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                            {sla && (
                                                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ backgroundColor: sla.color }} />
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{ticket.subject}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{ticket.customer?.name}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 ml-auto mb-1">
                                            {ticket.assigned_agent?.name?.substring(0, 1) || '?'}
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Agent Efficiency */}
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-white/5 flex items-center gap-3">
                        <TrendingUp size={16} className="text-amber-500" />
                        <h2 className="text-gray-900 dark:text-white font-bold tracking-tight">Agent Performance</h2>
                    </div>
                    <div className="p-8 space-y-8">
                        {(!agentStats || agentStats.length === 0) && (
                            <p className="text-gray-500 text-sm text-center py-12 italic">No agent data available.</p>
                        )}
                        {agentStats?.map((agent) => {
                            const pct = agent.total > 0 ? Math.round((agent.resolved / agent.total) * 100) : 0;
                            return (
                                <div key={agent.assigned_to} className="group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-[10px] font-bold border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                {agent.assigned_agent?.name?.substring(0, 1)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white tracking-tight">{agent.assigned_agent?.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{pct}% Score</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" 
                                        />
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

