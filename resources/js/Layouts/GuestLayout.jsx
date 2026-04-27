import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale-[20%]"
                style={{ backgroundImage: "url('/images/login-bg.png')" }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

            {/* Content Area */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 w-full px-6 py-4 sm:max-w-md"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="group transition-transform duration-300 hover:scale-105">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-200 opacity-30 blur group-hover:opacity-50 transition duration-300" />
                            <div className="relative h-20 w-20 bg-black rounded-full flex items-center justify-center border border-amber-500/30">
                                <span className="text-3xl font-serif text-amber-500">M</span>
                            </div>
                        </div>
                    </Link>
                    <h1 className="mt-4 text-2xl font-serif text-amber-500 tracking-widest uppercase">
                        Moe Limo Hub
                    </h1>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-2" />
                </div>

                {/* Card Section with Glassmorphism */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {children}
                </div>

                {/* Footer Quote/Brand Message */}
                <div className="mt-8 text-center text-white/40 text-xs tracking-widest uppercase">
                    Premium Chauffeur Operations
                </div>
            </motion.div>
        </div>
    );
}

