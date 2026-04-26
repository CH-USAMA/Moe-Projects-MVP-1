import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AgentIndex({ agents }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'agent',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (editingAgent) {
            form.patch(route('agents.update', editingAgent.id), {
                onSuccess: () => {
                    setShowCreate(false);
                    setEditingAgent(null);
                    form.reset();
                }
            });
        } else {
            form.post(route('agents.store'), {
                onSuccess: () => {
                    setShowCreate(false);
                    form.reset();
                }
            });
        }
    };

    const editAgent = (agent) => {
        setEditingAgent(agent);
        form.setData({
            name: agent.name,
            email: agent.email,
            password: '',
            role: agent.role,
        });
        setShowCreate(true);
    };

    const deleteAgent = (id) => {
        if (confirm('Are you sure you want to delete this agent?')) {
            router.delete(route('agents.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Agent Management">
            <Head title="Agents" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team Agents</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your support team and administrative access.</p>
                </div>
                <button onClick={() => { setEditingAgent(null); form.reset(); setShowCreate(!showCreate); }} 
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20">
                    {showCreate ? 'Close Form' : '+ Add Agent'}
                </button>
            </div>

            {showCreate && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 mb-8 shadow-sm dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-slate-900 dark:text-white font-bold mb-4">{editingAgent ? 'Edit Agent' : 'Create New Agent'}</h3>
                    <form onSubmit={handleCreate} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input value={form.data.name} onChange={e => form.setData('name', e.target.value)} required
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" value={form.data.email} onChange={e => form.setData('email', e.target.value)} required
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password {editingAgent && '(Leave blank to keep)'}</label>
                            <input type="password" value={form.data.password} onChange={e => form.setData('password', e.target.value)} required={!editingAgent}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                            <select value={form.data.role} onChange={e => form.setData('role', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20">
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-bold text-sm">Cancel</button>
                            <button type="submit" disabled={form.processing}
                                className="px-10 py-2.5 bg-slate-900 dark:bg-amber-500 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/10">
                                {form.processing ? 'Saving...' : (editingAgent ? 'Update Agent' : 'Create Agent')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-transparent border-b border-slate-100 dark:border-slate-800/30">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                        {agents.map(agent => (
                            <tr key={agent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">
                                            {agent.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{agent.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${agent.role === 'admin' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-500/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20'}`}>
                                        {agent.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => editAgent(agent)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                                            ✏️
                                        </button>
                                        <button onClick={() => deleteAgent(agent.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
