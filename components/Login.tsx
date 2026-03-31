import React, { useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay for effect
    setTimeout(() => {
        const isAdmin = email.toLowerCase() === 'admin@isuzu.com';
        onLogin(isAdmin);
    }, 1500);
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full max-w-md p-8"
        >
            <motion.div 
                initial={{ x: -300, opacity: 0, skewX: -30 }}
                animate={{ x: 0, opacity: 1, skewX: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, duration: 0.5 }}
                className="mb-12 text-center relative group flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <img 
                        src="https://lh3.googleusercontent.com/d/1Zaxzi7wKvndhXlfaKSdWHJg-DiD6Euxl" 
                        alt="Logo" 
                        className="h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
                    />
                </div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] font-bold">RACE DIRECTOR & STEWARD DIVISION</p>
            </motion.div>

            {!loading ? (
                <>
                    <motion.form 
                        initial={{ x: 300, opacity: 0, skewX: 30 }}
                        animate={{ x: 0, opacity: 1, skewX: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15, duration: 0.5, delay: 0.15 }}
                        onSubmit={handleSubmit} 
                        className="space-y-5 relative z-10"
                    >
                        <div className="space-y-4">
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="Race ID / Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all font-mono tracking-wider relative z-10"
                                />
                            </div>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    placeholder="Access Token"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all font-mono tracking-wider relative z-10"
                                />
                                <Lock className="absolute right-4 top-4 w-4 h-4 text-zinc-600 z-20" />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-white text-black font-bold py-4 h-[56px] rounded-lg mt-8 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group relative overflow-hidden tracking-widest text-sm"
                            disabled={loading}
                        >
                            <span className="relative z-10">Initialize Dashboard</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform relative z-10" />
                        </button>
                    </motion.form>

                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 }}
                        className="mt-8 text-center space-y-3"
                    >
                        <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-widest uppercase">
                            POWERED BY SPONSORED LEAKX GROUP CO.,LTD.
                        </p>
                    </motion.div>
                </>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] font-bold">
                        INITIALIZING TELEMETRY STREAMS...
                    </p>
                </motion.div>
            )}
        </motion.div>
    </div>
  );
};

export default Login;