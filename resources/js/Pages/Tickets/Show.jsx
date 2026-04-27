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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('tickets.index')} 
                            className="p-3 rounded-xl bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 transition-all group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-[0.2em]">Ticket #{ticket.id}</span>
                                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-800" />
                                <span className={`text-[8px] px-2 py-0.5 rounded-lg border font-bold uppercase tracking-widest ${STATUS_COLORS[ticket.status]}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">{ticket.subject}</h2>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Message Stream */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Conversation History */}
                        <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-gray-200 dark:before:bg-white/5">
                            {ticket.messages?.map((msg, index) => {
                                const isAgent = msg.sender_type?.includes('User');
                                const isNote = msg.type === 'note';
                                
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        key={msg.id} 
                                        className="relative pl-12 group"
                                    >
                                        <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl border flex items-center justify-center shadow-lg transition-all z-10 ${
                                            isNote 
                                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 group-hover:scale-105' 
                                                : isAgent 
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-white/20 group-hover:scale-105' 
                                                    : 'bg-gray-100 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-500 group-hover:scale-105'
                                        }`}>
                                            {isNote ? <Lock size={16} /> : isAgent ? <Shield size={16} /> : <User size={16} />}
                                        </div>

                                        <div className={`rounded-[1.5rem] overflow-hidden border transition-all ${
                                            isNote 
                                                ? 'bg-amber-500/[0.02] border-amber-500/10' 
                                                : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/20'
                                        }`}>
                                            <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${isNote ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                                                        {isNote ? 'Note' : (isAgent ? msg.sender?.name : ticket.customer?.name || 'Customer')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={10} className="text-gray-500" />
                                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="px-8 py-5">
                                                <div className={`text-sm leading-relaxed ${isNote ? 'text-amber-600 dark:text-amber-200/80 italic' : 'text-gray-700 dark:text-gray-300'}`} 
                                                    dangerouslySetInnerHTML={{ __html: msg.body }} 
                                                />
                                                {msg.attachments?.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                                        {msg.attachments.map(att => (
                                                            <a key={att.id} href={`/storage/${att.file_path}`} target="_blank" className="text-[8px] font-bold uppercase tracking-widest bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl text-gray-500 hover:text-amber-500 transition-all flex items-center gap-2">
                                                                <Paperclip size={12} />
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group"
                        >
                            <form onSubmit={handleReply} className="relative z-10">
                                <div className="flex gap-4 mb-6">
                                    {[
                                        { type: 'message', label: 'Reply', icon: MessageSquare },
                                        { type: 'note', label: 'Note', icon: Lock },
                                    ].map(t => (
                                        <button 
                                            key={t.type} 
                                            type="button" 
                                            onClick={() => replyForm.setData('type', t.type)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] transition-all ${
                                                replyForm.data.type === t.type 
                                                    ? (t.type === 'note' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white text-black shadow-lg') 
                                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <t.icon size={14} />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="relative">
                                    <textarea 
                                        value={replyForm.data.body} 
                                        onChange={e => replyForm.setData('body', e.target.value)}
                                        placeholder={replyForm.data.type === 'note' ? 'Internal note...' : 'Type message...'} 
                                        rows={4} 
                                        required
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-6 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none shadow-inner" 
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center gap-3 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                        <Shield size={10} /> Secure Reply
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={replyForm.processing}
                                        className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {replyForm.processing ? 'Sending...' : 'Send Reply'}
                                        <Send size={14} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Status Control */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
                        >
                            <h3 className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-amber-500" /> Status
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(STATUS_COLORS).map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => handleStatus(s)}
                                        className={`text-[8px] px-3 py-2 rounded-xl font-bold uppercase tracking-widest border transition-all ${
                                            ticket.status === s 
                                                ? STATUS_COLORS[s] 
                                                : 'text-gray-500 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Assignment */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
                        >
                            <h3 className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <UserPlus size={14} className="text-blue-400" /> Assignment
                            </h3>
                            <select 
                                value={ticket.assigned_to || ''} 
                                onChange={e => handleAssign(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest focus:ring-0 cursor-pointer"
                            >
                                <option value="" className="bg-[#0a0a0a]">Unassigned</option>
                                {agents?.map(a => <option key={a.id} value={a.id} className="bg-[#0a0a0a]">{a.name}</option>)}
                            </select>
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                        >
                            <h3 className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Eye size={14} className="text-emerald-400" /> Customer
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{ticket.customer?.name || 'Anonymous'}</p>
                                    <p className="text-[10px] text-gray-500 truncate mt-1">{ticket.customer?.email}</p>
                                </div>
                                {ticket.customer?.phone && (
                                    <p className="text-[10px] text-gray-500">{ticket.customer.phone}</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Ticket Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
                        >
                            <h3 className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Command size={14} className="text-purple-400" /> Metadata
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span className="text-gray-500 uppercase">Priority</span>
                                    <span className="text-gray-900 dark:text-white uppercase">{ticket.priority}</span>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span className="text-gray-500 uppercase">Source</span>
                                    <span className="text-gray-900 dark:text-white uppercase">{ticket.source}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


