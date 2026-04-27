import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, Star, ArrowRight, Phone, Mail, Globe, MessageCircle } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans overflow-x-hidden">
            <Head title="Premium Chauffeur Service" />

            {/* Premium Background Layer */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#050505] z-10" />
                <img 
                    src="/images/login-bg.png" 
                    className="w-full h-full object-cover opacity-40 scale-110 blur-[2px]" 
                    alt="Luxury Background"
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/20">
                        <span className="text-black font-serif font-black text-xl">M</span>
                    </div>
                    <span className="font-serif font-bold text-2xl tracking-tighter uppercase">Moe Limo</span>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-8"
                >
                    {auth.user ? (
                        <Link href={route('dashboard')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link href={route('login')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors">
                                Log In
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-amber-500 transition-all shadow-xl shadow-white/5"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-40 px-6 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500 mb-6 block">Luxury Chauffeur Service</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-8 tracking-tighter">
                        Redefining the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-200 to-amber-600 animate-gradient">Standard of Excellence.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        Bespoke transportation solutions for the discerning professional. 
                        Experience the fusion of precision service and ultimate luxury.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            href={route('login')}
                            className="group px-10 py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-600/20 flex items-center gap-3"
                        >
                            Book a Ride <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-10 py-5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-all">
                            Explore Fleet
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="relative z-10 px-6 py-40 bg-black/40 backdrop-blur-sm border-y border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Shield, title: "Safe & Secure", desc: "Our chauffeurs are trained in professional service and high-level privacy standards." },
                        { icon: Clock, title: "On-Time Guarantee", desc: "Our advanced scheduling ensures your arrival is never a second late. Excellence in punctuality." },
                        { icon: MapPin, title: "Available Worldwide", desc: "Seamless transitions between metropolitan hubs with our interconnected network." }
                    ].map((pill, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <pill.icon className="text-amber-500" size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-4 tracking-tight">{pill.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">{pill.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonial */}
            <section className="relative z-10 py-40 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center gap-1 mb-8">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-500 fill-amber-500" />)}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold italic leading-tight mb-12 tracking-tight">
                        "The absolute gold standard in private aviation ground transport. Moe Limo is the only partner we trust."
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-px bg-amber-500/30" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Chief Logistics Officer, Global Tech</span>
                        <div className="w-12 h-px bg-amber-500/30" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-[#080808] pt-24 pb-12 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-16 mb-24">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                    <span className="text-black font-serif font-black text-sm">M</span>
                                </div>
                                <span className="font-serif font-bold text-xl uppercase tracking-tighter">Moe Limo</span>
                            </div>
                            <p className="text-gray-500 max-w-sm leading-relaxed text-sm mb-8">
                                Elite transportation for the modern executive. Operating at the intersection of technology and tradition.
                            </p>
                            <div className="flex gap-6">
                                <Globe size={18} className="text-gray-600 hover:text-amber-500 cursor-pointer transition-colors" />
                                <MessageCircle size={18} className="text-gray-600 hover:text-amber-500 cursor-pointer transition-colors" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-8">Navigation</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li className="hover:text-white cursor-pointer transition-colors">Our Fleet</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Service Areas</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Reviews</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-8">Contact Us</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li className="flex items-center gap-3"><Phone size={14} className="text-amber-500" /> +1 (555) 123-4567</li>
                                <li className="flex items-center gap-3"><Mail size={14} className="text-amber-500" /> service@moelimo.com</li>
                                <li className="flex items-center gap-3"><MapPin size={14} className="text-amber-500" /> HQ: New York City</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-700">© 2026 Moe Limo Service. All Rights Reserved.</p>
                        <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-700">
                            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 4s linear infinite;
                }
            ` }} />
        </div>
    );
}
