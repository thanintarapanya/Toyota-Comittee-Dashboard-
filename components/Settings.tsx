import React, { useState } from 'react';
import { CreditCard, Check, Plus, Gauge, Activity, Settings as SettingsIcon, Download } from 'lucide-react';
import { Car as CarType, Driver as DriverType } from '../types';

interface SettingsProps {
    cars: CarType[];
    setCars: (cars: CarType[]) => void;
    drivers: DriverType[];
    setDrivers: (drivers: DriverType[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ cars, setCars, drivers, setDrivers }) => {
    const [activeTab, setActiveTab] = useState<'UNITS' | 'THRESHOLDS' | 'PLAN & BILLING'>('UNITS');
    const [plan, setPlan] = useState<'BASIC' | 'PREMIUM'>('BASIC');
    
    // General State
    const [units, setUnits] = useState({ 
        speed: 'KPH', 
        temp: 'CELSIUS', 
        pressure: 'BAR',
        volume: 'LITERS',
        distance: 'METERS',
        force: 'NEWTON',
        angle: 'DEGREES',
        torque: 'NM'
    });
    const [theme, setTheme] = useState('DARK');

    // Data & Telemetry State
    const [thresholds, setThresholds] = useState({
        engineTempHigh: 110,
        oilPressureLow: 2.5,
        tireTempHigh: 100,
        fuelLow: 5
    });

    return (
        <div className="flex-1 p-8 h-full overflow-y-auto flex flex-col">
            <div className="mb-8 flex-shrink-0">
                <h2 className="text-2xl font-light text-white tracking-tight">System Configuration</h2>
                <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">VERSION 2.4.0 • ADMIN PRIVILEGES ACTIVE</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 mb-8 flex-shrink-0 overflow-x-auto">
                {['UNITS', 'THRESHOLDS', 'PLAN & BILLING'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-white border-isuzu-red' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                
                {/* UNITS TAB */}
                {activeTab === 'UNITS' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <SettingsIcon className="w-6 h-6 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Units & Display</h3>
                                    <p className="text-xs text-zinc-500">Global application preferences</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Speed Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['KPH', 'MPH'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, speed: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.speed === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Temperature Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['CELSIUS', 'FAHRENHEIT'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, temp: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.temp === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Pressure Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['BAR', 'PSI', 'KPA'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, pressure: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.pressure === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Volume / Flow Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['LITERS', 'GALLONS', 'KG/H'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, volume: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.volume === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Distance / Length Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['METERS', 'FEET', 'MM'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, distance: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.distance === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Gauge className="w-6 h-6 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Advanced Units</h3>
                                    <p className="text-xs text-zinc-500">Engineering metrics configuration</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Force / Weight Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['NEWTON', 'KGF', 'LBF'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, force: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.force === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Angle Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['DEGREES', 'RADIANS'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, angle: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.angle === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Torque Unit</label>
                                    <div className="flex gap-2 mt-1">
                                        {['NM', 'LB-FT'].map(u => (
                                            <button 
                                                key={u}
                                                onClick={() => setUnits({...units, torque: u})}
                                                className={`flex-1 py-2 rounded text-xs font-bold border ${units.torque === u ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* THRESHOLDS TAB */}
                {activeTab === 'THRESHOLDS' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <div className="glass-panel p-6 rounded-xl space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Activity className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Alert Thresholds</h3>
                                        <p className="text-xs text-zinc-500">Warning triggers for telemetry</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Engine Temp High Warning</label>
                                            <span className="text-xs font-mono text-isuzu-red">{thresholds.engineTempHigh}°C</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="90" max="130" 
                                            value={thresholds.engineTempHigh}
                                            onChange={(e) => setThresholds({...thresholds, engineTempHigh: Number(e.target.value)})}
                                            className="w-full accent-isuzu-red h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Oil Pressure Low Warning</label>
                                            <span className="text-xs font-mono text-isuzu-red">{thresholds.oilPressureLow} Bar</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" max="5" step="0.1"
                                            value={thresholds.oilPressureLow}
                                            onChange={(e) => setThresholds({...thresholds, oilPressureLow: Number(e.target.value)})}
                                            className="w-full accent-isuzu-red h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Tire Temp High Warning</label>
                                            <span className="text-xs font-mono text-isuzu-red">{thresholds.tireTempHigh}°C</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="80" max="120" 
                                            value={thresholds.tireTempHigh}
                                            onChange={(e) => setThresholds({...thresholds, tireTempHigh: Number(e.target.value)})}
                                            className="w-full accent-isuzu-red h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Fuel Low Warning</label>
                                            <span className="text-xs font-mono text-isuzu-red">{thresholds.fuelLow} L</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" max="20" 
                                            value={thresholds.fuelLow}
                                            onChange={(e) => setThresholds({...thresholds, fuelLow: Number(e.target.value)})}
                                            className="w-full accent-isuzu-red h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PLAN & BILLING TAB */}
                {activeTab === 'PLAN & BILLING' && (
                    <div className="space-y-8">
                        {/* Subscription Plan */}
                        <div className="glass-panel p-8 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Subscription Plan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Plan */}
                                <div 
                                    onClick={() => setPlan('BASIC')}
                                    className={`relative p-8 rounded-xl border-2 cursor-pointer transition-all ${
                                        plan === 'BASIC' 
                                        ? 'border-isuzu-red bg-white/5' 
                                        : 'border-white/10 bg-black/20 hover:border-white/20'
                                    }`}
                                >
                                    {plan === 'BASIC' && (
                                        <div className="absolute top-4 right-4 text-isuzu-red">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    )}
                                    <h4 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-4">Basic</h4>
                                    <div className="mb-2">
                                        <span className="text-5xl font-bold text-white">$0</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-8">Per Month</p>
                                    <div className="text-center">
                                        {plan === 'BASIC' ? (
                                            <span className="text-sm font-bold text-isuzu-red">CURRENT PLAN</span>
                                        ) : (
                                            <span className="text-sm font-bold text-zinc-500 group-hover:text-white">CLICK TO SELECT</span>
                                        )}
                                    </div>
                                </div>

                                {/* Premium Plan */}
                                <div 
                                    onClick={() => setPlan('PREMIUM')}
                                    className={`relative p-8 rounded-xl border-2 cursor-pointer transition-all ${
                                        plan === 'PREMIUM' 
                                        ? 'border-isuzu-red bg-white/5' 
                                        : 'border-white/10 bg-black/20 hover:border-white/20'
                                    }`}
                                >
                                    {plan === 'PREMIUM' && (
                                        <div className="absolute top-4 right-4 text-isuzu-red">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    )}
                                    <h4 className="text-sm font-bold text-zinc-400 tracking-widest uppercase mb-4">Premium</h4>
                                    <div className="mb-2">
                                        <span className="text-5xl font-bold text-white">$299</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-8">Per Month</p>
                                    <div className="text-center">
                                        {plan === 'PREMIUM' ? (
                                            <span className="text-sm font-bold text-isuzu-red">CURRENT PLAN</span>
                                        ) : (
                                            <span className="text-sm font-bold text-zinc-500 group-hover:text-white">CLICK TO SELECT</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="glass-panel p-8 rounded-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Payment Methods</h3>
                                <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors">
                                    <Plus className="w-4 h-4" /> Add Card
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-white/10">
                                            <CreditCard className="w-5 h-5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Visa ending in 4242</div>
                                            <div className="text-xs text-zinc-500">Expires 12/2025</div>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">Default</span>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-white/10">
                                            <CreditCard className="w-5 h-5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Mastercard ending in 8899</div>
                                            <div className="text-xs text-zinc-500">Expires 09/2024</div>
                                        </div>
                                    </div>
                                    <button className="text-xs text-zinc-500 hover:text-white transition-colors">Remove</button>
                                </div>
                            </div>
                        </div>

                        {/* Billing History */}
                        <div className="glass-panel p-8 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Billing History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-[10px] text-zinc-500 uppercase tracking-wider">
                                            <th className="pb-4 pl-2">Date</th>
                                            <th className="pb-4">Invoice ID</th>
                                            <th className="pb-4">Amount</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4 text-right pr-2">Download</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {[
                                            { date: 'Oct 01, 2023', id: 'INV-2023-001', amount: '$299.00', status: 'Paid' },
                                            { date: 'Sep 01, 2023', id: 'INV-2023-002', amount: '$299.00', status: 'Paid' },
                                            { date: 'Aug 01, 2023', id: 'INV-2023-003', amount: '$299.00', status: 'Paid' },
                                        ].map((invoice, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 pl-2 text-white">{invoice.date}</td>
                                                <td className="py-4 text-zinc-400 font-mono">{invoice.id}</td>
                                                <td className="py-4 text-white font-bold">{invoice.amount}</td>
                                                <td className="py-4">
                                                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right pr-2">
                                                    <button className="text-zinc-500 hover:text-white transition-colors">
                                                        <Download className="w-4 h-4 ml-auto" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;