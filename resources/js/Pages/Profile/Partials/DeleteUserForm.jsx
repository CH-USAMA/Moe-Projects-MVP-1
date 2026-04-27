import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { UserX, AlertTriangle, ShieldX, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                        Once your account is deleted, all of its resources and data will be permanently deleted. 
                        Before deleting your account, please download any data or information that you wish to retain.
                    </p>
                </div>
                <button 
                    onClick={confirmUserDeletion}
                    className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2"
                >
                    <UserX size={14} /> Delete Account
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <form onSubmit={deleteUser} className="p-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Once your account is deleted, all of its resources and data will be permanently deleted. 
                            Please enter your password to confirm you would like to permanently delete your account.
                        </p>

                        <div className="relative group mb-8">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                <ShieldX size={18} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter Password"
                                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all shadow-inner"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                type="button"
                                onClick={closeModal}
                                className="flex-1 px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processing ? 'Deleting...' : (
                                    <>
                                        Delete Account <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}

