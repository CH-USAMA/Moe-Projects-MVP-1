import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, UserX, Fingerprint, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Account Settings">
            <Head title="Profile Settings" />

            <div className="max-w-5xl mx-auto space-y-12 pb-20">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 mb-12"
                >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-2xl shadow-amber-600/20">
                        <Settings2 size={40} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Profile Management</h2>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Manage your account preferences and security</p>
                    </div>
                </motion.div>

                {/* Profile Information */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-amber-500 pointer-events-none">
                        <User size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <User size={20} />
                            </div>
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Profile Information</h3>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>
                </motion.div>

                {/* Password Update */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-amber-500 pointer-events-none">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">Security Settings</h3>
                        </div>
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </motion.div>

                {/* Account Deletion */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-red-500/[0.02] border border-red-500/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-red-500 pointer-events-none">
                        <UserX size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                <UserX size={20} />
                            </div>
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Danger Zone</h3>
                        </div>
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

