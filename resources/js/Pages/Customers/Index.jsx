import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search, 
    UserPlus, 
    Trash2, 
    MoreHorizontal, 
    ExternalLink, 
    Mail, 
    Phone, 
    Tag, 
    Ticket,
    Filter,
    ChevronLeft,
    ChevronRight,
    Users,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerIndex({ customers, filters }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const applySearch = (value) => {
        router.get(route('customers.index'), { search: value || undefined }, { preserveState: true, replace: true });
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(customers.data.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const deleteCustomer = (id) => {
        if (confirm('Are you sure you want to delete this customer? This will also delete all their tickets.')) {
            router.delete(route('customers.destroy', id));
        }
    };

    const bulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedIds.length} customers and all their tickets?`)) {
            router.post(route('customers.bulk-delete'), { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Customer Management">
            <Head title="Customers" />
            
            <div className="max-w-7xl mx-auto pb-20">
                {/* Header Stats / Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Customer Directory</h2>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Manage your relationship database</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search customers..."
                                defaultValue={filters.search || ''}
                                onKeyDown={(e) => e.key === 'Enter' && applySearch(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all shadow-xl"
                            />
                        </div>
                        
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <motion.button 
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                    onClick={bulkDelete}
                                    className="p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all"
                                    title="Delete Selected"
                                >
                                    <Trash2 size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Table Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-8 py-6 w-10">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                onChange={toggleSelectAll} 
                                                checked={selectedIds.length === customers.data.length && customers.data.length > 0} 
                                                className="w-5 h-5 rounded-lg border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-amber-500 focus:ring-amber-500/20 transition-all" 
                                            />
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Customer Identity</th>
                                    <th className="px-6 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Contact Details</th>
                                    <th className="px-6 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Engagement</th>
                                    <th className="px-6 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hidden md:table-cell">Tags</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {customers.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-700">
                                                    <Users size={32} />
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">No customers detected in directory</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {customers.data?.map((c, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        key={c.id} 
                                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                        onClick={() => router.visit(route('customers.show', c.id))}
                                    >
                                        <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(c.id)} 
                                                onChange={() => toggleSelect(c.id)} 
                                                className="w-5 h-5 rounded-lg border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-amber-500 focus:ring-amber-500/20 transition-all" 
                                            />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                                        {c.name || 'Anonymous Customer'}
                                                    </span>
                                                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                                        ID: #{c.id.toString().padStart(5, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Mail size={12} className="text-blue-400/50" />
                                                    <span className="font-medium truncate max-w-[200px]">{c.email}</span>
                                                </div>
                                                {c.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Phone size={12} className="text-emerald-400/50" />
                                                        <span className="font-medium">{c.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <Ticket size={12} className="text-amber-500/50" />
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{c.tickets_count}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total Tickets</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-2">
                                                {c.tags?.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[9px] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/5 font-bold uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {c.tags?.length > 3 && (
                                                    <span className="text-[9px] text-gray-600 font-bold px-1">+{c.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={route('customers.show', c.id)} 
                                                    className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => deleteCustomer(c.id)} 
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.links && customers.links.length > 3 && (
                        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Showing {customers.from} to {customers.to} of {customers.total} Customers
                            </div>
                            <div className="flex gap-2">
                                {customers.links.map((link, i) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Link 
                                                key={i} 
                                                href={link.url || '#'} 
                                                className={`p-2 rounded-xl border border-gray-200 dark:border-white/10 transition-all ${!link.url ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white'}`}
                                            >
                                                <ChevronLeft size={16} />
                                            </Link>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Link 
                                                key={i} 
                                                href={link.url || '#'} 
                                                className={`p-2 rounded-xl border border-gray-200 dark:border-white/10 transition-all ${!link.url ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white'}`}
                                            >
                                                <ChevronRight size={16} />
                                            </Link>
                                        );
                                    }
                                    if (link.url === null) return null;
                                    return (
                                        <Link 
                                            key={i} 
                                            href={link.url}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${link.active ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/5'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
