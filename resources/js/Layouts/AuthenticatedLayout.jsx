import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

const NAV_ITEMS = [
    { label: 'Dashboard', route: 'dashboard', icon: '📊' },
    { label: 'Tickets', route: 'tickets.index', icon: '🎫' },
    { label: 'Customers', route: 'customers.index', icon: '👥' },
    { label: 'Agents', route: 'agents.index', icon: '🧑‍💼' },
];

const SETTINGS_ITEMS = [
    { label: 'Email', route: 'settings.email', icon: '📧' },
    { label: 'GoHighLevel', route: 'settings.ghl', icon: '🔗' },
    { label: 'SMS Alerts', route: 'settings.sms', icon: '📱' },
    { label: 'SLA & Alerting', route: 'settings.sla', icon: '⏳' },
    { label: 'Automations', route: 'settings.automations', icon: '⚡' },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    
    // Theme toggle logic
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    
    // Auto-refresh logic (Live Sync)
    useEffect(() => {
        const subscribeToPush = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                return;
            }

            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Get the public key from props
                const vapidPublicKey = usePage().props.vapid_public_key;
                if (!vapidPublicKey) return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });

                // Send to backend
                await axios.post(route('push.subscribe'), subscription);
                console.log('Push subscription successful');
            } catch (error) {
                console.error('Push subscription failed:', error);
            }
        };

        const urlBase64ToUint8Array = (base64String) => {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        };

        // Request permission and subscribe
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
            router.reload({ 
                preserveScroll: true, 
                only: ['stats', 'recentTickets', 'tickets', 'customers', 'flash'],
                onSuccess: (page) => {
                    // We still keep the local notification for immediate feedback if page is open
                    const newTickets = page.props.recentTickets || [];
                    const lastKnownId = localStorage.getItem('lastTicketId');
                    if (newTickets.length > 0 && lastKnownId && newTickets[0].id > parseInt(lastKnownId)) {
                        // Standard notification logic here if desired, 
                        // but VAPID will handle background cases better.
                    }
                    if (newTickets.length > 0) {
                        localStorage.setItem('lastTicketId', newTickets[0].id.toString());
                    }
                }
            });
        }, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const isActive = (routeName) => {
        try { return route().current(routeName); } catch { return false; }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-slate-900/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:inset-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950
                border-r border-slate-200 dark:border-slate-800/50 flex flex-col shadow-lg lg:shadow-none
            `}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800/50">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20">
                        ML
                    </div>
                    <div>
                        <h1 className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Moe Limo</h1>
                        <p className="text-slate-500 text-xs">Operations Hub</p>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Main</p>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                                isActive(item.route)
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    {/* Settings section */}
                    {user.role === 'admin' && (
                        <div className="pt-4">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="w-full flex items-center justify-between px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <span>Settings</span>
                                <svg className={`w-3 h-3 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {settingsOpen && SETTINGS_ITEMS.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive(item.route)
                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>

                {/* User footer */}
                <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800/50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 transition-colors duration-200">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            {header && <div className="text-slate-900 dark:text-white font-semibold text-lg">{header}</div>}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live Sync</span>
                            </div>
                            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
