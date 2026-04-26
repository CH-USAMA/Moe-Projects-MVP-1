import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const CONDITION_FIELDS = [
    { value: 'subject', label: 'Subject' }, { value: 'source', label: 'Source' },
    { value: 'priority', label: 'Priority' }, { value: 'customer_email', label: 'Customer Email' },
];
const CONDITION_OPS = [
    { value: 'equals', label: 'Equals' }, { value: 'contains', label: 'Contains' }, { value: 'starts_with', label: 'Starts with' },
];
const ACTION_TYPES = [
    { value: 'assign_agent', label: 'Assign Agent' }, { value: 'change_priority', label: 'Change Priority' },
    { value: 'change_status', label: 'Change Status' }, { value: 'add_tag', label: 'Add Tag' },
    { value: 'send_sms', label: 'Send SMS' },
];

export default function Automations({ rules }) {
    const [showForm, setShowForm] = useState(false);
    const form = useForm({
        name: '', conditions: [{ field: 'subject', operator: 'contains', value: '' }],
        actions: [{ type: 'change_priority', value: '' }],
    });

    const addCondition = () => form.setData('conditions', [...form.data.conditions, { field: 'subject', operator: 'contains', value: '' }]);
    const addAction = () => form.setData('actions', [...form.data.actions, { type: 'change_priority', value: '' }]);
    const updateCondition = (i, key, val) => { const c = [...form.data.conditions]; c[i][key] = val; form.setData('conditions', c); };
    const updateAction = (i, key, val) => { const a = [...form.data.actions]; a[i][key] = val; form.setData('actions', a); };
    const rmCondition = (i) => form.setData('conditions', form.data.conditions.filter((_, j) => j !== i));
    const rmAction = (i) => form.setData('actions', form.data.actions.filter((_, j) => j !== i));

    const save = (e) => {
        e.preventDefault();
        form.post(route('settings.automations.store'), { onSuccess: () => { setShowForm(false); form.reset(); }, preserveScroll: true });
    };

    const toggleRule = (rule) => router.patch(route('settings.automations.update', rule.id), { ...rule, is_active: !rule.is_active }, { preserveScroll: true });
    const deleteRule = (rule) => { if (confirm('Delete this rule?')) router.delete(route('settings.automations.destroy', rule.id), { preserveScroll: true }); };

    const sel = "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-amber-500/30";
    const inp = "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-amber-500/30";

    return (
        <AuthenticatedLayout header="Automation Rules"><Head title="Automations" />
            <div className="max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Create IF/THEN rules to automate ticket handling</p>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20">
                        + New Rule
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={save} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-6 mb-6 space-y-5 shadow-sm dark:shadow-none">
                        <input value={form.data.name} onChange={e => form.setData('name', e.target.value)} placeholder="Rule name *" required className={`w-full ${inp}`} />
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">IF (Conditions)</span>
                                <button type="button" onClick={addCondition} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">+ Add</button>
                            </div>
                            {form.data.conditions.map((c, i) => (
                                <div key={i} className="flex gap-2 mb-2 items-center">
                                    <select value={c.field} onChange={e => updateCondition(i, 'field', e.target.value)} className={sel}>
                                        {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                    <select value={c.operator} onChange={e => updateCondition(i, 'operator', e.target.value)} className={sel}>
                                        {CONDITION_OPS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <input value={c.value} onChange={e => updateCondition(i, 'value', e.target.value)} placeholder="Value" required className={`flex-1 ${inp}`} />
                                    {form.data.conditions.length > 1 && <button type="button" onClick={() => rmCondition(i)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg">×</button>}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">THEN (Actions)</span>
                                <button type="button" onClick={addAction} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">+ Add</button>
                            </div>
                            {form.data.actions.map((a, i) => (
                                <div key={i} className="flex gap-2 mb-2 items-center">
                                    <select value={a.type} onChange={e => updateAction(i, 'type', e.target.value)} className={sel}>
                                        {ACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                    <input value={a.value} onChange={e => updateAction(i, 'value', e.target.value)} placeholder="Value" required className={`flex-1 ${inp}`} />
                                    {form.data.actions.length > 1 && <button type="button" onClick={() => rmAction(i)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg">×</button>}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white">Cancel</button>
                            <button type="submit" disabled={form.processing} className="px-6 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">Save Rule</button>
                        </div>
                    </form>
                )}

                <div className="space-y-3">
                    {rules?.length === 0 && <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-5 py-16 text-center text-slate-500 shadow-sm dark:shadow-none">No automation rules yet</div>}
                    {rules?.map((rule) => (
                        <div key={rule.id} className={`bg-white dark:bg-slate-900/50 border rounded-xl p-5 shadow-sm dark:shadow-none transition-all ${rule.is_active ? 'border-slate-200 dark:border-slate-800/50' : 'border-slate-200 dark:border-slate-800/30 opacity-60'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-slate-900 dark:text-white font-semibold">{rule.name}</h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleRule(rule)} className={`text-xs px-3 py-1 rounded-full font-medium ${rule.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                        {rule.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                    <button onClick={() => deleteRule(rule)} className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">Delete</button>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                <div><span className="text-blue-600 dark:text-blue-400 font-semibold">IF:</span>
                                    {rule.conditions?.map((c, i) => <div key={i} className="text-slate-600 dark:text-slate-400 mt-1">{c.field} {c.operator} "{c.value}"</div>)}
                                </div>
                                <div><span className="text-amber-600 dark:text-amber-400 font-semibold">THEN:</span>
                                    {rule.actions?.map((a, i) => <div key={i} className="text-slate-600 dark:text-slate-400 mt-1">{a.type} → "{a.value}"</div>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
