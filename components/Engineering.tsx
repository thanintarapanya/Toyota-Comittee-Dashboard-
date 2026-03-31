import React, { useState, useEffect, useRef, forwardRef } from 'react';
import MapWidget from './MapWidget';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip, ScatterChart, Scatter, CartesianGrid, AreaChart, Area } from 'recharts';
import { Responsive } from 'react-grid-layout';
import * as ReactGridLayout from 'react-grid-layout';
import { Cloud, Flag, Activity, Play, Pause, RotateCcw, Wind, Droplets, Gauge, Thermometer, ArrowUp, ArrowDown, Zap, Map as MapIcon, Trophy, Upload, BarChart2, TrendingUp, Maximize2, ExternalLink, X, Eye, EyeOff, Video, AlertTriangle, Compass, GripHorizontal, LayoutGrid, Check, Disc, Monitor, GaugeCircle, Save, Folder, Settings, Square, Plus, ChevronDown } from 'lucide-react';
import { Car, Driver, FileItem, CarTelemetry } from '../types';

const WidthProvider = (ReactGridLayout as any).WidthProvider;
const ResponsiveGridLayout = WidthProvider(Responsive);

// Helper to format time
const getTimestamp = (offsetSeconds: number) => {
    const d = new Date();
    d.setSeconds(d.getSeconds() - offsetSeconds);
    return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// Comprehensive Data Generator
const generateHistory = (count: number, racerId: number) => {
    const data = [];
    const now = Date.now();
    const cheaterIds = [2, 5, 8, 11, 14, 17, 20, 23, 26];
    const isCheater = cheaterIds.includes(racerId);
    const performanceFactor = isCheater ? 1.15 + ((racerId * 7) % 10) * 0.01 : 0.95 + ((racerId * 7) % 7) * 0.01;

    for (let i = count; i > 0; i--) {
        const timeOffset = i * 0.04; // 25Hz = 0.04s per step
        
        const spike = (!isCheater && Math.random() < 0.01) ? 1.15 : 1.0;
        const finalPf = performanceFactor * spike;

        // Simulating physics for G-Force
        const steering = Math.sin(timeOffset * 0.8) * 90;
        const speed = Math.max(0, 150 + Math.sin(timeOffset * 0.1) * 80 * finalPf + (Math.random() * 10));
        const throttle = Math.max(0, Math.cos(timeOffset * 0.5) * 100);
        const brake = Math.max(0, -Math.cos(timeOffset * 0.5) * 80);

        // Simple mock physics for Gs
        // Lat G relates to steering angle * speed (simplified)
        const gLat = (steering / 90) * (speed / 100) * 1.5 * finalPf + (Math.random() * 0.1 - 0.05);
        // Long G relates to throttle (+) and brake (-)
        const gLong = (throttle / 100) * 0.8 * finalPf - (brake / 100) * 1.2 + (Math.random() * 0.1 - 0.05);
        
        // Heading (0-360) simulating a track loop
        const heading = (Math.abs(Math.sin(timeOffset * 0.1)) * 360);

        data.push({
            timestamp: getTimestamp(timeOffset),
            originalTime: now - (timeOffset * 1000),
            // Biometrics - smoothed with sine waves + small noise
            heartRate: 130 + Math.sin(timeOffset * 0.5) * 10 + (Math.random() * 2),
            breath: 16 + Math.sin(timeOffset * 0.8) * 2 + (Math.random() * 0.5),
            stress: 50 + Math.sin(timeOffset * 0.2) * 15 + (Math.random() * 2),
            
            // Sync Data
            lapProgress: (timeOffset * 2) % 100,
            
            // Control Inputs (Smooth Physics)
            steering, 
            throttle,
            brake,
            
            // Dynamics
            gLat,
            gLong,
            heading,

            // Engine
            rpm: Math.max(0, 6000 + Math.sin(timeOffset * 0.2) * 2100 * finalPf + (Math.random() * 100)),
            speed, // Added speed
            fuelFlow: Math.max(0, 70 + Math.sin(timeOffset * 0.1) * 18 * finalPf + Math.random() * 5),
            oilTemp: 85 + Math.sin(timeOffset * 0.01) * 16 * finalPf + Math.random() * 2,
            fuel: Math.max(0, 100 - (timeOffset * 0.05)), // Fuel consumption simulation
            lambda: isCheater ? 1.02 + Math.random() * 0.06 : 0.98 + Math.random() * 0.04 * spike, // Lambda sensor data
            boost: 1.5 + Math.sin(timeOffset * 0.5) * 0.5 * finalPf, // Turbo Boost (bar)
            
            // Environment
            airTemp: 30 + Math.sin(timeOffset * 0.02) * 5 + Math.random(),
            windSpeed: 12 + Math.sin(timeOffset * 0.05) * 5, // km/h
            windDir: 'NE',
            humidity: 75 + Math.random() * 0.5,
            pressure: 1013 + Math.sin(timeOffset * 0.01) * 2,
            
            // Tires (Temp & Pressure)
            flTemp: 104 + Math.sin(timeOffset * 0.1) * 5 * finalPf,
            frTemp: 105 + Math.cos(timeOffset * 0.12) * 5 * finalPf,
            rlTemp: 113 + Math.sin(timeOffset * 0.15) * 4 * finalPf,
            rrTemp: 115 + Math.cos(timeOffset * 0.18) * 4 * finalPf,
            
            flPress: 1.2 + Math.random() * 0.01,
            frPress: 1.1 + Math.random() * 0.01,
            rlPress: 1.2 + Math.random() * 0.01,
            rrPress: 1.3 + Math.random() * 0.01,

            // Tire Speeds (km/h) - slightly different per wheel to simulate slip/cornering
            flSpeed: speed * (1 + (Math.sin(timeOffset * 0.8) * 0.02)),
            frSpeed: speed * (1 - (Math.sin(timeOffset * 0.8) * 0.02)),
            rlSpeed: speed * (1 + (Math.sin(timeOffset * 0.8) * 0.05)), // Rear slip
            rrSpeed: speed * (1 - (Math.sin(timeOffset * 0.8) * 0.05)),

            // Brakes
            flBrake: 650 + Math.cos(timeOffset * 0.3) * 200,
            frBrake: 500 + Math.cos(timeOffset * 0.3) * 150,
            rlBrake: 765 + Math.cos(timeOffset * 0.3) * 100,
            rrBrake: 725 + Math.cos(timeOffset * 0.3) * 120,
        });
    }
    return data;
};

interface TelemetryProps {
    cars: Car[];
    drivers: Driver[];
    setFiles?: React.Dispatch<React.SetStateAction<FileItem[]>>;
    layout: any[];
    onLayoutChange: (layout: any[]) => void;
}

// Forward Ref Wrapper for RGL compatibility
const MaximizableView = forwardRef(({ style, className, onMouseDown, onMouseUp, onTouchEnd, children, title, isMaximized, onToggle, onHide, isPopup = false, editMode, ...props }: any, ref: any) => {
    // If maximized, we render a portal/overlay outside the grid system
    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                <div className={`${isPopup ? 'w-[80vw] h-[80vh] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'w-full h-full'} bg-[#0a0a0a] flex flex-col relative`}>
                    <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-900">
                         <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                             {title}
                             {isPopup && <span className="px-2 py-0.5 rounded bg-isuzu-red text-[10px] font-bold">LIVE WINDOW</span>}
                         </h2>
                         <button onClick={onToggle} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white transition-colors">
                             <X className="w-6 h-6" />
                         </button>
                    </div>
                    <div className="flex-1 min-h-0 relative overflow-hidden p-8 flex flex-col">
                        <div className="w-full h-full flex flex-col pl-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Normal Grid Item Render
    return (
        <div 
            ref={ref} 
            style={style} 
            className={`${className} relative group h-full rounded-xl transition-all duration-200 ${editMode ? 'border border-dashed border-white/30 hover:border-isuzu-red' : ''}`} 
            onMouseDown={onMouseDown} 
            onMouseUp={onMouseUp} 
            onTouchEnd={onTouchEnd}
            {...props}
        >
             <div className="h-full w-full overflow-hidden rounded-xl">
                 {children}
             </div>
             
             {/* Header/Controls */}
             {!editMode && (
                 <button 
                    onClick={onToggle} 
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-isuzu-red text-white rounded opacity-0 group-hover:opacity-100 transition-all backdrop-blur z-20 shadow-lg"
                    title={isPopup ? "Open New Window" : "Maximize View"}
                 >
                     {isPopup ? <ExternalLink className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                 </button>
             )}
             
             {editMode && (
                <>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 border border-white/10 pointer-events-none z-50 flex items-center gap-1">
                        <GripHorizontal className="w-3 h-3" /> Drag
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onHide && onHide(); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded border border-white/10 transition-colors z-50"
                        title="Hide Widget"
                    >
                        <EyeOff className="w-3 h-3" />
                    </button>
                </>
             )}
        </div>
    );
});

// Reusable Components
const StatBox = ({ label, value, unit, color = "text-white", icon: Icon }: any) => (
    <div className="bg-white/5 border border-white/10 p-2 rounded-lg flex flex-col relative overflow-hidden group h-full justify-between">
      <div className="flex items-center gap-1.5 mb-0.5">
         {Icon && <Icon className="w-3 h-3 text-zinc-500" />}
         <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className={`text-lg font-light ${color} leading-none`}>{value}</span>
        {unit && <span className="text-[9px] text-zinc-400 font-mono">{unit}</span>}
      </div>
    </div>
);

const TireHUD = ({ position, side, temp, pressure, brakeTemp, tempColor = "bg-orange-500", brakeColor = "bg-yellow-500", speed }: any) => {
      const isRight = side === 'right';
      return (
        <div className={`absolute ${isRight ? 'text-left -right-[20px] md:-right-[140px]' : 'text-right -left-[20px] md:-left-[140px]'} w-[100px] md:w-[140px] top-1/2 -translate-y-1/2 pointer-events-none`}>
            <div className="text-zinc-400 text-[10px] font-bold mb-1 md:mb-2 tracking-wider">{position} TIRE</div>
            <div className={`flex items-center gap-2 mb-1 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-zinc-600 text-[8px] md:text-[10px] uppercase">km/h</span>
                <span className="text-isuzu-red text-xs md:text-sm font-bold tracking-tighter">{Math.round(speed)}</span>
            </div>
        <div className={`flex items-center gap-2 mb-1 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm ${tempColor}`}></div>
            <div className="flex items-baseline gap-1">
                <span className="text-white text-lg md:text-2xl font-light tracking-tighter">N/A</span>
            </div>
        </div>
        <div className={`flex items-center gap-2 mb-3 md:mb-4 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm bg-green-500"></div>
            <div className="flex items-baseline gap-1">
                <span className="text-white text-base md:text-xl font-light tracking-tighter">N/A</span>
            </div>
        </div>
        <div className="text-zinc-400 text-[10px] font-bold mb-1 md:mb-2 tracking-wider border-t border-white/10 pt-2">{position} BRAKES</div>
        <div className={`flex items-center gap-2 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm ${brakeColor}`}></div>
            <div className="flex items-baseline gap-1">
                <span className="text-white text-base md:text-xl font-light tracking-tighter">N/A</span>
            </div>
        </div>
        </div>
      );
};

const ControlTelemetry = ({ steering, throttle, brake }: { steering: number, throttle: number, brake: number }) => (
    <div className="flex items-end justify-between gap-2 h-full w-full bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-30 rounded-2xl pointer-events-none"></div>

        {/* Added Section Name */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <Gauge className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">PEDAL & STEERING</span>
         </div>

        <div className="flex flex-col items-center gap-2 relative z-10 group h-full justify-end">
             <div className="h-16 lg:h-24 w-6 bg-zinc-900/80 rounded-sm relative overflow-hidden border border-zinc-700 shadow-[inset_0_0_20px_rgba(0,0,0,1)] skew-x-[-10deg]">
                 <div className="absolute right-0 top-0 h-full w-full flex flex-col justify-between py-1 px-1 opacity-30 z-20">
                    {[...Array(10)].map((_, i) => <div key={i} className="w-2 h-[1px] bg-white self-end"></div>)}
                 </div>
                 <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-red-900 via-red-600 to-red-400 transition-all duration-75 ease-out shadow-[0_0_20px_rgba(220,38,38,0.6)]" 
                    style={{ height: `${brake}%` }} 
                 >
                    <div className="absolute top-0 w-full h-[2px] bg-white blur-[1px]"></div>
                 </div>
                 {/* Added % Value */}
                 <div className="absolute bottom-1 left-0 w-full text-center text-[8px] font-bold text-white z-30 drop-shadow-md">
                     {Math.round(brake)}%
                 </div>
             </div>
             <div className="text-center">
                 <div className="text-[9px] uppercase font-black text-zinc-500 tracking-widest skew-x-[-10deg]">Brk</div>
             </div>
        </div>

        <div className="flex flex-col items-center relative z-20 mb-1">
            <div className="relative w-20 h-16 lg:w-24 lg:h-16 flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] mb-1" style={{ transform: `rotate(${steering}deg)`, transition: 'transform 0.05s ease-out' }}>
                 <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="carbonFiber" x1="0%" y1="0%" x2="100%" y2="100%" spreadMethod="reflect">
                            <stop offset="0%" stopColor="#1a1a1a" />
                            <stop offset="25%" stopColor="#2a2a2a" />
                            <stop offset="50%" stopColor="#111" />
                            <stop offset="75%" stopColor="#2a2a2a" />
                            <stop offset="100%" stopColor="#1a1a1a" />
                        </linearGradient>
                         <linearGradient id="alcantara" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2a2a2a" />
                            <stop offset="100%" stopColor="#151515" />
                        </linearGradient>
                    </defs>
                    <path d="M 70 60 C 50 60 20 80 20 120 C 20 160 50 170 80 160 L 100 130 L 200 130 L 220 160 C 250 170 280 160 280 120 C 280 80 250 60 230 60 L 70 60 Z" fill="url(#carbonFiber)" stroke="#111" strokeWidth="2" />
                    <path d="M 60 60 C 30 60 20 90 20 120 C 20 150 30 170 60 160 C 45 150 45 90 60 60" fill="url(#alcantara)" />
                    <path d="M 240 60 C 270 60 280 90 280 120 C 280 150 270 170 240 160 C 255 150 255 90 240 60" fill="url(#alcantara)" />
                    <path d="M 80 70 L 220 70 L 210 120 L 90 120 Z" fill="#111" stroke="#333" strokeWidth="1" />
                    <text x="150" y="145" fontSize="10" fill="#666" textAnchor="middle" fontFamily="monospace" fontWeight="bold" letterSpacing="2">ISUZU</text>
                 </svg>
            </div>
            <div className="bg-black/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur flex items-center gap-1 shadow-lg">
                 <div className="text-[9px] font-mono font-bold text-white w-8 text-center">{Math.round(steering)}°</div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-2 relative z-10 group h-full justify-end">
             <div className="h-16 lg:h-24 w-6 bg-zinc-900/80 rounded-sm relative overflow-hidden border border-zinc-700 shadow-[inset_0_0_20px_rgba(0,0,0,1)] skew-x-[10deg]">
                 <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between py-1 px-1 opacity-30 z-20">
                    {[...Array(10)].map((_, i) => <div key={i} className="w-2 h-[1px] bg-white"></div>)}
                 </div>
                 <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-900 via-green-500 to-green-400 transition-all duration-75 ease-out shadow-[0_0_20px_rgba(34,197,94,0.6)]" 
                    style={{ height: `${throttle}%` }} 
                 >
                    <div className="absolute top-0 w-full h-[2px] bg-white blur-[1px]"></div>
                 </div>
                 {/* Added % Value */}
                 <div className="absolute bottom-1 left-0 w-full text-center text-[8px] font-bold text-white z-30 drop-shadow-md">
                     {Math.round(throttle)}%
                 </div>
             </div>
             <div className="text-center">
                 <div className="text-[9px] uppercase font-black text-zinc-500 tracking-widest skew-x-[10deg]">Gas</div>
             </div>
        </div>
    </div>
);

const BioChart = ({ title, data, dataKey, min, max, color, stroke, current, unit, icon: Icon, graphType, isMaximized }: any) => {
    const values = data.map((d: any) => d[dataKey] || 0);
    const high = values.length > 0 ? Math.max(...values).toFixed(0) : 0;
    const low = values.length > 0 ? Math.min(...values).toFixed(0) : 0;

    return (
        <div className="w-full h-full flex flex-col min-h-[160px] group glass-panel rounded-xl p-4 border border-white/5 bg-[#080808]">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className={`p-1.5 rounded-lg bg-white/5`}>
                            <Icon className={`w-4 h-4 ${color} animate-pulse`} />
                        </div>
                    )}
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{title}</span>
                </div>
                <div className="text-right">
                    <div className="text-xl font-light text-white leading-none">{current}</div>
                    <div className="text-[9px] text-zinc-500 font-mono">{unit}</div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 mt-2 px-6">
                 <ResponsiveContainer width="100%" height="100%">
                    {graphType === 'scatter' ? (
                        <ScatterChart margin={{ left: -10, right: 0, top: 5, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={true} horizontal={true} />
                             <YAxis type="number" dataKey={dataKey} domain={[min, max]} stroke="#444" fontSize={9} width={24} tick={{fill: '#666'}} />
                             <XAxis type="category" dataKey="timestamp" stroke="#444" fontSize={9} tick={{fill: '#666'}} minTickGap={30} />
                             <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '12px' }} itemStyle={{ color: stroke }} />
                             <Scatter name={title} data={data} fill={stroke} shape="circle" />
                        </ScatterChart>
                    ) : (
                        <LineChart data={data} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={true} horizontal={true} />
                            
                            <XAxis 
                                dataKey="timestamp" 
                                stroke="#444" 
                                fontSize={9} 
                                tick={{fill: '#666'}} 
                                minTickGap={isMaximized ? 20 : 30} 
                                interval="preserveStartEnd"
                            />
                            
                            <YAxis 
                                domain={[min, max]} 
                                stroke="#444" 
                                fontSize={9} 
                                width={35} 
                                tick={{fill: '#666'}}
                                tickCount={isMaximized ? 8 : 4} 
                            />
                            
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '12px' }}
                                itemStyle={{ color: stroke }}
                                labelStyle={{ color: '#888', marginBottom: '4px' }}
                            />
                            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                    )}
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

// Widget Types
type WidgetType = 'RACE_STATUS' | 'MAP' | 'CONDITIONS' | 'CAR_VIEW' | 'CONTROLS' | 'HEART' | 'BREATH' | 'STRESS' | 'ALERTS' | 'CAMERAS' | 'G_FORCE' | 'CORRELATION' | 'GAP_TIME';

interface Widget {
    id: string;
    type: WidgetType;
    title: string;
}

const Engineering: React.FC<TelemetryProps> = ({ cars, drivers, setFiles, layout, onLayoutChange }) => {
  const activeRacers = cars.map(car => {
      const driver = drivers.find(d => d.carId === car.id);
      return {
          id: car.id,
          name: driver ? driver.name : 'Unknown',
          number: car.number,
          initials: driver ? driver.name.split(' ').map(n => n[0]).join('') : 'XX',
          gap: 'Leader', 
          lastLap: '1:21.503'
      };
  });

  const [activeRacerId, setActiveRacerId] = useState<number>(activeRacers[0]?.id || 0);
  const [selectedLap, setSelectedLap] = useState<number>(16);
  const [rivalInput, setRivalInput] = useState<string>('');
  const [rivalList, setRivalList] = useState<string[]>([]);
  
  // Data State
  const [history, setHistory] = useState<any[]>(() => generateHistory(120, 1)); 
  const [isPaused, setIsPaused] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState<number>(119); 
  const tickRef = useRef(0);

  useEffect(() => {
      setHistory(generateHistory(120, activeRacerId));
      setPlaybackIndex(119);
  }, [activeRacerId]);
  const [graphType, setGraphType] = useState<'line' | 'scatter'>('line');
  const [maximizedSection, setMaximizedSection] = useState<string | null>(null);
  
  // New States
  const [maxLaps, setMaxLaps] = useState(67);
  const [activeCamera, setActiveCamera] = useState<'FRONT' | 'COCKPIT' | 'REAR'>('FRONT');
  const [activeFlag, setActiveFlag] = useState<{turn: string, type: 'YELLOW' | 'RED' | 'GREEN'} | null>({ turn: 'T9', type: 'YELLOW' }); // Default active flag for demo

  // Map & Circuit Settings
  const [circuitName, setCircuitName] = useState('Buriram International Circuit');
  // Removed unused Map state and refs

  const CAR_CLASSES = [
    { name: 'Mercedes', color: '#06b6d4' }, // Cyan (RUS)
    { name: 'Aston Martin', color: '#10b981' }, // Green (ALO)
    { name: 'Ferrari', color: '#ef4444' }, // Red (LEC)
    { name: 'McLaren', color: '#f97316' }, // Orange (PIA)
    { name: 'Red Bull', color: '#3b82f6' }, // Blue (PER)
    { name: 'Williams', color: '#60a5fa' }, // Light Blue (ALB)
    { name: 'Haas', color: '#ef4444' }, // Red/White (MAG) - reusing red
    { name: 'Alpine', color: '#ec4899' }, // Pink (GAS)
    { name: 'Kick', color: '#22c55e' }, // Green (BOT)
    { name: 'RB', color: '#3b82f6' }, // Blue (TSU)
  ];

  const DRIVER_NAMES = ['RUS', 'ALO', 'LEC', 'PIA', 'NOR', 'SAI', 'RIC', 'BOT', 'MAG', 'HUL', 'ALB', 'GAS', 'OCO', 'STR', 'TSU', 'PER', 'VER', 'HAM', 'ZHO', 'SAR'];

  // Rivals State (29 cars)
  const [rivals] = useState(() => {
      return Array.from({ length: 29 }, (_, i) => {
          const cls = CAR_CLASSES[i % CAR_CLASSES.length];
          const name = DRIVER_NAMES[i % DRIVER_NAMES.length] || `R${i}`;
          return {
              id: 100 + i,
              number: `${i + 20}`,
              name: name,
              class: cls.name,
              color: cls.color,
              offset: Math.random() 
          };
      });
  });

  // Recording State
  const [recState, setRecState] = useState<'IDLE' | 'RACING' | 'SAVING'>('IDLE'); // Changed to RACING
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [isNewFolder, setIsNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Edit Mode
  const [editMode, setEditMode] = useState(false);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  
  // Customization
  const [carImageUrl, setCarImageUrl] = useState("https://lh3.googleusercontent.com/d/1NQBLvLxI9phuUUhDIenQ6VIRr7kJO5na");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const widgets: Widget[] = [
      { id: 'race', type: 'RACE_STATUS', title: 'Status' },
      { id: 'map', type: 'MAP', title: 'Tracker' },
      { id: 'car', type: 'CAR_VIEW', title: 'Car Info' },
      { id: 'conditions', type: 'CONDITIONS', title: 'Weather' },
      { id: 'alerts', type: 'ALERTS', title: 'Active Alerts' },
      { id: 'cameras', type: 'CAMERAS', title: 'Live Feed' },
      { id: 'heart', type: 'HEART', title: 'Heart Rate' },
      { id: 'breath', type: 'BREATH', title: 'Respiration' },
      { id: 'stress', type: 'STRESS', title: 'Stress' },
      { id: 'correlation', type: 'CORRELATION', title: 'Speed/RPM' }, 
      { id: 'gap_time', type: 'GAP_TIME', title: 'Gap Time' }, // New Widget
  ];

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
        if (!isPaused) {
            setHistory(prev => {
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                tickRef.current += 0.1;
                const t = tickRef.current;
                
                const lastPoint = prev[prev.length - 1];
                
                const performanceFactor = 0.9 + (activeRacerId * 0.015);
                const spike = Math.random() < 0.01 ? 1.15 : 1.0;
                const finalPf = performanceFactor * spike;

                // Simulating physics for G-Force
                const steering = Math.sin(t * 0.8) * 90;
                const speed = Math.max(0, 150 + Math.sin(t * 0.1) * 80 * finalPf + (Math.random() * 10));
                const throttle = Math.max(0, Math.cos(t * 0.5) * 100);
                const brake = Math.max(0, -Math.cos(t * 0.5) * 80);

                const gLat = (steering / 90) * (speed / 100) * 1.5 * finalPf + (Math.random() * 0.1 - 0.05);
                const gLong = (throttle / 100) * 0.8 * finalPf - (brake / 100) * 1.2 + (Math.random() * 0.1 - 0.05);
                const heading = (Math.abs(Math.sin(t * 0.1)) * 360);

                const newPoint = {
                    timestamp: timeString,
                    originalTime: Date.now(),
                    heartRate: 135 + Math.sin(t * 0.5) * 10 + (Math.random() * 2),
                    breath: 16 + Math.sin(t * 0.8) * 2 + (Math.random() * 0.5),
                    stress: 50 + Math.sin(t * 0.2) * 15 + (Math.random() * 2),
                    lapProgress: (lastPoint.lapProgress + 0.05) % 100, 
                    steering, 
                    throttle,
                    brake,
                    gLat,
                    gLong,
                    heading,
                    rpm: Math.max(0, 6000 + Math.sin(t * 0.2) * 2100 * finalPf + (Math.random() * 100)),
                    speed,
                    fuelFlow: Math.max(0, 70 + Math.sin(t * 0.1) * 18 * finalPf + Math.random() * 5),
                    oilTemp: 85 + Math.sin(t * 0.01) * 16 * finalPf + Math.random() * 2,
                    lambda: 0.98 + (activeRacerId * 0.002) + Math.random() * 0.04 * spike,
                    airTemp: 30 + Math.sin(t * 0.02) * 5 + Math.random(),
                    humidity: 75 + Math.sin(t * 0.1) * 2,
                    windSpeed: 12 + Math.sin(t * 0.05) * 5,
                    pressure: 1013 + Math.sin(t * 0.01) * 1,
                    windDir: 'NE',
                    fuel: Math.max(0, lastPoint.fuel ? lastPoint.fuel - 0.005 : 98),
                    flTemp: 104 + Math.sin(t * 0.1) * 5 * finalPf,
                    frTemp: 105 + Math.cos(t * 0.12) * 5 * finalPf,
                    rlTemp: 113 + Math.sin(t * 0.15) * 4 * finalPf,
                    rrTemp: 115 + Math.cos(t * 0.18) * 4 * finalPf,
                    flPress: 1.2, frPress: 1.1, rlPress: 1.2, rrPress: 1.3,
                    flBrake: Math.max(200, 650 + Math.sin(t*0.5)*300),
                    frBrake: Math.max(200, 500 + Math.sin(t*0.55)*250),
                    rlBrake: Math.max(200, 765 + Math.sin(t*0.45)*200),
                    rrBrake: Math.max(200, 725 + Math.sin(t*0.48)*200),
                    flSpeed: speed * (1 + (Math.sin(t * 0.8) * 0.02)),
                    frSpeed: speed * (1 - (Math.sin(t * 0.8) * 0.02)),
                    rlSpeed: speed * (1 + (Math.sin(t * 0.8) * 0.05)),
                    rrSpeed: speed * (1 - (Math.sin(t * 0.8) * 0.05)),
                };
                const newHistory = [...prev, newPoint].slice(-600);
                setPlaybackIndex(newHistory.length - 1); 
                return newHistory;
            });
        }
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, activeRacerId]);

  // Map tracking logic moved to MapWidget

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setCarImageUrl(url);
      }
  };

  // Recording Logic
  const handleStartRacing = () => {
      setRecState('RACING');
      setRecordingStartTime(Date.now());
      setRecordingName(`Race_Session_${new Date().toLocaleDateString().replace(/\//g,'-')}`);
  };

  const handleStopRacing = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering parent click if any
      setRecState('SAVING');
      setSaveModalOpen(true);
  };

  const handleSaveRecording = () => {
      if (setFiles) {
          // 1. Determine or Create Race Folder
          let targetFolderId = selectedFolder;
          const timestamp = new Date().toLocaleString();
          
          if (isNewFolder) {
              targetFolderId = `race-folder-${Date.now()}`;
              const newFolder: FileItem = {
                  id: targetFolderId,
                  parentId: 'root',
                  name: newFolderName || recordingName,
                  type: 'folder',
                  date: timestamp
              };
              setFiles(prev => [...prev, newFolder]);
          }

          // 2. Create Lap Folders & Content (Simulated for Lap 1 & 2)
          const laps = ['Lap 1', 'Lap 2', 'Lap 3'];
          const newFiles: FileItem[] = [];

          laps.forEach((lap, idx) => {
              const lapFolderId = `lap-${Date.now()}-${idx}`;
              
              // Lap Folder
              newFiles.push({
                  id: lapFolderId,
                  parentId: targetFolderId,
                  name: lap,
                  type: 'folder',
                  date: timestamp
              });

              // Telemetry CSV
              newFiles.push({
                  id: `telem-${Date.now()}-${idx}`,
                  parentId: lapFolderId,
                  name: `telemetry_${lap.replace(' ', '_')}.csv`,
                  type: 'csv',
                  size: '4.2 MB',
                  date: timestamp
              });

              // Cam Files
              ['Front', 'Cockpit', 'Rear'].forEach(cam => {
                   newFiles.push({
                      id: `cam-${cam}-${Date.now()}-${idx}`,
                      parentId: lapFolderId,
                      name: `${cam}_Camera.mp4`,
                      type: 'mp4',
                      size: '125 MB',
                      date: timestamp
                  });
              });
          });

          // Add generated files to state
          setFiles(prev => [...prev, ...newFiles]);
          
          // Reset
          setSaveModalOpen(false);
          setRecState('IDLE');
          setRecordingStartTime(null);
          setIsNewFolder(false);
          setNewFolderName('');
      }
  };

  const getRecordingDuration = () => {
      if (!recordingStartTime) return "00:00";
      const diff = Math.floor((Date.now() - recordingStartTime) / 1000);
      const m = Math.floor(diff / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

  // Helper getters
  const viewWindowSize = 50;
  const startIndex = Math.max(0, playbackIndex - viewWindowSize);
  const viewData = history.slice(startIndex, playbackIndex + 1);
  const currentPoint = history[playbackIndex] || {};
  const getVal = (key: string, def = 0) => typeof currentPoint[key] === 'number' ? currentPoint[key] : def;
  const currentLapProgress = getVal('lapProgress', 0);

  const getCameraUrl = () => {
      switch(activeCamera) {
          case 'FRONT': return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop';
          case 'COCKPIT': return 'https://images.unsplash.com/photo-1599408462763-7c706c88f117?q=80&w=1000&auto=format&fit=crop';
          case 'REAR': return 'https://images.unsplash.com/photo-1542228262-3d663b306a53?q=80&w=1000&auto=format&fit=crop';
      }
  };
  
  // TRACK_TURNS moved to MapWidget

  const renderWidgetContent = (type: WidgetType) => {
      switch(type) {
          case 'RACE_STATUS':
              const sortedRacers = [...activeRacers].sort((a, b) => {
                  const cheaterIds = [2, 5, 8, 11, 14, 17, 20, 23, 26];
                  const perfA = cheaterIds.includes(a.id) ? 1.15 + ((a.id * 7) % 10) * 0.01 : 0.95 + ((a.id * 7) % 7) * 0.01;
                  const perfB = cheaterIds.includes(b.id) ? 1.15 + ((b.id * 7) % 10) * 0.01 : 0.95 + ((b.id * 7) % 7) * 0.01;
                  return perfB - perfA; // Higher performance = P1
              });
              const rank = sortedRacers.findIndex(r => r.id === activeRacerId) + 1;
              return (
                <div className="glass-panel p-3 rounded-xl border-l-4 border-l-isuzu-red h-full flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center z-10">
                        <span className="text-[10px] font-bold text-white tracking-wider flex items-center gap-2">
                            <Flag className="w-3 h-3 text-isuzu-red" /> STATUS
                        </span>
                    </div>

                    {/* Big Rank Center */}
                    <div className="flex-1 flex items-center justify-center z-10 my-2">
                         <div className="text-6xl font-black italic text-white tracking-tighter shadow-xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                            P{rank}
                         </div>
                    </div>

                    <div className="flex justify-between items-end z-10 mt-auto">
                        <div className="flex-1">
                             <div className="text-[9px] text-zinc-500 uppercase tracking-wide font-bold">LAP</div>
                             <div className="flex items-baseline gap-0.5">
                                <span className="text-3xl font-light text-white leading-none">16</span>
                                <span className="text-zinc-600 text-lg font-light">/</span>
                                <input 
                                    type="number" 
                                    value={maxLaps} 
                                    onChange={(e) => setMaxLaps(Number(e.target.value))}
                                    className="w-12 bg-transparent text-lg font-light text-zinc-500 outline-none border-b border-transparent hover:border-zinc-800 focus:border-isuzu-red text-center p-0"
                                />
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[9px] text-zinc-500 uppercase tracking-wide font-bold">Times</div>
                             <div className="text-xl font-mono text-white leading-none mb-0.5">1:22.405</div>
                             <div className="text-sm text-green-500 font-mono leading-none">1:21.503</div>
                        </div>
                    </div>
                </div>
              );
          case 'G_FORCE':
              const gLat = getVal('gLat', 0);
              const gLong = getVal('gLong', 0);
              const heading = getVal('heading', 0);
              
              // Normalize G for visualization (clamped to circle radius)
              const maxG = 2.0;
              const cx = 50; // Center percent
              const cy = 50; 
              // Convert G to percent position relative to center
              const px = cx + (Math.max(-maxG, Math.min(maxG, gLat)) / maxG) * 40;
              const py = cy - (Math.max(-maxG, Math.min(maxG, gLong)) / maxG) * 40; // Flip Y for typical G plot (Forward is up/neg)

              return (
                <div className="glass-panel p-4 rounded-xl h-full flex items-center justify-between bg-black/40 relative overflow-hidden">
                    {/* Left Column: Speed & RPM */}
                    <div className="flex flex-col justify-center gap-1 min-w-[40%] h-full relative z-10">
                        {/* Speed */}
                        <div>
                             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">SPEED</div>
                             <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black italic text-white tracking-tighter leading-none shadow-black drop-shadow-lg">
                                    {Math.round(getVal('speed'))}
                                </span>
                                <span className="text-xs font-bold text-zinc-500">KM/H</span>
                            </div>
                        </div>
                        
                        {/* RPM */}
                        <div className="mt-2 w-full">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">RPM</span>
                                <span className="text-xs font-mono text-zinc-300">{Math.round(getVal('rpm'))}</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-sm overflow-hidden border border-white/10">
                                <div 
                                    className={`h-full transition-all duration-75 ${getVal('rpm') > 7000 ? 'bg-isuzu-red shadow-[0_0_10px_#ff3333]' : 'bg-white'}`}
                                    style={{ width: `${(getVal('rpm') / 9000) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Heading Text - Optional, maybe put inside compass */}
                        <div className="mt-auto pt-1 flex items-center gap-2">
                             <span className="text-[9px] font-bold text-zinc-600 uppercase">HDG</span>
                             <span className="text-xs font-mono text-white tracking-wider">{Math.round(heading)}°</span>
                        </div>
                    </div>

                    {/* Right Column: G-Force Graphic */}
                    <div className="h-full aspect-square relative flex items-center justify-center">
                         {/* Compass Ring Outer */}
                        <div 
                            className="absolute w-full h-full rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ease-out"
                            style={{ transform: `rotate(${-heading}deg)` }}
                        >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-isuzu-red">N</div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-600">S</div>
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-[8px] font-bold text-zinc-600">E</div>
                            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 text-[8px] font-bold text-zinc-600">W</div>
                            
                            {/* Inner Ticks */}
                             <div className="absolute w-full h-[1px] bg-white/5"></div>
                             <div className="absolute w-[1px] h-full bg-white/5"></div>
                        </div>

                        {/* G-Force Grid Circle */}
                        <div className="relative w-[70%] h-[70%] rounded-full border border-white/10 bg-white/5 shadow-inner">
                             <div className="absolute inset-0 rounded-full border border-white/5 scale-50"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-0.5 h-0.5 bg-white/20 rounded-full"></div>
                             </div>
                             
                             {/* G-Dot */}
                             <div 
                                className="absolute w-2.5 h-2.5 bg-isuzu-red rounded-full shadow-[0_0_8px_#ff3333] transition-all duration-75 ease-linear z-10 border border-white/20"
                                style={{ 
                                    left: `${px}%`, 
                                    top: `${py}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                             ></div>
                        </div>
                    </div>
                </div>
              );
          case 'MAP':
              // Calculate progress for MapWidget
              const currentLapProgress = (history[playbackIndex]?.lapProgress || 0) % 100;
              const mainCarProgress = currentLapProgress / 100;
              
              const mapRivals = rivals.map(rival => ({
                  id: rival.id,
                  name: rival.name,
                  color: rival.color,
                  progress: (mainCarProgress + rival.offset) % 1
              }));

              return (
                  <MapWidget 
                      circuitName={circuitName}
                      activeFlag={activeFlag}
                      mainCarProgress={mainCarProgress}
                      rivals={mapRivals}
                  />
              );
          case 'CONDITIONS':
              return (
                <div className="glass-panel p-3 rounded-xl h-full flex flex-col justify-between">
                     <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                        <Cloud className="w-3 h-3" /> Conditions
                     </div>
                     <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                         <StatBox label="Air Temp" value={getVal('airTemp').toFixed(1)} unit="°C" color="text-orange-400" icon={Thermometer} />
                         <StatBox label="Humidity" value={Math.round(getVal('humidity'))} unit="%" color="text-blue-400" icon={Droplets} />
                         <StatBox label="Wind Speed" value={Math.round(getVal('windSpeed'))} unit="km/h" color="text-zinc-300" icon={Wind} />
                         <StatBox label="Pressure" value={Math.round(getVal('pressure'))} unit="hPa" color="text-zinc-300" icon={GaugeCircle} />
                     </div>
                </div>
              );
          case 'CAR_VIEW': {
              // G-Force Calculations for the embedded compass
              const gLat = getVal('gLat', 0);
              const gLong = getVal('gLong', 0);
              const heading = getVal('heading', 0);
              const maxG = 2.0;
              const cx = 50; 
              const cy = 50; 
              const px = cx + (Math.max(-maxG, Math.min(maxG, gLat)) / maxG) * 40;
              const py = cy - (Math.max(-maxG, Math.min(maxG, gLong)) / maxG) * 40;

              return (
                <div className="relative w-full h-full flex items-center justify-center group glass-panel rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/5">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-isuzu-red text-white rounded opacity-0 group-hover:opacity-100 transition-all backdrop-blur"><Upload className="w-4 h-4" /></button>
                    
                    {/* Top Overlay: Speed & RPM */}
                    <div className="absolute top-6 left-0 w-full flex flex-col items-center z-30 pointer-events-none">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black italic text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,51,51,0.5)]">
                                {Math.round(getVal('speed'))}
                            </span>
                            <span className="text-sm font-bold text-zinc-500 uppercase">km/h</span>
                        </div>
                        <div className="w-32 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-75 ${getVal('rpm') > 7000 ? 'bg-red-500' : 'bg-white'}`}
                                style={{ width: `${(getVal('rpm') / 9000) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-mono text-zinc-400 mt-1">{Math.round(getVal('rpm'))} RPM</span>
                    </div>

                    {/* Left Side: Controls & Dynamics */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-40 scale-90 origin-left">
                        {/* Steering */}
                        <div className="flex flex-col items-center relative">
                            <div className="relative w-24 h-16 flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] mb-1" style={{ transform: `rotate(${getVal('steering')}deg)`, transition: 'transform 0.05s ease-out' }}>
                                 <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="carbonFiber" x1="0%" y1="0%" x2="100%" y2="100%" spreadMethod="reflect">
                                            <stop offset="0%" stopColor="#1a1a1a" />
                                            <stop offset="25%" stopColor="#2a2a2a" />
                                            <stop offset="50%" stopColor="#111" />
                                            <stop offset="75%" stopColor="#2a2a2a" />
                                            <stop offset="100%" stopColor="#1a1a1a" />
                                        </linearGradient>
                                         <linearGradient id="alcantara" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#2a2a2a" />
                                            <stop offset="100%" stopColor="#151515" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 70 60 C 50 60 20 80 20 120 C 20 160 50 170 80 160 L 100 130 L 200 130 L 220 160 C 250 170 280 160 280 120 C 280 80 250 60 230 60 L 70 60 Z" fill="url(#carbonFiber)" stroke="#111" strokeWidth="2" />
                                    <path d="M 60 60 C 30 60 20 90 20 120 C 20 150 30 170 60 160 C 45 150 45 90 60 60" fill="url(#alcantara)" />
                                    <path d="M 240 60 C 270 60 280 90 280 120 C 280 150 270 170 240 160 C 255 150 255 90 240 60" fill="url(#alcantara)" />
                                    <path d="M 80 70 L 220 70 L 210 120 L 90 120 Z" fill="#111" stroke="#333" strokeWidth="1" />
                                    <text x="150" y="145" fontSize="10" fill="#666" textAnchor="middle" fontFamily="monospace" fontWeight="bold" letterSpacing="2">ISUZU</text>
                                 </svg>
                            </div>
                            <div className="bg-black/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur flex items-center gap-1 shadow-lg">
                                 <div className="text-[9px] font-mono font-bold text-white w-8 text-center">{Math.round(getVal('steering'))}°</div>
                            </div>
                        </div>

                        {/* Pedals (Angular & Percentages) */}
                        <div className="flex items-end justify-center gap-4 h-24">
                             {/* Brake */}
                             <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                                  <div className="h-20 w-6 bg-zinc-900/80 rounded-sm relative overflow-hidden border border-zinc-700 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                                      <div 
                                         className="absolute bottom-0 w-full bg-gradient-to-t from-red-700 via-red-600 to-red-500 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                                         style={{ height: `${getVal('brake')}%` }} 
                                      ></div>
                                      {/* Percentage Overlay */}
                                      <div className="absolute bottom-1 left-0 w-full text-center text-[9px] font-bold text-white z-10 drop-shadow-md">
                                          {Math.round(getVal('brake'))}%
                                      </div>
                                  </div>
                                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-red-500 transition-colors">BRK</div>
                             </div>
                             {/* Throttle */}
                             <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                                  <div className="h-20 w-6 bg-zinc-900/80 rounded-sm relative overflow-hidden border border-zinc-700 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                                      <div 
                                         className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 via-green-500 to-green-400 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
                                         style={{ height: `${getVal('throttle')}%` }} 
                                      ></div>
                                      {/* Percentage Overlay */}
                                      <div className="absolute bottom-1 left-0 w-full text-center text-[9px] font-bold text-white z-10 drop-shadow-md">
                                          {Math.round(getVal('throttle'))}%
                                      </div>
                                  </div>
                                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-green-500 transition-colors">ACC</div>
                             </div>
                        </div>

                        {/* Compass & G-Force */}
                        <div className="w-24 h-24 relative flex items-center justify-center opacity-90">
                             {/* Compass Ring */}
                            <div 
                                className="absolute w-full h-full rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ease-out"
                                style={{ transform: `rotate(${-heading}deg)` }}
                            >
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-isuzu-red">N</div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-600">S</div>
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-[8px] font-bold text-zinc-600">E</div>
                                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 text-[8px] font-bold text-zinc-600">W</div>
                                <div className="absolute w-full h-[1px] bg-white/5"></div>
                                <div className="absolute w-[1px] h-full bg-white/5"></div>
                            </div>

                            {/* G-Force Grid */}
                            <div className="relative w-[60%] h-[60%] rounded-full border border-white/10 bg-black/40 shadow-inner backdrop-blur-sm">
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-0.5 h-0.5 bg-white/20 rounded-full"></div>
                                 </div>
                                 <div 
                                    className="absolute w-2 h-2 bg-isuzu-red rounded-full shadow-[0_0_8px_#ff3333] transition-all duration-75 ease-linear z-10 border border-white/20"
                                    style={{ 
                                        left: `${px}%`, 
                                        top: `${py}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                 ></div>
                            </div>
                            
                            {/* Heading Text */}
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-500 whitespace-nowrap">
                                HDG {Math.round(heading)}°
                            </div>
                        </div>
                    </div>

                    {/* Right Side Data Column: Fuel, Oil, Lambda, Boost, DRS */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 pointer-events-none">
                         <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 w-20">
                            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Thermometer className="w-3 h-3" /> OIL
                            </div>
                            <div className="text-xs font-bold text-white leading-none">{Math.round(getVal('oilTemp'))}°</div>
                         </div>
                         <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 w-20">
                            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <GaugeCircle className="w-3 h-3" /> FUEL
                            </div>
                            <div className="text-xs font-bold text-white leading-none">{Math.round(getVal('fuel'))}%</div>
                         </div>
                         <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 w-20">
                            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Activity className="w-3 h-3" /> LAMBDA
                            </div>
                            <div className="text-xs font-bold text-white leading-none">{getVal('lambda').toFixed(3)}</div>
                         </div>
                         <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 w-20">
                            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3 h-3" /> BOOST
                            </div>
                            <div className="text-xs font-bold text-white leading-none">{getVal('boost').toFixed(1)}<span className="text-[7px] ml-0.5 text-zinc-500">BAR</span></div>
                         </div>
                         <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 w-20">
                            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Wind className="w-3 h-3" /> DRS
                            </div>
                            <div className={`text-xs font-black leading-none ${getVal('throttle') > 90 ? 'text-blue-400' : 'text-zinc-600'}`}>
                                {getVal('throttle') > 90 ? 'OPEN' : 'OFF'}
                            </div>
                         </div>
                    </div>

                    {/* Constrained Wrapper for Image & Overlays to maintain alignment */}
                    <div className="relative h-[90%] w-auto aspect-[1/2.2] max-w-full flex items-center justify-center">
                        <img src={carImageUrl} onError={(e) => { e.currentTarget.src = "https://placehold.co/320x600/18181b/dc2626?text=Check+Drive+Permissions"; e.currentTarget.onerror = null; }} alt="Car" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10" />
                        
                        {/* Visual Overlays - Positioned relative to the constrained wrapper */}
                        {/* Front Left */}
                        <div className="absolute top-[23%] left-[2%] w-[15%] h-[15%] bg-orange-600/60 rounded-lg blur-[15px] z-20 animate-pulse"></div>
                        {/* Front Right */}
                        <div className="absolute top-[23%] right-[2%] w-[15%] h-[15%] bg-orange-600/60 rounded-lg blur-[15px] z-20 animate-pulse"></div>
                        {/* Rear Left */}
                        <div className="absolute bottom-[28%] left-[2%] w-[20%] h-[15%] bg-red-600/60 rounded-lg blur-[15px] z-20 animate-pulse"></div>
                        {/* Rear Right */}
                        <div className="absolute bottom-[28%] right-[2%] w-[20%] h-[15%] bg-red-600/60 rounded-lg blur-[15px] z-20 animate-pulse"></div>
                        
                        {/* HUDs */}
                        <div className="absolute top-[20%] left-0 z-40"><TireHUD position="FL" side="left" temp={getVal('flTemp')} pressure={getVal('flPress')} brakeTemp={getVal('flBrake')} speed={getVal('flSpeed')} /></div>
                        <div className="absolute top-[20%] right-0 z-40"><TireHUD position="FR" side="right" temp={getVal('frTemp')} pressure={getVal('frPress')} brakeTemp={getVal('frBrake')} speed={getVal('frSpeed')} /></div>
                        <div className="absolute bottom-[25%] left-0 z-40"><TireHUD position="RL" side="left" temp={getVal('rlTemp')} pressure={getVal('rlPress')} brakeTemp={getVal('rlBrake')} tempColor="bg-red-500" brakeColor="bg-orange-500" speed={getVal('rlSpeed')} /></div>
                        <div className="absolute bottom-[25%] right-0 z-40"><TireHUD position="RR" side="right" temp={getVal('rrTemp')} pressure={getVal('rrPress')} brakeTemp={getVal('rrBrake')} tempColor="bg-red-500" brakeColor="bg-orange-500" speed={getVal('rrSpeed')} /></div>
                    </div>
                    
                    {/* Right Side Data Column */}
                </div>
              );
          }
          case 'CONTROLS':
              return <ControlTelemetry steering={getVal('steering')} throttle={getVal('throttle')} brake={getVal('brake')} />;
          case 'CAMERAS':
              return (
                <div className="h-full flex flex-col relative rounded-lg overflow-hidden bg-black group border border-white/10">
                     <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url('${getCameraUrl()}')` }}></div>
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                     
                     {/* Overlay Indicators */}
                     <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <Video className="w-3 h-3 text-zinc-400" />
                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">{activeCamera} CAM</span>
                     </div>
                     <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10 shadow-lg">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-bold text-white tracking-widest">LIVE</span>
                        </div>
                     </div>

                     {/* Selector Controls */}
                     <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2 z-20">
                         {(['FRONT', 'COCKPIT', 'REAR'] as const).map(cam => (
                             <button
                                key={cam}
                                onClick={() => setActiveCamera(cam)}
                                className={`px-3 py-1.5 rounded text-[9px] font-bold tracking-wider uppercase backdrop-blur-md transition-all border ${activeCamera === cam ? 'bg-isuzu-red text-white border-isuzu-red shadow-[0_0_10px_rgba(255,51,51,0.4)]' : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white hover:bg-black/80'}`}
                             >
                                 {cam}
                             </button>
                         ))}
                     </div>
                </div>
              );
          case 'HEART':
              return <BioChart title="HEART RATE" data={maximizedSection === 'HEART' ? history : viewData} dataKey="heartRate" min={40} max={200} color="text-[#FF3333]" stroke="#FF3333" current={Math.round(getVal('heartRate'))} unit="BPM" icon={Activity} graphType={graphType} isMaximized={maximizedSection === 'HEART'} />;
          case 'BREATH':
              return <BioChart title="RESPIRATION" data={maximizedSection === 'BREATH' ? history : viewData} dataKey="breath" min={0} max={25} color="text-blue-500" stroke="#3b82f6" current={Math.round(getVal('breath'))} unit="RPM" icon={Wind} graphType={graphType} isMaximized={maximizedSection === 'BREATH'} />;
          case 'STRESS':
              return <BioChart title="STRESS LEVEL" data={maximizedSection === 'STRESS' ? history : viewData} dataKey="stress" min={0} max={100} color="text-green-500" stroke="#22c55e" current={Math.round(getVal('stress'))} unit="" icon={Zap} graphType={graphType} isMaximized={maximizedSection === 'STRESS'} />;
          case 'CORRELATION':
              return (
                  <div className="glass-panel p-3 rounded-xl h-full flex flex-col justify-between border border-white/5 bg-[#080808]">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-zinc-500" />
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">SPEED / RPM</span>
                          </div>
                          {/* Legend */}
                          <div className="flex gap-3">
                              <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-isuzu-red shadow-[0_0_8px_#ff3333]"></div>
                                  <span className="text-[8px] text-zinc-400 font-mono">SPD</span>
                              </div>
                              <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                                  <span className="text-[8px] text-zinc-400 font-mono">RPM</span>
                              </div>
                          </div>
                      </div>
                      <div className="flex-1 w-full min-h-0 rounded-lg bg-zinc-900 border border-white/10 relative overflow-hidden">
                        {/* Background Grid - Enhanced */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        <div className="absolute inset-0 pt-2 pb-0 pl-0 pr-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={maximizedSection === 'CORRELATION' ? history : viewData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSpeedCorrelation" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF3333" stopOpacity={0.3}/> 
                                            <stop offset="95%" stopColor="#FF3333" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRpmCorrelation" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="timestamp" 
                                        tick={{fill: '#555', fontSize: 9}} 
                                        tickLine={false} 
                                        axisLine={false}
                                        minTickGap={30}
                                        height={20}
                                    />
                                    <YAxis 
                                        yAxisId="left" 
                                        domain={[0, 400]} 
                                        tick={{fill: '#FF3333', fontSize: 9}} 
                                        tickLine={false} 
                                        axisLine={false}
                                        width={30}
                                    />
                                    <YAxis 
                                        yAxisId="right" 
                                        orientation="right" 
                                        domain={[0, 15000]} 
                                        tick={{fill: '#3b82f6', fontSize: 9}} 
                                        tickLine={false} 
                                        axisLine={false}
                                        width={35}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '10px', padding: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Area 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="speed" 
                                        stroke="#FF3333" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorSpeedCorrelation)" 
                                        animationDuration={0}
                                        isAnimationActive={false}
                                    />
                                    <Area 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="rpm" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorRpmCorrelation)" 
                                        animationDuration={0}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                      </div>
                  </div>
              );
          case 'ALERTS':
              return (
                <div className="glass-panel p-4 rounded-xl flex flex-col h-full bg-[#080808] border border-white/5">
                    <h3 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-2 tracking-wider"><AlertTriangle className="w-3 h-3 text-yellow-500" /> ACTIVE ALERTS</h3>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {[{ msg: 'Front Left Brake Temp High', time: '10:42:01', level: 'warning' }, { msg: 'Gap to Car 4 decreasing', time: '10:41:45', level: 'info' }, { msg: 'Fuel Mix Strategy Update', time: '10:38:12', level: 'info' }, { msg: 'DRS Available Zone 2', time: '10:35:00', level: 'success' }].map((alert, i) => (
                            <div key={i} className="p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start"><span className={`text-[10px] font-medium leading-tight ${alert.level === 'warning' ? 'text-yellow-500' : alert.level === 'success' ? 'text-green-500' : 'text-zinc-300'}`}>{alert.msg}</span></div>
                                <span className="text-[9px] text-zinc-600 font-mono mt-0.5 block group-hover:text-zinc-500">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
              );
          case 'GAP_TIME':
              // Calculate gaps for all rivals
              const activeCar = activeRacers.find(r => r.id === activeRacerId);
              
              const rivalData = rivals.map((rival, idx) => {
                  // Generate a deterministic gap based on rival ID and playback
                  const rawGap = Math.sin(playbackIndex * 0.05 + rival.id * 0.1 + selectedLap) * 5 + (idx * 0.2);
                  return {
                      ...rival,
                      gap: rawGap,
                      gapFormatted: rawGap.toFixed(3),
                      isPos: rawGap > 0
                  };
              });

              // Add rival to list
              const handleAddRival = () => {
                  if (rivalInput && !rivalList.includes(rivalInput)) {
                      setRivalList(prev => [...prev, rivalInput]);
                      setRivalInput('');
                  }
              };

              // Remove rival from list
              const handleRemoveRival = (num: string) => {
                  setRivalList(prev => prev.filter(r => r !== num));
              };

              return (
                  <div className="glass-panel p-3 rounded-xl h-full flex flex-col relative overflow-hidden bg-[#080808] border border-white/5">
                      <div className="flex justify-between items-center mb-2 z-10">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                              <Activity className="w-3 h-3 text-zinc-500" /> GAP ANALYSIS
                          </span>
                          
                          {/* Global Lap Selector - Moved left to avoid overlap */}
                          <div className="flex items-center gap-1 bg-white/5 rounded px-1.5 py-0.5 border border-white/5 mr-8">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase">LAP</span>
                              <select 
                                  className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer appearance-none text-right w-8"
                                  value={selectedLap}
                                  onChange={(e) => setSelectedLap(Number(e.target.value))}
                              >
                                  {Array.from({ length: maxLaps }, (_, i) => i + 1).map(lap => (
                                      <option key={lap} value={lap} className="bg-black text-white">{lap}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      {/* Rival Input Control */}
                      <div className="flex flex-col gap-1 mb-2 border-b border-white/10 pb-2">
                          <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Compare with Rival #</label>
                          <div className="flex gap-2">
                              <div className="relative flex-1">
                                  <input 
                                      type="text"
                                      placeholder="Enter Car #"
                                      value={rivalInput}
                                      onChange={(e) => setRivalInput(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddRival()}
                                      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-isuzu-red transition-all"
                                  />
                                  {rivalInput && (
                                      <button 
                                          onClick={() => setRivalInput('')}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                      >
                                          <X className="w-3 h-3" />
                                      </button>
                                  )}
                              </div>
                              <button 
                                  onClick={handleAddRival}
                                  className="px-3 py-1.5 bg-isuzu-red hover:bg-red-600 text-white rounded text-[10px] font-bold transition-all flex items-center gap-1"
                              >
                                  <Plus className="w-3 h-3" /> ADD
                              </button>
                          </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                          {/* Active Car (Chosen Team) */}
                          <div className="flex flex-col gap-1">
                              <div className="text-[8px] font-bold text-zinc-600 uppercase px-1">Active Car</div>
                              <div className="flex items-center justify-between bg-isuzu-red/10 rounded p-2 border border-isuzu-red/20">
                                  <div className="flex items-center gap-2">
                                      <div className="text-xs font-mono font-black text-isuzu-red">#{activeCar?.number}</div>
                                      <div className="text-[10px] font-bold text-white">{activeCar?.name}</div>
                                  </div>
                                  <div className="text-[10px] font-mono text-zinc-400">REFERENCE</div>
                              </div>
                          </div>

                          {/* Comparison Result */}
                          <div className="flex flex-col gap-1">
                              <div className="text-[8px] font-bold text-zinc-600 uppercase px-1">Rival Comparison</div>
                              <div className="space-y-1.5">
                                  {rivalList.length > 0 ? (
                                      rivalList.map(num => {
                                          const rival = rivalData.find(r => r.number === num);
                                          return (
                                              <div key={num} className="flex items-center justify-between bg-white/5 rounded p-2 border border-white/10 group animate-in fade-in slide-in-from-top-1 duration-300">
                                                  <div className="flex items-center gap-2">
                                                      <button 
                                                          onClick={() => handleRemoveRival(num)}
                                                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded transition-all"
                                                      >
                                                          <X className="w-3 h-3" />
                                                      </button>
                                                      <div className="text-xs font-mono font-bold text-zinc-400">#{num}</div>
                                                      <div className="text-[10px] font-bold text-white">{rival?.name || 'Unknown'}</div>
                                                  </div>
                                                  {rival ? (
                                                      <div className={`text-right font-mono text-sm font-black ${rival.isPos ? 'text-red-500' : 'text-green-500'}`}>
                                                          {rival.isPos ? '+' : ''}{rival.gapFormatted}s
                                                      </div>
                                                  ) : (
                                                      <div className="text-right text-[10px] text-zinc-600 italic">Not Found</div>
                                                  )}
                                              </div>
                                          );
                                      })
                                  ) : (
                                      <div className="flex flex-col items-center justify-center py-4 bg-white/5 rounded border border-dashed border-white/10">
                                          <span className="text-[10px] text-zinc-600 italic">
                                              Enter rival car numbers above to compare
                                          </span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              );
          default: return null;
      }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPaused(true);
      setPlaybackIndex(Number(e.target.value));
  };

  const resumeLive = () => {
      setIsPaused(false);
      setPlaybackIndex(history.length - 1);
  };

  const handleLayoutChange = (newLayout: any) => {
      // Merge new layout (visible items) with hidden items from the previous layout
      const hiddenLayoutItems = layout.filter(l => hiddenWidgets.includes(l.i));
      
      const combinedLayout = [...newLayout];
      
      hiddenLayoutItems.forEach(hiddenItem => {
          if (!combinedLayout.find(l => l.i === hiddenItem.i)) {
              combinedLayout.push(hiddenItem);
          }
      });
      
      onLayoutChange(combinedLayout);
  };

  // Rec Button Visuals
  const recButtonBase = "flex items-center justify-center gap-2 px-3 py-1.5 rounded transition-all duration-300 font-bold text-xs border relative overflow-hidden";
  
  return (
    <div className={`h-full w-full p-6 flex flex-col relative transition-colors duration-500 ${editMode ? 'grid-background' : 'bg-transparent'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col mb-4 flex-shrink-0 z-10 relative">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-2xl font-light text-white tracking-tight">Telemetry Data</h2>
                <div className="flex items-center gap-3 text-zinc-500 text-xs mt-1 font-mono uppercase">
                    <span>REAL-TIME ANALYSIS</span>
                    <span className="text-zinc-700">•</span>
                    <span>SESSION 4</span>
                    <span className="text-zinc-700">|</span>
                    {isPaused ? (
                        <span className="text-yellow-500 flex items-center gap-1 font-bold"><Pause className="w-3 h-3"/> PAUSED</span>
                    ) : (
                        <span className="text-isuzu-red flex items-center gap-1 font-bold animate-pulse"><Activity className="w-3 h-3"/> LIVE</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                
                {/* UPDATED RECORDING BUTTONS */}
                {recState === 'IDLE' ? (
                    <button 
                        onClick={handleStartRacing}
                        className={`${recButtonBase} bg-green-600 border-green-500 text-white hover:bg-green-500 mr-2 shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
                    >
                        <Play className="w-3 h-3 fill-white" />
                        <span>START</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 mr-2">
                        <div className={`${recButtonBase} bg-isuzu-red border-isuzu-red text-white w-32 shadow-[0_0_20px_rgba(255,51,51,0.6)] animate-pulse`}>
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            <span>RACING {getRecordingDuration()}</span>
                        </div>
                        <button 
                            onClick={handleStopRacing}
                            className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-white/10 rounded hover:bg-zinc-700 hover:border-red-500 transition-colors"
                            title="Stop Racing"
                        >
                            <Square className="w-3 h-3 fill-red-500 text-red-500" />
                        </button>
                    </div>
                )}

                <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${editMode ? 'bg-isuzu-red text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                    {editMode ? <Check className="w-3 h-3" /> : <LayoutGrid className="w-3 h-3" />} {editMode ? 'DONE' : 'EDIT LAYOUT'}
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                
                {/* Hidden Widgets Dropdown */}
                {editMode && hiddenWidgets.length > 0 && (
                    <div className="relative group mr-4">
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-black/40 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                            <EyeOff className="w-3 h-3 text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-300 uppercase">Hidden Widgets ({hiddenWidgets.length})</span>
                            <ChevronDown className="w-3 h-3 text-zinc-500" />
                        </button>
                        
                        <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 hidden group-hover:block">
                            <div className="p-2 space-y-1">
                                {hiddenWidgets.map(id => {
                                    const widget = widgets.find(w => w.id === id);
                                    return (
                                        <button 
                                            key={id}
                                            onClick={() => setHiddenWidgets(prev => prev.filter(w => w !== id))}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded text-left transition-colors group/item"
                                        >
                                            <Eye className="w-3 h-3 text-zinc-500 group-hover/item:text-white" />
                                            <span className="text-xs text-zinc-300 group-hover/item:text-white">{widget?.title || id}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Car Selector */}
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 relative group">
                        <div className="w-2 h-2 rounded-full bg-isuzu-red animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ACTIVE VEHICLE</span>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm font-bold text-white uppercase">
                                    #{activeRacers.find(r => r.id === activeRacerId)?.number} - {activeRacers.find(r => r.id === activeRacerId)?.name || 'Unknown'}
                                </span>
                                <ChevronDown className="w-3 h-3 text-zinc-500" />
                            </div>
                        </div>
                        
                        {/* Dropdown */}
                        <select 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={activeRacerId}
                            onChange={(e) => setActiveRacerId(Number(e.target.value))}
                        >
                            {activeRacers.map(r => (
                                <option key={r.id} value={r.id}>
                                    #{r.number} - {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 min-h-0 relative mb-12 custom-scrollbar overflow-y-auto overflow-x-hidden">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={150}
            width={1200}
            margin={[16, 16]}
            isDraggable={editMode}
            isResizable={editMode}
            onLayoutChange={handleLayoutChange}
            draggableHandle={editMode ? undefined : ".drag-handle-disabled"} // Prevents drag when not in edit mode
          >
            {widgets.filter(w => !hiddenWidgets.includes(w.id)).map((widget) => (
                <MaximizableView 
                    key={widget.id} 
                    title={widget.title}
                    isMaximized={maximizedSection === widget.type}
                    onToggle={() => setMaximizedSection(maximizedSection === widget.type ? null : widget.type)}
                    onHide={() => setHiddenWidgets(prev => [...prev, widget.id])}
                    editMode={editMode}
                >
                    {renderWidgetContent(widget.type)}
                </MaximizableView>
            ))}
          </ResponsiveGridLayout>
      </div>

      {/* PLAYBACK CONTROL BAR */}
      <div className="absolute bottom-0 left-0 w-full h-16 glass-panel border-t border-white/10 bg-black/90 flex items-center px-6 gap-4 z-50">
        <button onClick={() => isPaused ? resumeLive() : setIsPaused(true)} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors flex-shrink-0">
            {isPaused ? <Play className="w-4 h-4 text-white ml-1" /> : <Pause className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono"><span>SESSION START</span><span className="text-isuzu-red">{isPaused ? "PLAYBACK PAUSED" : "LIVE FEED"}</span><span>NOW</span></div>
            <input type="range" min="0" max={Math.max(0, history.length - 1)} value={playbackIndex} onChange={handleScrub} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-isuzu-red hover:accent-red-400" />
        </div>
        <div className="text-right min-w-[80px]">
            <div className="text-xl font-mono text-white font-light">{currentPoint.timestamp || "--:--:--"}</div>
            {isPaused && (<button onClick={resumeLive} className="text-[10px] text-isuzu-red hover:text-white flex items-center justify-end gap-1 w-full mt-1"><RotateCcw className="w-3 h-3" /> RETURN TO LIVE</button>)}
        </div>
      </div>

      {/* SAVE RECORDING MODAL */}
      {saveModalOpen && (
          <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-200">
              <div className="w-full max-w-md glass-panel p-6 rounded-xl border border-white/20 shadow-2xl relative">
                  <button onClick={() => { setSaveModalOpen(false); setRecState('IDLE'); setRecordingStartTime(null); }} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                      <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-isuzu-red/20 rounded-full text-isuzu-red">
                          <Disc className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white">Save Race Data</h3>
                          <p className="text-zinc-500 text-xs">Sync telemetry and camera feeds to Cloud</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Race Name</label>
                          <input 
                              type="text" 
                              value={recordingName} 
                              onChange={(e) => setRecordingName(e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1"
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Destination Folder</label>
                            
                            {!isNewFolder ? (
                                <div className="relative mt-1">
                                    <select 
                                        value={selectedFolder}
                                        onChange={(e) => setSelectedFolder(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red appearance-none text-sm"
                                    >
                                        <option value="root">Root Drive</option>
                                        <option value="event-1">Buriram GT3 Series</option>
                                        <option value="event-2">Sepang Winter Test</option>
                                    </select>
                                    <Folder className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                            ) : (
                                 <input 
                                    type="text" 
                                    value={newFolderName} 
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="New Folder Name"
                                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1 text-sm"
                                />
                            )}
                            
                            <button 
                                onClick={() => setIsNewFolder(!isNewFolder)}
                                className="text-[10px] text-isuzu-red hover:text-white mt-1 flex items-center gap-1"
                            >
                                {isNewFolder ? 'Choose Existing' : '+ Create New Folder'}
                            </button>
                        </div>
                        <div>
                             <label className="text-[10px] uppercase font-bold text-zinc-500">Duration</label>
                             <div className="w-full bg-black/30 border border-white/5 rounded px-3 py-2 text-zinc-400 text-sm mt-1 font-mono">
                                 {getRecordingDuration()}
                             </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-3 rounded text-[10px] text-zinc-400">
                          <p className="mb-1 font-bold uppercase text-zinc-500">Content to be saved:</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                              <li>Telemetry CSV (Laps 1-3)</li>
                              <li>Front Camera MP4</li>
                              <li>Cockpit Camera MP4</li>
                              <li>Rear Camera MP4</li>
                          </ul>
                      </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                      <button 
                        onClick={handleSaveRecording}
                        className="px-6 py-2 bg-isuzu-red hover:bg-red-600 text-white font-bold rounded flex items-center gap-2 shadow-[0_0_15px_rgba(255,51,51,0.4)] transition-all"
                      >
                          <Save className="w-4 h-4" /> Save to Drive
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Engineering;