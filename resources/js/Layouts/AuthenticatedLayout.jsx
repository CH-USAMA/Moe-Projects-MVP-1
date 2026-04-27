import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { 
    LayoutDashboard, 
    Ticket, 
    Users, 
    UserCog, 
    Settings, 
    Mail, 
    Link2, 
    MessageSquare, 
    Timer, 
    Zap, 
    ChevronDown, 
    LogOut, 
    User,
    Sun,
    Moon,
    Menu,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const NAV_ITEMS = [
    { label: 'Dashboard', route: 'dashboard', icon: LayoutDashboard },
    { label: 'Tickets', route: 'tickets.index', icon: Ticket },
    { label: 'Customers', route: 'customers.index', icon: Users },
    { label: 'Agents', route: 'agents.index', icon: UserCog },
];

const SETTINGS_ITEMS = [
    { label: 'Email', route: 'settings.email', icon: Mail },
    { label: 'GoHighLevel', route: 'settings.ghl', icon: Link2 },
    { label: 'SMS Alerts', route: 'settings.sms', icon: MessageSquare },
    { label: 'SLA & Alerting', route: 'settings.sla', icon: Timer },
    { label: 'Automations', route: 'settings.automations', icon: Zap },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, vapid_public_key } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // VAPID & Push Notification Logic
    useEffect(() => {
        const subscribeToPush = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

            try {
                const registration = await navigator.serviceWorker.ready;
                if (!vapid_public_key) return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapid_public_key)
                });

                await axios.post(route('push.subscribe'), subscription);
            } catch (error) {
                console.error('Push subscription failed:', error);
            }
        };

        const urlBase64ToUint8Array = (base64String) => {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
            return outputArray;
        };

        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') subscribeToPush();
                });
            } else if (Notification.permission === 'granted') {
                subscribeToPush();
            }
        }

        const interval = setInterval(() => {
            router.reload({ preserveScroll: true, only: ['stats', 'recentTickets', 'tickets', 'customers', 'flash'] });
        }, 30000);
        return () => clearInterval(interval);
    }, [vapid_public_key]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    const isActive = (routeName) => {
        try { return route().current(routeName); } catch { return false; }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex transition-colors duration-300">
            {/* Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
                        onClick={() => setSidebarOpen(false)} 
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:inset-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-[#fafafa] dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 flex flex-col shadow-2xl lg:shadow-none
            `}>
                {/* Brand Logo */}
                <div className="flex items-center gap-4 px-8 py-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-200 opacity-20 blur group-hover:opacity-40 transition duration-300" />
                        <div className="relative w-10 h-10 rounded-lg bg-black border border-amber-500/30 flex items-center justify-center text-amber-500 font-serif text-xl">
                            M
                        </div>
                    </div>
                    <div>
                        <h1 className="text-gray-900 dark:text-white font-serif font-bold text-lg tracking-wider">Moe Limo</h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Support Center</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-4 mt-2">Navigation</p>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive(item.route)
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={18} className={isActive(item.route) ? 'text-amber-500' : 'group-hover:text-amber-400 transition-colors'} />
                            {item.label}
                            {isActive(item.route) && (
                                <motion.div layoutId="active" className="ml-auto w-1 h-4 rounded-full bg-amber-500" />
                            )}
                        </Link>
                    ))}

                    {/* Settings Dropdown */}
                    {user.role === 'superadmin' && (
                        <div className="pt-6">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <span>Settings</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-2 space-y-1"
                                    >
                                        {SETTINGS_ITEMS.map((item) => (
                                            <Link
                                                key={item.route}
                                                href={route(item.route)}
                                                className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                    isActive(item.route)
                                                        ? 'bg-amber-500/5 text-amber-500'
                                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                                }`}
                                            >
                                                <item.icon size={16} />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-white/5">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
                                </div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="top" className="mb-2">
                            <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2"><User size={14} /> Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-500"><LogOut size={14} /> Log Out</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 h-20 flex items-center px-4 sm:px-8 lg:px-12">
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                <Menu size={20} />
                            </button>
                            {header && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="text-gray-900 dark:text-white font-serif font-bold text-xl tracking-tight"
                                >
                                    {header}
                                </motion.div>
                            )}
                        </div>

                        {/* Top Bar Actions */}
                        <div className="flex items-center gap-3">
                            {/* Live Sync Status */}
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/5 border border-amber-500/20">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.1em]">Live</span>
                            </div>

                            <button className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                                <Bell size={20} />
                            </button>

                            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Notifications & Content */}
                <main className="flex-1 p-4 sm:p-8 lg:p-12">
                    <AnimatePresence>
                        {flash?.success && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-3"
                            >
                                <Zap size={16} /> {flash.success}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {children}
                </main>
            </div>
        </div>
    );
}

