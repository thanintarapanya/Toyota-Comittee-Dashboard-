import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Shield, Play, Pause, RotateCcw, Search, AlertTriangle, Zap, Gauge, Activity, Wind, Droplets, ArrowDownWideNarrow, ArrowUpWideNarrow, SortAsc, SortDesc, ChevronDown, ChevronUp } from 'lucide-react';
import { Car, Driver, FileItem, CarTelemetry, Thresholds } from '../types';

interface TelemetryProps {
    cars: Car[];
    drivers: Driver[];
    setFiles?: React.Dispatch<React.SetStateAction<FileItem[]>>;
    layout: any[];
    onLayoutChange: (layout: any[]) => void;
    telemetryData: CarTelemetry[];
    onCarSelect: (carId: number) => void;
    thresholds: Thresholds;
    graphConfig?: Record<string, any>;
}

interface MetricStats {
    min: number;
    max: number;
}

interface AggregatedCarData {
    stats: {
        speed: MetricStats;
        rpm: MetricStats;
        fuelFlow: MetricStats;
        fuelPressure: MetricStats;
        throttle: MetricStats;
        ignitionTiming: MetricStats;
        airflow: MetricStats;
        lambda: MetricStats;
    };
    violations: {
        speed: number;
        rpm: number;
        fuelFlow: number;
        fuelPressure: number;
        throttle: number;
        ignitionTiming: number;
        airflow: number;
        lambda: number;
    };
}

const Overview: React.FC<TelemetryProps> = ({ cars: initialCars, drivers, telemetryData, onCarSelect, thresholds, graphConfig }) => {
    // We maintain a local aggregation state to track accumulated stats (min/max/violations)
    // independent of the ephemeral `telemetryData` prop.
    const [aggregatedData, setAggregatedData] = useState<Record<number, AggregatedCarData>>({});
    
    const [searchTerm, setSearchTerm] = useState('');
    
    // Sort Configuration
    const [sortConfig, setSortConfig] = useState<{
        key: 'VIOLATION' | 'NUMBER' | 'RANKING';
        order: 'ASC' | 'DESC';
    }>({ key: 'RANKING', order: 'ASC' });

    const breachStateRef = useRef<Record<string, boolean>>({});

    // --- Data Aggregation Logic with Dynamic Anomaly Detection ---
    useEffect(() => {
        if (telemetryData.length === 0) return;

        // 1. Calculate Live Averages for this frame
        const count = telemetryData.length;
        const sums = telemetryData.reduce((acc, car) => ({
            speed: acc.speed + car.speed,
            rpm: acc.rpm + car.rpm,
            fuelFlow: acc.fuelFlow + car.fuelFlow,
            fuelPressure: acc.fuelPressure + car.fuelPressure,
            throttle: acc.throttle + car.throttle,
            ignitionTiming: acc.ignitionTiming + car.ignitionTiming,
            airflow: acc.airflow + car.airflow,
            lambda: acc.lambda + car.lambda
        }), { speed: 0, rpm: 0, fuelFlow: 0, fuelPressure: 0, throttle: 0, ignitionTiming: 0, airflow: 0, lambda: 0 });

        const avgs = {
            speed: sums.speed / count,
            rpm: sums.rpm / count,
            fuelFlow: sums.fuelFlow / count,
            fuelPressure: sums.fuelPressure / count,
            throttle: sums.throttle / count,
            ignitionTiming: sums.ignitionTiming / count,
            airflow: sums.airflow / count,
            lambda: sums.lambda / count
        };

        const sensitivityFactor = 1 + (thresholds.sensitivity / 100); // e.g. 1.08

        setAggregatedData(prev => {
            const next = { ...prev };
            
            telemetryData.forEach(car => {
                const prevCar = next[car.id] || {
                    stats: {
                        speed: { min: car.speed, max: car.speed },
                        rpm: { min: car.rpm, max: car.rpm },
                        fuelFlow: { min: car.fuelFlow, max: car.fuelFlow },
                        fuelPressure: { min: car.fuelPressure, max: car.fuelPressure },
                        throttle: { min: car.throttle, max: car.throttle },
                        ignitionTiming: { min: car.ignitionTiming, max: car.ignitionTiming },
                        airflow: { min: car.airflow, max: car.airflow },
                        lambda: { min: car.lambda, max: car.lambda }
                    },
                    violations: { speed: 0, rpm: 0, fuelFlow: 0, fuelPressure: 0, throttle: 0, ignitionTiming: 0, airflow: 0, lambda: 0 }
                };

                // Update Min/Max
                const updateStat = (stat: MetricStats, val: number) => ({
                    min: Math.min(stat.min, val),
                    max: Math.max(stat.max, val)
                });

                const newStats = {
                    speed: updateStat(prevCar.stats.speed, car.speed),
                    rpm: updateStat(prevCar.stats.rpm, car.rpm),
                    fuelFlow: updateStat(prevCar.stats.fuelFlow, car.fuelFlow),
                    fuelPressure: updateStat(prevCar.stats.fuelPressure, car.fuelPressure),
                    throttle: updateStat(prevCar.stats.throttle, car.throttle),
                    ignitionTiming: updateStat(prevCar.stats.ignitionTiming, car.ignitionTiming),
                    airflow: updateStat(prevCar.stats.airflow, car.airflow),
                    lambda: updateStat(prevCar.stats.lambda, car.lambda)
                };

                // Update Violations - USING GLOBAL THRESHOLDS
                const newViolations = { ...prevCar.violations };
                
                const checkBreach = (metric: string, val: number, threshold: number, ignoreAlert: boolean = false) => {
                    const key = `${car.id}-${metric}`;
                    if (!ignoreAlert && val > threshold) {
                        if (!breachStateRef.current[key]) {
                            breachStateRef.current[key] = true;
                            // @ts-ignore
                            newViolations[metric]++;
                        }
                    } else {
                        breachStateRef.current[key] = false;
                    }
                };

                checkBreach('speed', car.speed, thresholds.speed);
                checkBreach('rpm', car.rpm, thresholds.rpm);
                checkBreach('fuelFlow', car.fuelFlow, thresholds.fuelFlow);
                
                let fuelPressureIgnore = false;
                if (graphConfig?.fuelPressure?.filter) {
                    const filter = graphConfig.fuelPressure.filter;
                    const paramVal = (car as any)[filter.parameter] || 0;
                    if (filter.condition === 'greater' && paramVal <= filter.value) fuelPressureIgnore = true;
                    if (filter.condition === 'equal_lower' && paramVal > filter.value) fuelPressureIgnore = true;
                }
                checkBreach('fuelPressure', car.fuelPressure, thresholds.fuelPressure, fuelPressureIgnore);
                
                checkBreach('throttle', car.throttle, thresholds.throttle);
                checkBreach('ignitionTiming', car.ignitionTiming, thresholds.ignitionTiming);
                checkBreach('airflow', car.airflow, thresholds.airflow);
                
                let lambdaThreshold = thresholds.lambda;
                let lambdaIgnore = false;
                if (graphConfig?.lambda?.thresholds) {
                    const matched = graphConfig.lambda.thresholds.find((t: any) => car.throttle >= t.minThrottle && car.throttle <= t.maxThrottle);
                    if (matched) lambdaThreshold = matched.value;
                }
                if (graphConfig?.lambda?.filters) {
                    for (const filter of graphConfig.lambda.filters) {
                        const paramVal = (car as any)[filter.parameter] || 0;
                        if (filter.condition === 'greater' && paramVal <= filter.value) lambdaIgnore = true;
                        if (filter.condition === 'equal_lower' && paramVal > filter.value) lambdaIgnore = true;
                    }
                }
                checkBreach('lambda', car.lambda, lambdaThreshold, lambdaIgnore);
                
                next[car.id] = {
                    stats: newStats,
                    violations: newViolations
                };
            });
            return next;
        });
    }, [telemetryData, thresholds]);

    const handleReset = () => {
        setAggregatedData({});
    };

    // --- Merging & Sorting ---
    const displayCars = useMemo(() => {
        // Calculate Live Averages again for "Current Frame" Suspicion Status (Visual Red Border)
        // We use the same logic as aggregation to keep it consistent
        const count = telemetryData.length;
        let avgs = { speed: 0, rpm: 0, fuelFlow: 0, fuelPressure: 0, throttle: 0, ignitionTiming: 0, airflow: 0, lambda: 0 };
        if (count > 0) {
            const sums = telemetryData.reduce((acc, car) => ({
                speed: acc.speed + car.speed,
                rpm: acc.rpm + car.rpm,
                fuelFlow: acc.fuelFlow + car.fuelFlow,
                fuelPressure: acc.fuelPressure + car.fuelPressure,
                throttle: acc.throttle + car.throttle,
                ignitionTiming: acc.ignitionTiming + car.ignitionTiming,
                airflow: acc.airflow + car.airflow,
                lambda: acc.lambda + car.lambda
            }), { speed: 0, rpm: 0, fuelFlow: 0, fuelPressure: 0, throttle: 0, ignitionTiming: 0, airflow: 0, lambda: 0 });
            avgs = {
                speed: sums.speed / count,
                rpm: sums.rpm / count,
                fuelFlow: sums.fuelFlow / count,
                fuelPressure: sums.fuelPressure / count,
                throttle: sums.throttle / count,
                ignitionTiming: sums.ignitionTiming / count,
                airflow: sums.airflow / count,
                lambda: sums.lambda / count
            };
        }

        const sensitivityFactor = 1 + (thresholds.sensitivity / 100);

        // Calculate Ranking based on distance (descending)
        const rankedByDistance = [...telemetryData].sort((a, b) => b.distance - a.distance);

        const merged = telemetryData.map(car => {
            const agg = aggregatedData[car.id];
            const driver = drivers.find(d => d.carId === car.id);
            const team = car.id % 2 === 0 ? 'TGR' : 'PVT';
            const ranking = rankedByDistance.findIndex(r => r.id === car.id) + 1;
            
            const stats = agg?.stats || {
                speed: { min: 0, max: 0 },
                rpm: { min: 0, max: 0 },
                fuelFlow: { min: 0, max: 0 },
                fuelPressure: { min: 0, max: 0 },
                throttle: { min: 0, max: 0 },
                ignitionTiming: { min: 0, max: 0 },
                airflow: { min: 0, max: 0 },
                lambda: { min: 0, max: 0 }
            };

            const violations = agg?.violations || { speed: 0, rpm: 0, fuelFlow: 0, fuelPressure: 0, throttle: 0, ignitionTiming: 0, airflow: 0, lambda: 0 };
            // FIX: Explicitly cast to number[] to handle cases where Object.values inference results in 'unknown' types during addition
            const suspicionScore = (Object.values(violations) as number[]).reduce((a, b) => a + b, 0);

            // Live Anomaly Check for Yellow Border
            let isAnomalous = false;
            const metrics = ['speed', 'rpm', 'fuelFlow', 'fuelPressure', 'throttle', 'ignitionTiming', 'airflow', 'lambda'];
            for (const metric of metrics) {
                if (breachStateRef.current[`${car.id}-${metric}`]) {
                    isAnomalous = true;
                    break;
                }
            }

            return {
                ...car,
                driverName: driver ? driver.name : `Driver ${car.id}`,
                team,
                ranking,
                stats,
                violations,
                suspicionScore,
                isSuspicious: isAnomalous // Based on active breach
            };
        });

        // Filter
        let filtered = merged;
        if (searchTerm) {
            filtered = filtered.filter(c => c.number.includes(searchTerm) || c.driverName.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort
        return filtered.sort((a, b) => {
            if (sortConfig.key === 'VIOLATION') {
                return sortConfig.order === 'DESC' 
                    ? b.suspicionScore - a.suspicionScore 
                    : a.suspicionScore - b.suspicionScore;
            } else if (sortConfig.key === 'RANKING') {
                return sortConfig.order === 'ASC' 
                    ? a.ranking - b.ranking 
                    : b.ranking - a.ranking;
            } else {
                // Number sort
                const numA = parseInt(a.number, 10);
                const numB = parseInt(b.number, 10);
                return sortConfig.order === 'DESC' ? numB - numA : numA - numB;
            }
        });

    }, [telemetryData, aggregatedData, drivers, searchTerm, sortConfig, thresholds.sensitivity]);

    // Stats for Header
    const totalViolations = displayCars.reduce((acc, c) => acc + c.suspicionScore, 0);
    const suspects = displayCars.filter(c => c.isSuspicious).length;

    // --- Sort Handlers ---
    const toggleViolationSort = () => {
        if (sortConfig.key === 'VIOLATION') {
            setSortConfig({ key: 'VIOLATION', order: sortConfig.order === 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setSortConfig({ key: 'VIOLATION', order: 'DESC' });
        }
    };

    const toggleNumberSort = () => {
        if (sortConfig.key === 'NUMBER') {
            setSortConfig({ key: 'NUMBER', order: sortConfig.order === 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setSortConfig({ key: 'NUMBER', order: 'ASC' });
        }
    };

    const toggleRankingSort = () => {
        if (sortConfig.key === 'RANKING') {
            setSortConfig({ key: 'RANKING', order: sortConfig.order === 'ASC' ? 'DESC' : 'ASC' });
        } else {
            setSortConfig({ key: 'RANKING', order: 'ASC' });
        }
    };

    return (
        <div className="h-full flex flex-col p-4 bg-zinc-950 text-white overflow-hidden">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Investigation Unit</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{suspects} ANOMALIES</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{totalViolations} VIOLATIONS</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    
                    {/* Sort Controls */}
                    <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-white/10">
                         <button 
                            onClick={toggleViolationSort}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${sortConfig.key === 'VIOLATION' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                             <AlertTriangle className="w-3 h-3" /> 
                             Violations 
                             {sortConfig.key === 'VIOLATION' && (sortConfig.order === 'DESC' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                         </button>
                         <button 
                            onClick={toggleNumberSort}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${sortConfig.key === 'NUMBER' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                             <span className="text-[10px] font-black italic">#</span> 
                             Car No.
                             {sortConfig.key === 'NUMBER' && (sortConfig.order === 'DESC' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                         </button>
                         <button 
                            onClick={toggleRankingSort}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${sortConfig.key === 'RANKING' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                             <SortAsc className="w-3 h-3" /> 
                             Ranking
                             {sortConfig.key === 'RANKING' && (sortConfig.order === 'DESC' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                         </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-isuzu-red outline-none w-48 transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleReset}
                        className="p-2 bg-zinc-900/50 border border-white/10 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                        title="Reset Session Stats"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* MAIN GRID - Responsive Columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 content-start overflow-y-auto pr-1">
                {displayCars.map(car => (
                    <div 
                        key={car.id} 
                        onClick={() => onCarSelect(car.id)}
                        className={`
                            h-[120px] lg:h-[140px] 2xl:h-[160px] flex rounded-lg border transition-all duration-300 relative overflow-hidden cursor-pointer
                            ${car.isSuspicious 
                                ? 'bg-isuzu-red/5 border-isuzu-red/40 shadow-[0_0_10px_rgba(255,0,0,0.05)]' 
                                : 'bg-zinc-900/30 border-white/5 hover:border-white/20 hover:bg-zinc-900/50'
                            }
                        `}
                    >
                        {/* Alert Indicator */}
                        {car.isSuspicious && <div className="absolute top-0 right-0 w-3 h-3 bg-isuzu-red rounded-bl shadow-[0_0_5px_red] animate-pulse"></div>}

                        {/* LEFT: Identity (25% width) */}
                        <div className="w-16 lg:w-20 2xl:w-24 flex flex-col items-center justify-center border-r border-white/5 bg-black/20 flex-shrink-0">
                            <span className={`text-2xl lg:text-3xl 2xl:text-4xl font-black italic tracking-tighter ${car.isSuspicious ? 'text-isuzu-red' : 'text-zinc-600'}`}>
                                {car.number}
                            </span>
                            <span className="text-[10px] lg:text-xs 2xl:text-sm font-black text-white mt-1">
                                P{car.ranking}
                            </span>
                            <span className="text-[9px] lg:text-[10px] 2xl:text-xs font-bold text-zinc-500 truncate max-w-[50px] lg:max-w-[70px] text-center mt-0.5">
                                {car.driverName.split(' ').pop()}
                            </span>
                        </div>

                        {/* RIGHT: Stats Grid (75% width) */}
                        <div className="flex-1 grid grid-cols-[1fr_45px] gap-x-2 gap-y-[0.5px] p-1.5 items-center">
                            
                            {/* Row 1: Fuel Pressure */}
                            <DataRow label="FPR" max={car.stats.fuelPressure.max} min={car.stats.fuelPressure.min} icon={Droplets} isFloat />
                            <StreakRow count={car.violations.fuelPressure} />

                            {/* Row 2: Throttle */}
                            <DataRow label="THR" max={car.stats.throttle.max} min={car.stats.throttle.min} icon={Zap} />
                            <StreakRow count={car.violations.throttle} />

                            {/* Row 3: Ignition Timing */}
                            <DataRow label="IGN" max={car.stats.ignitionTiming.max} min={car.stats.ignitionTiming.min} icon={Activity} />
                            <StreakRow count={car.violations.ignitionTiming} />

                            {/* Row 4: Lambda */}
                            <DataRow label="LMB" max={car.stats.lambda.max} min={car.stats.lambda.min} icon={Activity} isFloat />
                            <StreakRow count={car.violations.lambda} />

                            {/* Row 5: Airflow */}
                            <DataRow label="AIR" max={car.stats.airflow.max} min={car.stats.airflow.min} icon={Wind} />
                            <StreakRow count={car.violations.airflow} />

                            {/* Row 6: Speed */}
                            <DataRow label="SPD" max={car.stats.speed.max} min={car.stats.speed.min} icon={Zap} />
                            <StreakRow count={car.violations.speed} />

                            {/* Row 7: RPM */}
                            <DataRow label="RPM" max={car.stats.rpm.max} min={car.stats.rpm.min} icon={Gauge} />
                            <StreakRow count={car.violations.rpm} />

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Sub Components ---

const DataRow = ({ label, max, min, icon: Icon, isFloat }: { label: string, max: number, min: number, icon: any, isFloat?: boolean }) => (
    <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 w-10 lg:w-12 flex-shrink-0">
            <Icon className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-zinc-600" />
            <span className="text-[9px] lg:text-[10px] 2xl:text-xs font-bold text-zinc-500">{label}</span>
        </div>
        <div className="flex-1 flex items-baseline justify-end gap-1">
             <span className="text-[10px] lg:text-xs 2xl:text-sm font-mono text-white leading-none">{isFloat ? max.toFixed(1) : Math.round(max)}</span>
             <span className="text-[8px] lg:text-[10px] text-zinc-700">/</span>
             <span className="text-[9px] lg:text-[10px] 2xl:text-xs font-mono text-zinc-500 leading-none">{isFloat ? min.toFixed(1) : Math.round(min)}</span>
        </div>
    </div>
);

const StreakRow = ({ count }: { count: number }) => (
    <div className={`flex items-center justify-center h-[12px] lg:h-[14px] 2xl:h-[16px] rounded-sm transition-colors ${count > 0 ? 'bg-yellow-500' : 'bg-white/5'}`}>
        {count > 0 ? (
            <span className="text-[9px] lg:text-[10px] 2xl:text-xs font-black text-black leading-none">{count}</span>
        ) : (
            <span className="text-[8px] lg:text-[9px] text-zinc-700">-</span>
        )}
    </div>
);

export default Overview;