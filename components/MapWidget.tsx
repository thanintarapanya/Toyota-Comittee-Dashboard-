import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon, Flag, Settings, X } from 'lucide-react';

interface MapWidgetProps {
    className?: string;
    circuitName?: string;
    activeFlag?: { turn: string; type: 'YELLOW' | 'RED' | 'GREEN' } | null;
    mainCarProgress?: number; // 0 to 1
    rivals?: { id: number | string; name: string; color: string; progress: number; isSelected?: boolean }[];
}

const TRACK_TURNS = [
    { id: '1', x: 180, y: 80 },
    { id: '2', x: 500, y: 120 },
    { id: '3', x: 750, y: 150 },
    { id: '4', x: 300, y: 180 },
    { id: '5', x: 180, y: 280 },
    { id: '6', x: 250, y: 320 },
    { id: '7', x: 320, y: 280 },
    { id: '8', x: 550, y: 280 },
    { id: '9', x: 600, y: 380 },
    { id: '10', x: 450, y: 340 },
    { id: '11', x: 350, y: 380 },
    { id: '12', x: 120, y: 380 },
];

const MapWidget: React.FC<MapWidgetProps> = ({ 
    className = "", 
    circuitName = "Buriram International Circuit", 
    activeFlag, 
    mainCarProgress = 0, 
    rivals = [] 
}) => {
    const trackPathRef = useRef<SVGPathElement>(null);
    const [carMapPos, setCarMapPos] = useState({ x: 100, y: 300 });
    const [rivalPositions, setRivalPositions] = useState<{id: number | string, x: number, y: number, color: string, name: string, isSelected?: boolean}[]>([]);

    // Calculate positions based on progress
    useEffect(() => {
        if (trackPathRef.current) {
            const path = trackPathRef.current;
            const totalLength = path.getTotalLength();
            
            // Main Car
            const clampedProgress = Math.max(0, Math.min(1, mainCarProgress));
            const point = path.getPointAtLength(clampedProgress * totalLength);
            setCarMapPos({ x: point.x, y: point.y });

            // Rivals
            const newRivalPositions = rivals.map(rival => {
                const rivalProg = Math.max(0, Math.min(1, rival.progress));
                const rivalPoint = path.getPointAtLength(rivalProg * totalLength);
                return {
                    id: rival.id,
                    x: rivalPoint.x,
                    y: rivalPoint.y,
                    color: rival.color,
                    name: rival.name,
                    isSelected: rival.isSelected
                };
            });
            setRivalPositions(newRivalPositions);
        }
    }, [mainCarProgress, rivals]);

    const activeFlagTurn = activeFlag ? TRACK_TURNS.find(t => t.id === activeFlag.turn) : null;

    return (
        <div className={`glass-panel p-0 rounded-xl h-full flex flex-col relative overflow-hidden bg-[#080808] ${className}`}>
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 flex items-center gap-2">
                    <MapIcon className="w-3 h-3 text-zinc-400" />
                    <span className="text-[10px] text-zinc-300 uppercase font-bold tracking-wider">LIVE TRACKER</span>
                </div>
                {/* Settings button removed as requested */}
            </div>

            {/* Circuit Name */}
            <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10">
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                    {circuitName}
                </span>
            </div>

            {/* Active Flag Alert Banner */}
            {activeFlag && (
                 <div 
                    className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/80 border border-yellow-500/50 px-3 py-1.5 rounded animate-pulse cursor-pointer hover:bg-black/90 transition-all"
                    title="Active Flag"
                 >
                      <Flag className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <div className="flex flex-col">
                           <span className="text-[9px] text-yellow-500 font-bold uppercase leading-none">SECTOR 3</span>
                           <span className="text-[9px] text-white font-bold uppercase leading-none mt-0.5">YELLOW FLAG {activeFlag.turn}</span>
                      </div>
                 </div>
            )}

            <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center bg-transparent">
                {/* Background Texture/Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <svg viewBox="0 0 800 450" className="w-full h-full p-4 select-none scale-110">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#cbd5e1" />
                            <stop offset="100%" stopColor="#94a3b8" />
                        </linearGradient>
                    </defs>

                    {/* Track Path - Border */}
                    <path 
                        d="M 100 300 L 140 100 Q 150 60 200 70 L 720 140 Q 780 150 740 190 L 350 160 Q 300 160 250 200 L 200 250 Q 160 280 200 310 Q 220 330 250 300 Q 280 270 320 280 L 520 280 Q 560 280 580 320 Q 600 380 540 380 Q 500 380 480 350 Q 460 320 400 360 L 150 380 Q 80 380 100 300 Z"
                        className="stroke-black/80 stroke-[16px] fill-none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />

                    {/* Track Path - Main Surface */}
                    <path 
                        ref={trackPathRef}
                        d="M 100 300 L 140 100 Q 150 60 200 70 L 720 140 Q 780 150 740 190 L 350 160 Q 300 160 250 200 L 200 250 Q 160 280 200 310 Q 220 330 250 300 Q 280 270 320 280 L 520 280 Q 560 280 580 320 Q 600 380 540 380 Q 500 380 480 350 Q 460 320 400 360 L 150 380 Q 80 380 100 300 Z"
                        className="stroke-slate-300 stroke-[6px] fill-none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        filter="url(#glow)"
                    />
                    
                    {/* Track Centerline */}
                    <path 
                        d="M 100 300 L 140 100 Q 150 60 200 70 L 720 140 Q 780 150 740 190 L 350 160 Q 300 160 250 200 L 200 250 Q 160 280 200 310 Q 220 330 250 300 Q 280 270 320 280 L 520 280 Q 560 280 580 320 Q 600 380 540 380 Q 500 380 480 350 Q 460 320 400 360 L 150 380 Q 80 380 100 300 Z"
                        className="stroke-white stroke-[1px] fill-none opacity-50" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        strokeDasharray="10 10"
                    />
                    
                    {/* Turn Numbers */}
                    {TRACK_TURNS.map((turn) => (
                        <g key={turn.id}>
                            <circle cx={turn.x} cy={turn.y} r="8" className="fill-black stroke-white stroke-1" />
                            <text x={turn.x} y={turn.y} dy="3" textAnchor="middle" className="fill-white text-[9px] font-bold font-mono select-none">{turn.id}</text>
                        </g>
                    ))}
                    
                    {/* Flag Popup */}
                    {activeFlagTurn && (
                        <g transform={`translate(${activeFlagTurn.x}, ${activeFlagTurn.y - 25})`}>
                            <path d="M0 0 L-8 -10 L8 -10 Z" fill="#EAB308" />
                            <rect x="-16" y="-30" width="32" height="20" rx="4" fill="#EAB308" />
                            <Flag x="-10" y="-26" width="20" height="12" className="text-black" fill="black" />
                        </g>
                    )}

                    {/* Rivals Markers */}
                    {rivalPositions.map(pos => (
                        <g key={pos.id} transform={`translate(${pos.x}, ${pos.y})`}>
                            {/* Arrow for selected rivals */}
                            {pos.isSelected && (
                                <path d="M -8 -25 L 8 -25 L 0 -8 Z" fill={pos.color} className="animate-bounce-arrow" />
                            )}
                            
                            {/* Label Box */}
                            <g transform="translate(8, -8)">
                                <rect x="0" y="0" width="28" height="12" rx="2" fill="black" stroke={pos.color} strokeWidth="1" />
                                <text x="14" y="9" textAnchor="middle" className="fill-white text-[8px] font-bold font-mono select-none">{pos.name}</text>
                            </g>
                            {/* Car Dot */}
                            <circle r={pos.isSelected ? "6" : "4"} fill={pos.color} className="stroke-white stroke-1 shadow-lg" />
                        </g>
                    ))}

                    {/* Active Car Marker */}
                    <g 
                        style={{ transform: `translate(${carMapPos.x}px, ${carMapPos.y}px)` }}
                        className="transition-transform duration-75 ease-linear"
                    >
                        {/* Arrow pointing down */}
                        <path d="M -12 -35 L 12 -35 L 0 -12 Z" fill="#FF3333" className="animate-bounce-arrow" />
                        
                        {/* Car Dot - Bigger */}
                        <circle r="10" className="fill-white stroke-isuzu-red stroke-[4px]" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default MapWidget;
