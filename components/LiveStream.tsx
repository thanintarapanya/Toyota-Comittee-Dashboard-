import React, { useState, useEffect } from 'react';
import MapWidget from './MapWidget';
import { Eye, Video, Activity, ChevronDown } from 'lucide-react';
import { Car, Driver } from '../types';

const CAR_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

interface LiveStreamProps {
    cars: Car[];
    drivers: Driver[];
}

const LiveStream: React.FC<LiveStreamProps> = ({ cars, drivers }) => {
    // Simulate an active flag event
    const [activeFlag, setActiveFlag] = useState<{turn: string, type: 'YELLOW' | 'RED' | 'GREEN'} | null>({ turn: 'T3', type: 'YELLOW' });
    const [selectedCarId, setSelectedCarId] = useState<number>(cars[0]?.id || 0);
    const [progress, setProgress] = useState(0);

    const selectedCar = cars.find(c => c.id === selectedCarId);
    const selectedDriver = drivers.find(d => d.carId === selectedCarId);

    // Cycle flags for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFlag(prev => {
                if (prev?.turn === 'T3') return { turn: 'T7', type: 'RED' };
                if (prev?.turn === 'T7') return null; // Green/Clear
                return { turn: 'T3', type: 'YELLOW' };
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Animate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => (p + 0.0005) % 1);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    const mapRivals = cars
        .filter(c => c.id !== selectedCarId)
        .map((car, i) => ({
            id: car.id,
            name: drivers.find(d => d.carId === car.id)?.name || `Car ${car.number}`,
            color: CAR_COLORS[i % CAR_COLORS.length],
            progress: (progress + 0.1 + (i * 0.08)) % 1
        }));

    return (
        <div className="flex-1 p-6 h-full flex flex-col gap-6 bg-[#050505] overflow-hidden">
             
             {/* Header */}
             <div className="flex justify-between items-end flex-shrink-0 mb-4">
                 <div>
                     <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-3">
                         Live Broadcast 
                         <span className="relative flex h-2 w-2 ml-1">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                         </span>
                     </h2>
                     <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">OFFICIAL ORGANIZER STREAM • BURIRAM</p>
                 </div>

                 {/* Car Selector */}
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 relative group">
                        <div className="w-2 h-2 rounded-full bg-isuzu-red animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ONBOARD FEED</span>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm font-bold text-white uppercase">
                                    #{selectedCar?.number} - {selectedDriver?.name || 'Unknown'}
                                </span>
                                <ChevronDown className="w-3 h-3 text-zinc-500" />
                            </div>
                        </div>
                        
                        {/* Dropdown */}
                        <select 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={selectedCarId}
                            onChange={(e) => setSelectedCarId(Number(e.target.value))}
                        >
                            {cars.map(car => {
                                const driver = drivers.find(d => d.carId === car.id);
                                return (
                                    <option key={car.id} value={car.id}>
                                        #{car.number} - {driver?.name || 'Unknown'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                 </div>
             </div>

             {/* Top Row: Map and YouTube (2 Big Boxes) - Using 12 col grid for custom widths */}
             <div className="flex-1 grid grid-cols-12 gap-6 min-h-[300px]">
                
                {/* Box 1: Live Map (4/12 width) */}
                <div className="col-span-4 h-full">
                    <MapWidget 
                        circuitName="Buriram International Circuit"
                        activeFlag={activeFlag}
                        mainCarProgress={progress}
                        rivals={mapRivals}
                        className="border border-white/5"
                    />
                </div>

                {/* Box 2: YouTube Embed (8/12 width) */}
                <div className="col-span-8 glass-panel rounded-xl border border-white/5 overflow-hidden relative group">
                     <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <iframe 
                            className="w-full h-full" 
                            src="https://www.youtube.com/embed/Rk-8Fj8wE64?autoplay=1&mute=1&controls=1" 
                            title="Live Stream" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                     </div>
                     
                     {/* Overlay Gradient for integration */}
                     <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-4 border-white/5 rounded-xl"></div>
                 </div>
             </div>

             {/* Bottom Row: 3 Small Camera Boxes */}
             <div className="h-[35%] grid grid-cols-3 gap-6 min-h-[200px]">
                
                {/* Camera 1: Front */}
                <div className="glass-panel rounded-xl relative overflow-hidden border border-white/10 flex flex-col group">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <Eye className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-[9px] font-bold text-white tracking-widest">FRONT CAM #{selectedCar?.number}</span>
                    </div>
                    <div className="w-full h-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop')] relative">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 shadow-lg">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-bold text-white tracking-widest">LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Camera 2: Cockpit */}
                <div className="glass-panel rounded-xl relative overflow-hidden border border-white/10 flex flex-col group">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <Activity className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-[9px] font-bold text-white tracking-widest">COCKPIT CAM #{selectedCar?.number}</span>
                    </div>
                    <div className="w-full h-full bg-cover bg-center bg-gradient-to-b from-sky-900 via-[#3d2b1f] to-[#1a120b] relative">
                         {/* CSS Perspective Trick for Cockpit feel */}
                         <div className="absolute bottom-0 w-full h-1/2 flex justify-center perspective-[200px]">
                            <div className="w-[120%] h-full bg-[#2a1d15] transform rotate-x-60 translate-y-10 blur-sm"></div>
                        </div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 shadow-lg">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-bold text-white tracking-widest">LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Camera 3: Rear */}
                <div className="glass-panel rounded-xl relative overflow-hidden border border-white/10 flex flex-col group">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <Video className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-[9px] font-bold text-white tracking-widest">REAR CAM #{selectedCar?.number}</span>
                    </div>
                    <div className="w-full h-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1542228262-3d663b306a53?q=80&w=1000&auto=format&fit=crop')] relative">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 shadow-lg">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-bold text-white tracking-widest">LIVE</span>
                        </div>
                    </div>
                </div>

             </div>
        </div>
    );
};

export default LiveStream;