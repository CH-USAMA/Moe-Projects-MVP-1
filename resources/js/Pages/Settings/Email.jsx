import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Mail, 
    Server, 
    ShieldCheck, 
    Signature, 
    Power, 
    CheckCircle2, 
    Save, 
    Send, 
    Inbox,
    Lock,
    Globe,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Field = ({ label, children, icon: Icon }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 ml-1">
            {Icon && <Icon size={12} className="text-amber-500" />}
            {label}
        </label>
        {children}
    </div>
);

const Input = ({ ...props }) => (
    <input {...props} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-inner" />
);

export default function EmailSettings({ settings }) {
    const form = useForm({
        email_inbound_address: settings.email_inbound_address || '',
        email_forwarding_to: settings.email_forwarding_to || '',
        email_imap_host: settings.email_imap_host || '',
        email_imap_port: settings.email_imap_port || '993',
        email_imap_username: settings.email_imap_username || '',
        email_imap_password: '',
        email_imap_encryption: settings.email_imap_encryption || 'ssl',
        email_smtp_host: settings.email_smtp_host || '',
        email_smtp_port: settings.email_smtp_port || '587',
        email_smtp_username: settings.email_smtp_username || '',
        email_smtp_password: '',
        email_smtp_encryption: settings.email_smtp_encryption || 'tls',
        email_sender_name: settings.email_sender_name || '',
        email_sender_address: settings.email_sender_address || '',
        email_signature: settings.email_signature || '',
        email_enabled: settings.email_enabled ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('settings.email.update'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Email Settings">
            <Head title="Email Configuration" />
            
            <div className="max-w-5xl mx-auto pb-20">
                <div className="mb-10">
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Email Integration</h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Configure your email server and synchronization</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Activation Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${form.data.email_enabled ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                <Power size={24} />
                            </div>
                            <div>
                                <span className="text-lg font-serif font-bold text-white tracking-tight">Email Service</span>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Enable or disable automatic email processing</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={form.data.email_enabled} 
                                onChange={e => form.setData('email_enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                    </motion.div>

                    {/* General Configuration */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none">
                            <Globe size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <Inbox size={20} />
                            </div>
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Sender Details</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <Field label="Support Email Address" icon={Send}><Input value={form.data.email_inbound_address} onChange={e => form.setData('email_inbound_address', e.target.value)} placeholder="support@example.com" /></Field>
                            <Field label="Forwarding Address" icon={Globe}><Input value={form.data.email_forwarding_to} onChange={e => form.setData('email_forwarding_to', e.target.value)} placeholder="backup@example.com" /></Field>
                            <Field label="Sender Display Name" icon={Signature}><Input value={form.data.email_sender_name} onChange={e => form.setData('email_sender_name', e.target.value)} placeholder="Moe Limousine" /></Field>
                            <Field label="From Email Address" icon={Mail}><Input value={form.data.email_sender_address} onChange={e => form.setData('email_sender_address', e.target.value)} placeholder="noreply@example.com" /></Field>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* IMAP Protocol */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Server size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">IMAP (Inbound Server)</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <Field label="Host"><Input value={form.data.email_imap_host} onChange={e => form.setData('email_imap_host', e.target.value)} placeholder="imap.gmail.com" /></Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Port"><Input value={form.data.email_imap_port} onChange={e => form.setData('email_imap_port', e.target.value)} placeholder="993" /></Field>
                                    <Field label="Encryption">
                                        <select value={form.data.email_imap_encryption} onChange={e => form.setData('email_imap_encryption', e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none">
                                            <option value="ssl" className="bg-[#0a0a0a]">SSL</option>
                                            <option value="tls" className="bg-[#0a0a0a]">TLS</option>
                                            <option value="" className="bg-[#0a0a0a]">NONE</option>
                                        </select>
                                    </Field>
                                </div>
                                <Field label="Username"><Input value={form.data.email_imap_username} onChange={e => form.setData('email_imap_username', e.target.value)} /></Field>
                                <Field label="Password"><Input type="password" value={form.data.email_imap_password} onChange={e => form.setData('email_imap_password', e.target.value)} placeholder="Leave blank to keep current" /></Field>
                            </div>
                        </motion.div>

                        {/* SMTP Protocol */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Send size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">SMTP (Outbound Server)</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <Field label="Host"><Input value={form.data.email_smtp_host} onChange={e => form.setData('email_smtp_host', e.target.value)} placeholder="smtp.gmail.com" /></Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Port"><Input value={form.data.email_smtp_port} onChange={e => form.setData('email_smtp_port', e.target.value)} placeholder="587" /></Field>
                                    <Field label="Encryption">
                                        <select value={form.data.email_smtp_encryption} onChange={e => form.setData('email_smtp_encryption', e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none">
                                            <option value="ssl" className="bg-[#0a0a0a]">SSL</option>
                                            <option value="tls" className="bg-[#0a0a0a]">TLS</option>
                                            <option value="" className="bg-[#0a0a0a]">NONE</option>
                                        </select>
                                    </Field>
                                </div>
                                <Field label="Username"><Input value={form.data.email_smtp_username} onChange={e => form.setData('email_smtp_username', e.target.value)} /></Field>
                                <Field label="Password"><Input type="password" value={form.data.email_smtp_password} onChange={e => form.setData('email_smtp_password', e.target.value)} placeholder="Leave blank to keep current" /></Field>
                            </div>
                        </motion.div>
                    </div>

                    {/* Signature Module */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <Signature size={20} />
                            </div>
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Email Signature</h3>
                        </div>
                        <textarea 
                            value={form.data.email_signature} 
                            onChange={e => form.setData('email_signature', e.target.value)} 
                            rows={5}
                            className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-mono" 
                            placeholder="Enter your email signature (HTML supported)..." 
                        />
                    </motion.div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={form.processing} 
                            className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-600/20 flex items-center gap-3 disabled:opacity-50"
                        >
                            {form.processing ? 'Saving...' : (
                                <>
                                    Save Settings <Save size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

