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
    <div className="w-full h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            {/* Carbon Fiber / Grid Texture */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}></div>
            
            {/* Diagonal Racing Stripes */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }}></div>

            {/* Glowing Red Horizon Line */}
            <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="absolute top-[35%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-isuzu-red to-transparent origin-left"
            ></motion.div>
            
            {/* Ambient Glows */}
            <div className="absolute top-[40%] left-[-20%] w-[50%] h-[300px] bg-isuzu-red opacity-[0.05] blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[200px] bg-white opacity-[0.03] blur-[100px] rounded-full"></div>
            
            {/* Animated Speed Lines */}
            <motion.div 
                animate={{ x: ['-100%', '200%'] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                className="absolute top-[30%] left-0 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <motion.div 
                animate={{ x: ['-100%', '200%'] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }} 
                className="absolute top-[60%] left-0 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-isuzu-red/20 to-transparent"
            />
        </div>

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
                    {/* White circular gradient for contrast */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white blur-[50px] rounded-full pointer-events-none -z-10 opacity-30"></div>
                    
                    <img 
                        src="https://lh3.googleusercontent.com/d/1Zaxzi7wKvndhXlfaKSdWHJg-DiD6Euxl" 
                        alt="Logo" 
                        className="h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
                    />
                </div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] italic font-bold">Committee Dashboard</p>
            </motion.div>

            <motion.form 
                initial={{ x: 300, opacity: 0, skewX: 30 }}
                animate={{ x: 0, opacity: 1, skewX: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, duration: 0.5, delay: 0.15 }}
                onSubmit={handleSubmit} 
                className="space-y-5 relative z-10"
            >
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-isuzu-red/0 via-isuzu-red/20 to-isuzu-red/0 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
                        <input 
                            type="email" 
                            placeholder="RACE ID / EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-isuzu-red/50 focus:bg-white/5 transition-all font-mono uppercase tracking-wider relative z-10 backdrop-blur-sm"
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-isuzu-red/0 via-isuzu-red/20 to-isuzu-red/0 rounded-lg opacity-0 group-focus-within:opacity-100 transition duration-500 blur"></div>
                        <input 
                            type="password" 
                            placeholder="ACCESS TOKEN"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-isuzu-red/50 focus:bg-white/5 transition-all font-mono uppercase tracking-wider relative z-10 backdrop-blur-sm"
                        />
                        <Lock className="absolute right-4 top-4 w-4 h-4 text-zinc-600 z-20" />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 h-[56px] rounded-lg mt-8 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group relative overflow-hidden uppercase tracking-widest text-sm"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 w-full relative overflow-hidden">
                            <motion.div 
                                animate={{ x: ['-200%', '300%'] }} 
                                transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }} 
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-black/20 to-transparent skew-x-[-45deg]"
                            />
                            <motion.span 
                                animate={{ opacity: [1, 0.6, 1], x: [-2, 2, -2] }}
                                transition={{ duration: 0.15, repeat: Infinity }}
                                className="font-mono italic font-bold tracking-widest text-black text-sm relative z-10"
                            >
                                CONNECTING
                            </motion.span>
                            <div className="flex gap-1 relative z-10">
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.0 }} className="w-1.5 h-4 bg-green-500 skew-x-[-20deg] shadow-[0_0_8px_#22c55e]"></motion.div>
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.04 }} className="w-1.5 h-4 bg-green-500 skew-x-[-20deg] shadow-[0_0_8px_#22c55e]"></motion.div>
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.08 }} className="w-1.5 h-4 bg-yellow-500 skew-x-[-20deg] shadow-[0_0_8px_#eab308]"></motion.div>
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.12 }} className="w-1.5 h-4 bg-red-500 skew-x-[-20deg] shadow-[0_0_8px_#ef4444]"></motion.div>
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.16 }} className="w-1.5 h-4 bg-blue-600 skew-x-[-20deg] shadow-[0_0_8px_#2563eb]"></motion.div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="relative z-10">INITIALIZE DASHBOARD</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]"></div>
                        </>
                    )}
                </button>
            </motion.form>

            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 }}
                className="mt-8 text-center space-y-3"
            >
                <p className="text-[10px] text-zinc-700 font-mono font-bold tracking-widest uppercase">
                    Power by Embedded Linux Group
                </p>
                <p className="text-[10px] text-zinc-800 font-mono">
                    SECURE CONNECTION REQUIRED • V2.4.0
                </p>
            </motion.div>
        </motion.div>
    </div>
  );
};

export default Login;