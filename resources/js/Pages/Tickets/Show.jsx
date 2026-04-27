import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    MessageSquare, 
    StickyNote, 
    Send, 
    User, 
    Clock, 
    Paperclip, 
    CheckCircle2, 
    UserPlus, 
    Mail, 
    Phone, 
    ChevronLeft,
    AlertCircle,
    Calendar,
    Shield,
    Zap,
    ArrowLeft,
    Command,
    Activity,
    Lock,
    Eye,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    waiting: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function TicketShow({ ticket, agents }) {
    const replyForm = useForm({ body: '', type: 'message' });

    const handleReply = (e) => {
        e.preventDefault();
        replyForm.post(route('tickets.reply', ticket.id), { onSuccess: () => replyForm.reset('body'), preserveScroll: true });
    };

    const handleStatus = (status) => {
        router.patch(route('tickets.status', ticket.id), { status }, { preserveScroll: true });
    };

    const handleAssign = (agentId) => {
        router.patch(route('tickets.assign', ticket.id), { assigned_to: agentId || null }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Ticket Details">
            <Head title={`Ticket #${ticket.id}`} />
            
            <div className="max-w-[1600px] mx-auto pb-20">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
                >
                    <div className="flex items-center gap-6">
                        <Link 
                            href={route('tickets.index')} 
                            className="p-4 rounded-2xl bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-[0.3em]">Ticket #{ticket.id}</span>
                                <div className="w-1 h-1 rounded-full bg-gray-800" />
                                <span className={`text-[9px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest ${STATUS_COLORS[ticket.status]}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">{ticket.subject}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Created At</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Message Stream */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Conversation History */}
                        <div className="space-y-8 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-px before:bg-gray-200 dark:before:bg-white/5">
                            {ticket.messages?.map((msg, index) => {
                                const isAgent = msg.sender_type?.includes('User');
                                const isNote = msg.type === 'note';
                                
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={msg.id} 
                                        className="relative pl-16 group"
                                    >
                                        <div className={`absolute left-0 top-1 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xl transition-all duration-500 z-10 ${
                                            isNote 
                                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 group-hover:scale-110' 
                                                : isAgent 
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-white/20 group-hover:scale-110' 
                                                    : 'bg-gray-100 dark:bg-white/[0.03] backdrop-blur-md border-gray-200 dark:border-white/10 text-gray-500 group-hover:scale-110'
                                        }`}>
                                            {isNote ? <Lock size={20} /> : isAgent ? <Shield size={20} /> : <User size={20} />}
                                        </div>

                                        <div className={`rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${
                                            isNote 
                                                ? 'bg-amber-500/[0.02] border-amber-500/10' 
                                                : 'bg-white dark:bg-white/[0.03] backdrop-blur-md border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/20'
                                        }`}>
                                            <div className="px-10 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isNote ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                                                        {isNote ? 'Internal Note' : (isAgent ? `Agent: ${msg.sender?.name}` : `Customer: ${ticket.customer?.name || 'Sender'}`)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={12} className="text-gray-600" />
                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="px-12 py-10">
                                                <div className={`text-base leading-relaxed max-w-full overflow-x-auto ${isNote ? 'text-amber-600 dark:text-amber-200/80 italic font-serif' : 'text-gray-700 dark:text-gray-300'}`} 
                                                    dangerouslySetInnerHTML={{ __html: msg.body }} 
                                                />
                                                {msg.attachments?.length > 0 && (
                                                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                                                        {msg.attachments.map(att => (
                                                            <a key={att.id} href={`/storage/${att.file_path}`} target="_blank" className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-3 group/link shadow-sm">
                                                                <Paperclip size={14} className="group-hover/link:rotate-45 transition-transform" />
                                                                {att.file_name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Reply Interface */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[3rem] p-12 shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-amber-500 pointer-events-none group-hover:opacity-[0.05] transition-all duration-700">
                                <MessageSquare size={150} />
                            </div>

                            <form onSubmit={handleReply} className="relative z-10">
                                <div className="flex gap-6 mb-10">
                                    {[
                                        { type: 'message', label: 'Reply to Customer', icon: MessageSquare },
                                        { type: 'note', label: 'Internal Note', icon: Lock },
                                    ].map(t => (
                                        <button 
                                            key={t.type} 
                                            type="button" 
                                            onClick={() => replyForm.setData('type', t.type)}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                                                replyForm.data.type === t.type 
                                                    ? (t.type === 'note' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white text-black shadow-2xl shadow-white/10') 
                                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/5'
                                            }`}
                                        >
                                            <t.icon size={16} />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="relative">
                                    <textarea 
                                        value={replyForm.data.body} 
                                        onChange={e => replyForm.setData('body', e.target.value)}
                                        placeholder={replyForm.data.type === 'note' ? 'Write an internal note...' : 'Type your message here...'} 
                                        rows={6} 
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-[2.5rem] px-10 py-10 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all resize-none shadow-inner" 
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-10">
                                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                        <Shield size={12} /> Secure Connection
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={replyForm.processing}
                                        className="px-14 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-600/20 flex items-center gap-4 disabled:opacity-50"
                                    >
                                        {replyForm.processing ? 'Sending...' : (
                                            <>
                                                Send Message <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Status Control */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                        >
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <Activity size={16} className="text-amber-500" /> Ticket Status
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {Object.keys(STATUS_COLORS).map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => handleStatus(s)}
                                        className={`group relative overflow-hidden text-[10px] px-6 py-4 rounded-2xl font-bold uppercase tracking-widest border transition-all ${
                                            ticket.status === s 
                                                ? STATUS_COLORS[s] + ' shadow-xl shadow-current/5' 
                                                : 'text-gray-600 border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-black/20 hover:text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="relative z-10 flex items-center justify-between">
                                            {s}
                                            {ticket.status === s && <CheckCircle2 size={14} />}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Assignment */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                        >
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <UserPlus size={16} className="text-blue-400" /> Assign Agent
                            </h3>
                            <div className="relative group">
                                <select 
                                    value={ticket.assigned_to || ''} 
                                    onChange={e => handleAssign(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-5 text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-widest focus:ring-2 focus:ring-amber-500/20 cursor-pointer appearance-none transition-all"
                                >
                                    <option value="" className="bg-[#0a0a0a]">Unassigned</option>
                                    {agents?.map(a => <option key={a.id} value={a.id} className="bg-[#0a0a0a]">{a.name}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-amber-500 transition-colors">
                                    <ChevronLeft size={16} className="-rotate-90" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-gray-900 dark:text-white pointer-events-none">
                                <User size={100} />
                            </div>
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <Eye size={16} className="text-emerald-400" /> Customer Information
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="p-6 rounded-[2rem] bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                    <p className="text-lg font-serif font-bold text-gray-900 dark:text-white tracking-tight">{ticket.customer?.name || 'Anonymous'}</p>
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 group cursor-pointer hover:text-amber-500 transition-colors">
                                            <div className="p-2 rounded-lg bg-white/5"><Mail size={12} /></div>
                                            <span className="truncate">{ticket.customer?.email}</span>
                                        </div>
                                        {ticket.customer?.phone && (
                                            <div className="flex items-center gap-4 text-xs text-gray-500 hover:text-amber-500 transition-colors">
                                                <div className="p-2 rounded-lg bg-white/5"><Phone size={12} /></div>
                                                <span>{ticket.customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Ticket Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                        >
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <Command size={16} className="text-purple-400" /> Ticket Info
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Zap size={10} /> Priority
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">{ticket.priority}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Hash size={10} /> Ticket ID
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">#{ticket.id}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Activity size={10} /> Source
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">{ticket.source}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


