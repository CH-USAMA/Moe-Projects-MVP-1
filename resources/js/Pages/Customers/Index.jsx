import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
        <AuthenticatedLayout header="Customers">
            <Head title="Customers" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="w-full max-w-md">
                    <input type="text" placeholder="Search by name, email, phone..."
                        defaultValue={filters.search || ''}
                        onKeyDown={(e) => e.key === 'Enter' && applySearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 shadow-sm transition-all" />
                </div>
                {selectedIds.length > 0 && (
                    <button onClick={bulkDelete} className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-all animate-in fade-in slide-in-from-right-4">
                        🗑️ Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800/30 bg-slate-50/50 dark:bg-transparent">
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === customers.data.length && customers.data.length > 0} className="rounded dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500" />
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Phone</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tickets</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Tags</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                        {customers.data?.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-500">No customers found.</td></tr>
                        )}
                        {customers.data?.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500" />
                                </td>
                                <td className="px-6 py-4" onClick={() => router.visit(route('customers.show', c.id))}>
                                    <div className="flex items-center gap-3 cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">
                                            {(c.name || 'C').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{c.name || '—'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{c.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{c.phone || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg font-bold border border-amber-500/10">
                                        {c.tickets_count}
                                    </span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {c.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{tag}</span>
                                        ))}
                                        {c.tags?.length > 2 && <span className="text-[10px] text-slate-400 font-bold">+{c.tags.length - 2}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={route('customers.show', c.id)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Edit">
                                            ✏️
                                        </Link>
                                        <button onClick={() => deleteCustomer(c.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {customers.links && customers.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800/30 flex justify-center gap-1 bg-slate-50/30 dark:bg-transparent">
                        {customers.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${link.active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : link.url ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800' : 'text-slate-400 dark:text-slate-700 cursor-not-allowed'}`} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
