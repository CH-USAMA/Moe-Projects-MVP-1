import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
        {children}
    </div>
);
const Input = ({ ...props }) => (
    <input {...props} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-amber-500/30" />
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
            <Head title="Email Settings" />
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.data.email_enabled} onChange={e => form.setData('email_enabled', e.target.checked)}
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500/30" />
                        <div>
                            <span className="text-slate-900 dark:text-white font-medium">Enable Email Integration</span>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Activate inbound email processing and ticket creation</p>
                        </div>
                    </label>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-4">General</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Inbound Email Address"><Input value={form.data.email_inbound_address} onChange={e => form.setData('email_inbound_address', e.target.value)} placeholder="inbound@moelimo.com" /></Field>
                        <Field label="Forwarding Destination"><Input value={form.data.email_forwarding_to} onChange={e => form.setData('email_forwarding_to', e.target.value)} placeholder="support@moelimo.com" /></Field>
                        <Field label="Sender Name"><Input value={form.data.email_sender_name} onChange={e => form.setData('email_sender_name', e.target.value)} placeholder="Moe Limo Support" /></Field>
                        <Field label="Sender Address"><Input value={form.data.email_sender_address} onChange={e => form.setData('email_sender_address', e.target.value)} placeholder="support@moelimo.com" /></Field>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-4">IMAP Settings</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="IMAP Host"><Input value={form.data.email_imap_host} onChange={e => form.setData('email_imap_host', e.target.value)} placeholder="imap.gmail.com" /></Field>
                        <Field label="IMAP Port"><Input value={form.data.email_imap_port} onChange={e => form.setData('email_imap_port', e.target.value)} placeholder="993" /></Field>
                        <Field label="Username"><Input value={form.data.email_imap_username} onChange={e => form.setData('email_imap_username', e.target.value)} /></Field>
                        <Field label="Password"><Input type="password" value={form.data.email_imap_password} onChange={e => form.setData('email_imap_password', e.target.value)} placeholder="Leave blank to keep current" /></Field>
                        <Field label="Encryption">
                            <select value={form.data.email_imap_encryption} onChange={e => form.setData('email_imap_encryption', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white">
                                <option value="ssl">SSL</option><option value="tls">TLS</option><option value="">None</option>
                            </select>
                        </Field>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-4">SMTP Settings</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="SMTP Host"><Input value={form.data.email_smtp_host} onChange={e => form.setData('email_smtp_host', e.target.value)} placeholder="smtp.gmail.com" /></Field>
                        <Field label="SMTP Port"><Input value={form.data.email_smtp_port} onChange={e => form.setData('email_smtp_port', e.target.value)} placeholder="587" /></Field>
                        <Field label="Username"><Input value={form.data.email_smtp_username} onChange={e => form.setData('email_smtp_username', e.target.value)} /></Field>
                        <Field label="Password"><Input type="password" value={form.data.email_smtp_password} onChange={e => form.setData('email_smtp_password', e.target.value)} placeholder="Leave blank to keep current" /></Field>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 shadow-sm dark:shadow-none">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Signature</h3>
                    <textarea value={form.data.email_signature} onChange={e => form.setData('email_signature', e.target.value)} rows={4}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-amber-500/30 resize-none" placeholder="Email signature HTML..." />
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={form.processing} className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 shadow-lg shadow-amber-500/20">
                        {form.processing ? 'Saving...' : 'Save Email Settings'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
