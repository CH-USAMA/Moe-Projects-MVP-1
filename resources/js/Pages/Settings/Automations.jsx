import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Zap, 
    Plus, 
    Trash2, 
    Filter, 
    Play, 
    Settings2, 
    ChevronRight, 
    Power,
    CheckCircle2,
    Clock,
    Shield,
    Terminal,
    ArrowRight,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const deleteRule = (rule) => { if (confirm('Delete this automation rule?')) router.delete(route('settings.automations.destroy', rule.id), { preserveScroll: true }); };

    const sel = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all appearance-none";
    const inp = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all";

    return (
        <AuthenticatedLayout header="Automations">
            <Head title="Automation Rules" />
            
            <div className="max-w-6xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Automation Rules</h2>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Manage your ticket processing rules</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-600/20 flex items-center gap-2"
                    >
                        <Plus size={14} /> Add Rule
                    </button>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.form 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={save} 
                            className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 mb-12 space-y-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-amber-500 pointer-events-none">
                                <Zap size={140} />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="relative group">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Rule Name</label>
                                        <input 
                                            value={form.data.name} 
                                            onChange={e => form.setData('name', e.target.value)} 
                                            placeholder="Example: Auto-assign Support" 
                                            required 
                                            className={`w-full ${inp}`} 
                                        />
                                    </div>
                                </div>

                                {/* Conditions Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                                <Filter size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Triggers (IF)</span>
                                        </div>
                                        <button type="button" onClick={addCondition} className="text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors flex items-center gap-1">
                                            <Plus size={12} /> Add Condition
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {form.data.conditions.map((c, i) => (
                                            <motion.div 
                                                layout
                                                key={i} 
                                                className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5"
                                            >
                                                <div className="flex-1 grid md:grid-cols-3 gap-3 w-full">
                                                    <select value={c.field} onChange={e => updateCondition(i, 'field', e.target.value)} className={sel}>
                                                        {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value} className="bg-[#0a0a0a]">{f.label}</option>)}
                                                    </select>
                                                    <select value={c.operator} onChange={e => updateCondition(i, 'operator', e.target.value)} className={sel}>
                                                        {CONDITION_OPS.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a0a]">{o.label}</option>)}
                                                    </select>
                                                    <input value={c.value} onChange={e => updateCondition(i, 'value', e.target.value)} placeholder="Target value" required className={inp} />
                                                </div>
                                                {form.data.conditions.length > 1 && (
                                                    <button type="button" onClick={() => rmCondition(i)} className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                                                <Play size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Actions (THEN)</span>
                                        </div>
                                        <button type="button" onClick={addAction} className="text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors flex items-center gap-1">
                                            <Plus size={12} /> Add Action
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {form.data.actions.map((a, i) => (
                                            <motion.div 
                                                layout
                                                key={i} 
                                                className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5"
                                            >
                                                <div className="flex-1 grid md:grid-cols-2 gap-3 w-full">
                                                    <select value={a.type} onChange={e => updateAction(i, 'type', e.target.value)} className={sel}>
                                                        {ACTION_TYPES.map(t => <option key={t.value} value={t.value} className="bg-[#0a0a0a]">{t.label}</option>)}
                                                    </select>
                                                    <input value={a.value} onChange={e => updateAction(i, 'value', e.target.value)} placeholder="Action value" required className={inp} />
                                                </div>
                                                {form.data.actions.length > 1 && (
                                                    <button type="button" onClick={() => rmAction(i)} className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForm(false)} 
                                        className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={form.processing} 
                                        className="px-10 py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {form.processing ? 'Saving...' : (
                                            <>
                                                Save Rule <ArrowRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="grid md:grid-cols-1 gap-4">
                    {rules?.length === 0 && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] py-24 text-center">
                            <Terminal className="mx-auto text-gray-700 mb-6" size={48} />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em]">No automation rules found</p>
                        </div>
                    )}
                    
                    <AnimatePresence>
                        {rules?.map((rule) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={rule.id} 
                                className={`group relative bg-white/[0.03] backdrop-blur-md border rounded-[2.5rem] p-8 shadow-sm transition-all hover:bg-white/[0.05] ${rule.is_active ? 'border-white/10' : 'border-white/5 opacity-40'}`}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${rule.is_active ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-white tracking-tight">{rule.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-gray-600" />
                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Modified: {new Date().toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => toggleRule(rule)} 
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${rule.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                                        >
                                            <Power size={12} /> {rule.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                        <button 
                                            onClick={() => deleteRule(rule)} 
                                            className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                            <Filter size={12} /> Filters (IF)
                                        </span>
                                        <div className="space-y-2">
                                            {rule.conditions?.map((c, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
                                                    <span className="text-white font-medium">{c.field}</span>
                                                    <span className="text-gray-500 uppercase text-[10px] tracking-tighter">{c.operator}</span>
                                                    <span className="text-blue-400 font-mono text-xs">"{c.value}"</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                            <Play size={12} /> Execution (THEN)
                                        </span>
                                        <div className="space-y-2">
                                            {rule.actions?.map((a, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                                                    <span className="text-white font-medium">{a.type}</span>
                                                    <ChevronRight size={12} className="text-gray-600" />
                                                    <span className="text-amber-400 font-mono text-xs">"{a.value}"</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 right-0 p-8 opacity-[0.02] text-white pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                    <Settings2 size={80} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

