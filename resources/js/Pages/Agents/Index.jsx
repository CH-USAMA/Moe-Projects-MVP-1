import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Users, 
    UserPlus, 
    Mail, 
    Shield, 
    ShieldCheck, 
    Trash2, 
    Edit3, 
    Key, 
    User, 
    Activity, 
    ArrowRight,
    X,
    MoreHorizontal,
    Search,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <AuthenticatedLayout header="Team Management">
            <Head title="Agents" />

            <div className="max-w-[1400px] mx-auto pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Support Agents</h2>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                            <Users size={12} /> Manage your support team and permissions
                        </p>
                    </div>
                    <button 
                        onClick={() => { setEditingAgent(null); form.reset(); setShowCreate(!showCreate); }} 
                        className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                    >
                        {showCreate ? <X size={16} /> : <UserPlus size={16} />}
                        {showCreate ? 'Cancel' : 'Add Agent'}
                    </button>
                </div>

                <AnimatePresence>
                    {showCreate && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-gray-900 dark:text-white pointer-events-none">
                                    <ShieldCheck size={180} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-8 relative z-10">
                                    {editingAgent ? 'Edit Agent Details' : 'Add New Agent'}
                                </h3>
                                <form onSubmit={handleCreate} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-end relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input 
                                                value={form.data.name} 
                                                onChange={e => form.setData('name', e.target.value)} 
                                                required
                                                placeholder="Name"
                                                className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input 
                                                type="email" 
                                                value={form.data.email} 
                                                onChange={e => form.setData('email', e.target.value)} 
                                                required
                                                placeholder="email@example.com"
                                                className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Password {editingAgent && '(Leave blank to keep current)'}</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <input 
                                                type="password" 
                                                value={form.data.password} 
                                                onChange={e => form.setData('password', e.target.value)} 
                                                required={!editingAgent}
                                                placeholder="••••••••"
                                                className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                            <select 
                                                value={form.data.role} 
                                                onChange={e => form.setData('role', e.target.value)}
                                                className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-10 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer appearance-none shadow-inner"
                                            >
                                                <option value="agent" className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">Agent</option>
                                                <option value="admin" className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">Administrator</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-6 pt-4">
                                        <button type="button" onClick={() => setShowCreate(false)} className="px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                                        <button 
                                            type="submit" 
                                            disabled={form.processing}
                                            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-600/20 flex items-center gap-3"
                                        >
                                            {form.processing ? 'Saving...' : (
                                                <>
                                                    Save Agent <ArrowRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-sm relative">
                    <div className="px-10 py-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Activity size={18} className="text-amber-500" />
                            <div>
                                <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em]">Agents List</h3>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Manage your team members and roles</p>
                            </div>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search agents..." 
                                className="bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-full pl-10 pr-6 py-2 text-[10px] font-bold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-700 focus:ring-1 focus:ring-amber-500/20 w-48 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Name</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Email</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Role</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {agents.map((agent, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={agent.id} 
                                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/10 dark:to-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white flex items-center justify-center text-xs font-bold font-mono shadow-xl group-hover:scale-110 group-hover:border-amber-500/30 transition-all duration-500">
                                                    {agent.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">{agent.name}</span>
                                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">ID: {agent.id.toString().padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-mono tracking-tight">{agent.email}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[9px] px-3 py-1 rounded-xl font-bold uppercase tracking-widest border flex items-center gap-2 ${
                                                    agent.role === 'admin' 
                                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {agent.role === 'admin' ? <ShieldAlert size={10} /> : <Shield size={10} />}
                                                    {agent.role === 'admin' ? 'Administrator' : 'Agent'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => editAgent(agent)} 
                                                    className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-amber-500 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-all"
                                                    title="Edit Agent"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteAgent(agent.id)} 
                                                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 transition-all shadow-xl shadow-red-500/5"
                                                    title="Delete Agent"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <button className="p-2 text-gray-700 group-hover:opacity-0 transition-opacity">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

