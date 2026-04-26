import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

const STATUS_COLORS = {
    open: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    pending: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
    waiting: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    resolved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    closed: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20',
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
        <AuthenticatedLayout header={`Ticket #${ticket.id}`}>
            <Head title={`Ticket #${ticket.id}`} />
            
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Simplified Header with Subject and Status */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{ticket.subject}</h2>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                <span>via {ticket.source}</span>
                                <span>•</span>
                                <span>Created {new Date(ticket.created_at).toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="shrink-0">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-4">
                        {ticket.messages?.map((msg) => (
                            <div key={msg.id} className={`rounded-xl overflow-hidden border ${msg.type === 'note' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none'}`}>
                                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/30 bg-slate-50/50 dark:bg-transparent flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            {msg.type === 'note' ? '📝 Internal Note' : (msg.sender_type?.includes('User') ? '🧑‍💼 Agent' : ticket.customer?.name || 'Customer')}
                                        </span>
                                        {msg.sender_type?.includes('Customer') && ticket.customer && (
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                &lt;{ticket.customer.email}&gt;
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                                <div className="p-5">
                                    <div className="prose-email text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: msg.body }} />
                                    {msg.attachments?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/30 flex flex-wrap gap-2">
                                            {msg.attachments.map(att => (
                                                <a key={att.id} href={`/storage/${att.file_path}`} target="_blank" className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-2">
                                                    📎 {att.file_name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Box */}
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                        <form onSubmit={handleReply}>
                            <div className="flex gap-2 mb-3">
                                {['message', 'note'].map(t => (
                                    <button key={t} type="button" onClick={() => replyForm.setData('type', t)}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${replyForm.data.type === t ? (t === 'note' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400') : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                        {t === 'note' ? '📝 Note' : '💬 Reply'}
                                    </button>
                                ))}
                            </div>
                            <textarea value={replyForm.data.body} onChange={e => replyForm.setData('body', e.target.value)}
                                placeholder={replyForm.data.type === 'note' ? 'Internal note...' : 'Your reply...'} rows={4} required
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-amber-500/30 resize-none" />
                            <div className="flex justify-end mt-3">
                                <button type="submit" disabled={replyForm.processing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 shadow-lg shadow-amber-500/20">
                                    {replyForm.processing ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Status</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(STATUS_COLORS).map(s => (
                                <button key={s} onClick={() => handleStatus(s)}
                                    className={`text-xs px-3 py-2 rounded-lg font-medium capitalize border transition-all ${ticket.status === s ? STATUS_COLORS[s] + ' ring-1 ring-current' : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Assign</h3>
                        <select value={ticket.assigned_to || ''} onChange={e => handleAssign(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-amber-500/30">
                            <option value="">Unassigned</option>
                            {agents?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Customer Info</h3>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{ticket.customer?.name || '—'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ticket.customer?.email}</p>
                        {ticket.customer?.phone && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">📞 {ticket.customer.phone}</p>}
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Ticket Details</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-slate-500">Priority</dt><dd className="text-slate-900 dark:text-white capitalize font-medium">{ticket.priority}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-500">Last Active</dt><dd className="text-slate-900 dark:text-white font-medium">{new Date(ticket.last_message_at).toLocaleDateString()}</dd></div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
