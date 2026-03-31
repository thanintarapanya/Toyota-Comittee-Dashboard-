import React, { useState } from 'react';
import { Shield, Users, Car, Plus, Trash2, Pencil, X, Save, Calendar, MapPin, LineChart, Settings as SettingsIcon } from 'lucide-react';
import { Car as CarType, Driver as DriverType } from '../types';

interface AdministrationProps {
    cars: CarType[];
    setCars: (cars: CarType[]) => void;
    drivers: DriverType[];
    setDrivers: (drivers: DriverType[]) => void;
    graphConfig: Record<string, any>;
    setGraphConfig: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    eventName: string;
    setEventName: (name: string) => void;
    trackName: string;
    setTrackName: (name: string) => void;
    sessionType: string;
    setSessionType: (type: string) => void;
    eventDate: string;
    setEventDate: (date: string) => void;
    raceSeries: string;
    setRaceSeries: (series: string) => void;
}

const Administration: React.FC<AdministrationProps> = ({ 
    cars, setCars, drivers, setDrivers, graphConfig, setGraphConfig,
    eventName, setEventName, trackName, setTrackName, sessionType, setSessionType,
    eventDate, setEventDate, raceSeries, setRaceSeries
}) => {
    const [activeTab, setActiveTab] = useState<'EVENT' | 'GARAGE' | 'THRESHOLDS'>('EVENT');

    const [activeSettings, setActiveSettings] = useState<string | null>(null);

    const configParameters = [
        { key: 'speed', label: 'Speed', unit: 'KPH', min: 200, max: 400, step: 10 },
        { key: 'rpm', label: 'RPM', unit: 'RPM', min: 5000, max: 12000, step: 500 },
        { key: 'fuelPressure', label: 'Fuel Pressure', unit: 'BAR', min: 5, max: 20, step: 1 },
        { key: 'throttle', label: 'Throttle', unit: '%', min: 50, max: 100, step: 5 },
        { key: 'ignitionTiming', label: 'Ignition Timing', unit: '°', min: 20, max: 60, step: 2 },
        { key: 'lambda', label: 'Lambda', unit: 'λ', min: 1.0, max: 1.5, step: 0.05 },
        { key: 'airflow', label: 'Airflow', unit: 'g/s', min: 300, max: 600, step: 20 },
        { key: 'gForce', label: 'G-Force', unit: 'G', min: 1, max: 5, step: 0.1 },
        { key: 'coolantTemp', label: 'Coolant Temperature', unit: '°C', min: 80, max: 150, step: 1 },
        { key: 'airTemp', label: 'Air Temperature', unit: '°C', min: 20, max: 100, step: 1 }
    ];

    // Mock Users
    const [users, setUsers] = useState([
        { id: 1, name: 'Hiroshi T.', role: 'Chief Engineer', access: 'Admin' },
        { id: 2, name: 'Sarah L.', role: 'Data Analyst', access: 'Read-Only' },
    ]);

    // Car Management State
    const [newCarModel, setNewCarModel] = useState('');
    const [newCarNumber, setNewCarNumber] = useState('');
    const [editingCarId, setEditingCarId] = useState<number | null>(null);
    const [editModel, setEditModel] = useState('');
    const [editNumber, setEditNumber] = useState('');

    const [newDriverName, setNewDriverName] = useState('');

    const handleAddCar = () => {
        if(newCarModel && newCarNumber) {
            setCars([...cars, { 
                id: Date.now(), 
                model: newCarModel, 
                number: newCarNumber, 
                status: 'Setup' 
            }]);
            setNewCarModel('');
            setNewCarNumber('');
        }
    };

    const startEditCar = (car: CarType) => {
        setEditingCarId(car.id);
        setEditModel(car.model);
        setEditNumber(car.number);
    };

    const saveEditCar = () => {
        if (editingCarId) {
            setCars(cars.map(c => c.id === editingCarId ? { ...c, model: editModel, number: editNumber } : c));
            setEditingCarId(null);
        }
    };

    return (
        <div className="flex-1 p-8 h-full overflow-y-auto flex flex-col">
            <div className="mb-8 flex-shrink-0">
                <h2 className="text-2xl font-light text-white tracking-tight">Administration</h2>
                <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">Manage Event and Garage Settings</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 mb-8 flex-shrink-0 overflow-x-auto">
                {['EVENT', 'GARAGE', 'THRESHOLDS'].map((tab) => (
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
                
                {/* EVENT TAB */}
                {activeTab === 'EVENT' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Calendar className="w-6 h-6 text-isuzu-red" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Event Details</h3>
                                    <p className="text-xs text-zinc-500">Session configuration</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Event Name</label>
                                    <input 
                                        type="text" 
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Event Date</label>
                                    <input 
                                        type="date" 
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Race Series</label>
                                    <select 
                                        value={raceSeries}
                                        onChange={(e) => setRaceSeries(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1 appearance-none"
                                    >
                                        <option value="Vios">Vios</option>
                                        <option value="Altis">Altis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Track Selection</label>
                                    <div className="relative mt-1">
                                        <select 
                                            value={trackName}
                                            onChange={(e) => setTrackName(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red appearance-none"
                                        >
                                            <option>Buriram International Circuit</option>
                                            <option>Sepang International Circuit</option>
                                            <option>Suzuka Circuit</option>
                                            <option>Fuji Speedway</option>
                                        </select>
                                        <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Session Type</label>
                                    <select 
                                        value={sessionType}
                                        onChange={(e) => setSessionType(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-isuzu-red mt-1 appearance-none"
                                    >
                                        <option value="PRACTICE">Practice (FP1/FP2)</option>
                                        <option value="QUALIFYING">Qualifying (Q1/Q2/Q3)</option>
                                        <option value="RACE">Race</option>
                                        <option value="TEST">Private Testing</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GARAGE TAB */}
                {activeTab === 'GARAGE' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            {/* Garage / Cars */}
                            <div className="glass-panel p-6 rounded-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Car className="w-6 h-6 text-isuzu-red" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Garage Management</h3>
                                            <p className="text-xs text-zinc-500">Manage vehicle telemetry endpoints</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Car Form */}
                                <div className="bg-white/5 p-4 rounded-lg mb-6 flex gap-2 items-center">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-zinc-500 uppercase font-bold pl-1">Car Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 04"
                                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-isuzu-red mt-1"
                                            value={newCarNumber}
                                            onChange={(e) => setNewCarNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-[3]">
                                        <label className="text-[10px] text-zinc-500 uppercase font-bold pl-1">Car Model</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Isuzu D-Max 2024 Proto"
                                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-isuzu-red mt-1"
                                            value={newCarModel}
                                            onChange={(e) => setNewCarModel(e.target.value)}
                                        />
                                    </div>
                                    <div className="self-end">
                                        <button 
                                            onClick={handleAddCar}
                                            disabled={!newCarModel || !newCarNumber}
                                            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-4 py-1.5 rounded text-xs flex items-center gap-1 h-[30px]"
                                        >
                                            <Plus className="w-3 h-3" /> Add Car
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {cars.map(car => (
                                        <div key={car.id} className="bg-black/20 border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-white/20 transition-colors relative">
                                            {editingCarId === car.id ? (
                                                <div className="flex-1 flex gap-2 items-center">
                                                    <input 
                                                        value={editNumber} 
                                                        onChange={e => setEditNumber(e.target.value)}
                                                        className="w-12 bg-black border border-isuzu-red rounded px-1 py-1 text-center text-sm font-bold"
                                                    />
                                                    <input 
                                                        value={editModel} 
                                                        onChange={e => setEditModel(e.target.value)}
                                                        className="flex-1 bg-black border border-isuzu-red rounded px-2 py-1 text-sm"
                                                    />
                                                    <button onClick={saveEditCar} className="p-1 text-green-500 hover:bg-white/10 rounded"><Save className="w-4 h-4"/></button>
                                                    <button onClick={() => setEditingCarId(null)} className="p-1 text-zinc-500 hover:bg-white/10 rounded"><X className="w-4 h-4"/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center text-xl font-black italic text-zinc-700 group-hover:text-isuzu-red transition-colors">
                                                            {car.number}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{car.model}</div>
                                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${car.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                                                {car.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => startEditCar(car)}
                                                            className="p-2 text-zinc-600 hover:text-white transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setCars(cars.filter(c => c.id !== car.id))}
                                                            className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Drivers & Mapping */}
                            <div className="glass-panel p-6 rounded-xl">
                                    <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Shield className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Driver Mapping</h3>
                                            <p className="text-xs text-zinc-500">Assign drivers to vehicles</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Driver Name"
                                            className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-isuzu-red"
                                            value={newDriverName}
                                            onChange={(e) => setNewDriverName(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => {
                                                if(newDriverName) {
                                                    setDrivers([...drivers, { id: Date.now(), name: newDriverName, carId: cars[0]?.id, license: 'Pending' }]);
                                                    setNewDriverName('');
                                                }
                                            }}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[10px] text-zinc-500 uppercase tracking-wider">
                                                <th className="py-3 pl-2">Driver</th>
                                                <th className="py-3">License</th>
                                                <th className="py-3">Assigned Vehicle</th>
                                                <th className="py-3 text-right pr-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {drivers.map(driver => (
                                                <tr key={driver.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 pl-2 font-medium text-white">{driver.name}</td>
                                                    <td className="py-3 text-zinc-400 font-mono text-xs">{driver.license}</td>
                                                    <td className="py-3">
                                                        <select 
                                                            value={driver.carId}
                                                            onChange={(e) => {
                                                                const newCarId = Number(e.target.value);
                                                                setDrivers(drivers.map(d => d.id === driver.id ? { ...d, carId: newCarId } : d));
                                                            }}
                                                            className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-isuzu-red"
                                                        >
                                                            {cars.map(c => (
                                                                <option key={c.id} value={c.id}>{c.number} - {c.model}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 text-right pr-2">
                                                        <button 
                                                            onClick={() => setDrivers(drivers.filter(d => d.id !== driver.id))}
                                                            className="text-zinc-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Team Access - Moved to Garage Tab */}
                        <div className="lg:col-span-4">
                            <div className="glass-panel p-6 rounded-xl">
                                    <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-zinc-400" />
                                        <h3 className="text-sm font-bold text-white">Team Access</h3>
                                    </div>
                                    <button className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors">
                                        + Invite
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {users.map(u => (
                                        <div key={u.id} className="flex justify-between items-center p-2 rounded hover:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{u.name.charAt(0)}</div>
                                                <div>
                                                    <div className="text-sm text-white">{u.name}</div>
                                                    <div className="text-[10px] text-zinc-500">{u.role}</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/5">{u.access}</span>
                                        </div>
                                    ))}
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
                                        <LineChart className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Director Graph Thresholds</h3>
                                        <p className="text-xs text-zinc-500">Graph scaling, update frequency, and penalties</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {configParameters.map(param => (
                                        <div key={param.key} className="p-4 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-bold text-white">{param.label} Configuration</h4>
                                                <div className="flex items-center gap-3">
                                                    {param.key !== 'speed' && param.key !== 'lambda' && (
                                                        <span className="text-xs font-mono text-blue-400">{graphConfig[param.key].max} {param.unit}</span>
                                                    )}
                                                    <button 
                                                        onClick={() => setActiveSettings(activeSettings === param.key ? null : param.key)}
                                                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        <SettingsIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {activeSettings === param.key && (
                                                <div className="mb-4 p-3 bg-black/40 rounded border border-white/5">
                                                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">Data Refresh Rate</label>
                                                    <div className="flex gap-2">
                                                        {[1, 5, 10, 15].map(rate => (
                                                            <button 
                                                                key={rate}
                                                                onClick={() => setGraphConfig({...graphConfig, [param.key]: {...graphConfig[param.key], refreshRate: rate}})}
                                                                className={`flex-1 py-1.5 rounded text-xs font-bold border ${graphConfig[param.key].refreshRate === rate ? 'bg-isuzu-red border-isuzu-red text-white' : 'bg-black/30 border-white/10 text-zinc-500 hover:bg-white/5'}`}
                                                            >
                                                                {rate} Hz
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {param.key === 'speed' ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Tire Diameter (mm)</label>
                                                            <input 
                                                                type="number" 
                                                                value={graphConfig.speed.tireDiameter}
                                                                onChange={(e) => {
                                                                    const val = Number(e.target.value);
                                                                    const newTireDiameter = val;
                                                                    let overallMax = 0;
                                                                    Object.values(graphConfig.speed.gears).forEach((g: any) => {
                                                                        if (g.gearRatio && g.finalGear) {
                                                                            const speed = (g.maxRpm / (g.gearRatio * g.finalGear)) * (newTireDiameter * Math.PI) * 60 / 1000000;
                                                                            if (speed > overallMax) overallMax = speed;
                                                                        }
                                                                    });
                                                                    setGraphConfig({...graphConfig, speed: {...graphConfig.speed, tireDiameter: val, max: Math.round(overallMax)}});
                                                                }}
                                                                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block">Gear Configuration</label>
                                                            <div className="grid grid-cols-5 gap-2 text-[10px] uppercase font-bold text-zinc-500 mb-1">
                                                                <div>Gear</div>
                                                                <div>Max RPM</div>
                                                                <div>Gear Ratio</div>
                                                                <div>Final Gear</div>
                                                                <div>Max Speed</div>
                                                            </div>
                                                            {['1', '2', '3', '4', '5', '6', 'R'].map(gear => {
                                                                const g = graphConfig.speed.gears[gear];
                                                                const maxSpeed = (g.gearRatio && g.finalGear) 
                                                                    ? ((g.maxRpm / (g.gearRatio * g.finalGear)) * (graphConfig.speed.tireDiameter * Math.PI) * 60 / 1000000).toFixed(1)
                                                                    : '0.0';
                                                                return (
                                                                <div key={gear} className="grid grid-cols-5 gap-2 items-center">
                                                                    <div className="text-xs font-bold text-white text-center bg-white/5 rounded py-1.5">{gear}</div>
                                                                    <input 
                                                                        type="number" 
                                                                        value={g.maxRpm}
                                                                        onChange={(e) => {
                                                                            const val = Number(e.target.value);
                                                                            const newGears = {...graphConfig.speed.gears, [gear]: {...g, maxRpm: val}};
                                                                            let overallMax = 0;
                                                                            Object.values(newGears).forEach((ng: any) => {
                                                                                if (ng.gearRatio && ng.finalGear) {
                                                                                    const speed = (ng.maxRpm / (ng.gearRatio * ng.finalGear)) * (graphConfig.speed.tireDiameter * Math.PI) * 60 / 1000000;
                                                                                    if (speed > overallMax) overallMax = speed;
                                                                                }
                                                                            });
                                                                            setGraphConfig({...graphConfig, speed: {...graphConfig.speed, max: Math.round(overallMax), gears: newGears}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                    <input 
                                                                        type="number" step="0.1"
                                                                        value={g.gearRatio}
                                                                        onChange={(e) => {
                                                                            const val = Number(e.target.value);
                                                                            const newGears = {...graphConfig.speed.gears, [gear]: {...g, gearRatio: val}};
                                                                            let overallMax = 0;
                                                                            Object.values(newGears).forEach((ng: any) => {
                                                                                if (ng.gearRatio && ng.finalGear) {
                                                                                    const speed = (ng.maxRpm / (ng.gearRatio * ng.finalGear)) * (graphConfig.speed.tireDiameter * Math.PI) * 60 / 1000000;
                                                                                    if (speed > overallMax) overallMax = speed;
                                                                                }
                                                                            });
                                                                            setGraphConfig({...graphConfig, speed: {...graphConfig.speed, max: Math.round(overallMax), gears: newGears}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                    <input 
                                                                        type="number" step="0.1"
                                                                        value={g.finalGear}
                                                                        onChange={(e) => {
                                                                            const val = Number(e.target.value);
                                                                            const newGears = {...graphConfig.speed.gears, [gear]: {...g, finalGear: val}};
                                                                            let overallMax = 0;
                                                                            Object.values(newGears).forEach((ng: any) => {
                                                                                if (ng.gearRatio && ng.finalGear) {
                                                                                    const speed = (ng.maxRpm / (ng.gearRatio * ng.finalGear)) * (graphConfig.speed.tireDiameter * Math.PI) * 60 / 1000000;
                                                                                    if (speed > overallMax) overallMax = speed;
                                                                                }
                                                                            });
                                                                            setGraphConfig({...graphConfig, speed: {...graphConfig.speed, max: Math.round(overallMax), gears: newGears}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                    <div className="text-xs font-mono text-blue-400 text-center bg-black/30 border border-white/5 rounded py-1.5">
                                                                        {maxSpeed}
                                                                    </div>
                                                                </div>
                                                            )})}
                                                        </div>
                                                    </div>
                                                ) : param.key === 'lambda' ? null : (
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-[10px] uppercase font-bold text-zinc-500">Graph Max</label>
                                                        </div>
                                                        <input 
                                                            type="number" 
                                                            min={param.min} max={param.max} step={param.step}
                                                            value={graphConfig[param.key].max}
                                                            onChange={(e) => setGraphConfig({...graphConfig, [param.key]: {...graphConfig[param.key], max: Number(e.target.value)}})}
                                                            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                )}
                                                
                                                {param.key !== 'lambda' && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Alert Delay (s)</label>
                                                            <input 
                                                                type="number" 
                                                                step="0.1"
                                                                value={graphConfig[param.key].alertDelay}
                                                                onChange={(e) => setGraphConfig({...graphConfig, [param.key]: {...graphConfig[param.key], alertDelay: Number(e.target.value)}})}
                                                                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Penalty Time (s)</label>
                                                            <input 
                                                                type="number" 
                                                                step="0.5"
                                                                value={graphConfig[param.key].warningPenalty}
                                                                onChange={(e) => setGraphConfig({...graphConfig, [param.key]: {...graphConfig[param.key], warningPenalty: Number(e.target.value)}})}
                                                                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {param.key === 'fuelPressure' && (
                                                    <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                                                        <label className="text-[10px] uppercase font-bold text-zinc-500 block">Channel Data Filter</label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 block mb-1">Parameter</label>
                                                                <select
                                                                    value={graphConfig.fuelPressure.filter.parameter}
                                                                    onChange={(e) => setGraphConfig({...graphConfig, fuelPressure: {...graphConfig.fuelPressure, filter: {...graphConfig.fuelPressure.filter, parameter: e.target.value}}})}
                                                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 appearance-none"
                                                                >
                                                                    {configParameters.map(p => (
                                                                        <option key={p.key} value={p.key}>{p.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 block mb-1">Condition</label>
                                                                <select
                                                                    value={graphConfig.fuelPressure.filter.condition}
                                                                    onChange={(e) => setGraphConfig({...graphConfig, fuelPressure: {...graphConfig.fuelPressure, filter: {...graphConfig.fuelPressure.filter, condition: e.target.value}}})}
                                                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 appearance-none"
                                                                >
                                                                    <option value="greater">Greater than</option>
                                                                    <option value="equal_lower">Equal to or lower</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-zinc-500 block mb-1">Value</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={graphConfig.fuelPressure.filter.value}
                                                                    onChange={(e) => setGraphConfig({...graphConfig, fuelPressure: {...graphConfig.fuelPressure, filter: {...graphConfig.fuelPressure.filter, value: Number(e.target.value)}}})}
                                                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {param.key === 'lambda' && (
                                                    <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                                                        <label className="text-[10px] uppercase font-bold text-zinc-500 block">Channel Data Filters</label>
                                                        {graphConfig.lambda.filters.map((filter: any, index: number) => (
                                                            <div key={index} className="grid grid-cols-3 gap-2">
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Parameter</label>
                                                                    <select
                                                                        value={filter.parameter}
                                                                        onChange={(e) => {
                                                                            const newFilters = [...graphConfig.lambda.filters];
                                                                            newFilters[index].parameter = e.target.value;
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, filters: newFilters}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 appearance-none"
                                                                    >
                                                                        {configParameters.map(p => (
                                                                            <option key={p.key} value={p.key}>{p.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Condition</label>
                                                                    <select
                                                                        value={filter.condition}
                                                                        onChange={(e) => {
                                                                            const newFilters = [...graphConfig.lambda.filters];
                                                                            newFilters[index].condition = e.target.value;
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, filters: newFilters}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 appearance-none"
                                                                    >
                                                                        <option value="greater">Greater than</option>
                                                                        <option value="equal_lower">Equal to or lower</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Value</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={filter.value}
                                                                        onChange={(e) => {
                                                                            const newFilters = [...graphConfig.lambda.filters];
                                                                            newFilters[index].value = Number(e.target.value);
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, filters: newFilters}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <label className="text-[10px] uppercase font-bold text-zinc-500 block mt-4">Throttle-based Thresholds</label>
                                                        {graphConfig.lambda.thresholds.map((threshold: any, index: number) => (
                                                            <div key={index} className="grid grid-cols-3 gap-2 items-end">
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Min Throttle (%)</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={threshold.minThrottle}
                                                                        onChange={(e) => {
                                                                            const newThresholds = [...graphConfig.lambda.thresholds];
                                                                            newThresholds[index].minThrottle = Number(e.target.value);
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, thresholds: newThresholds}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Max Throttle (%)</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={threshold.maxThrottle}
                                                                        onChange={(e) => {
                                                                            const newThresholds = [...graphConfig.lambda.thresholds];
                                                                            newThresholds[index].maxThrottle = Number(e.target.value);
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, thresholds: newThresholds}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] text-zinc-500 block mb-1">Alert Threshold (λ)</label>
                                                                    <input 
                                                                        type="number" step="0.01"
                                                                        value={threshold.value}
                                                                        onChange={(e) => {
                                                                            const newThresholds = [...graphConfig.lambda.thresholds];
                                                                            newThresholds[index].value = Number(e.target.value);
                                                                            setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, thresholds: newThresholds}});
                                                                        }}
                                                                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-blue-400 font-mono outline-none focus:border-blue-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Alert Delay (s)</label>
                                                                <input 
                                                                    type="number" 
                                                                    step="0.1"
                                                                    value={graphConfig.lambda.alertDelay}
                                                                    onChange={(e) => setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, alertDelay: Number(e.target.value)}})}
                                                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Penalty Time (s)</label>
                                                                <input 
                                                                    type="number" 
                                                                    step="0.5"
                                                                    value={graphConfig.lambda.warningPenalty}
                                                                    onChange={(e) => setGraphConfig({...graphConfig, lambda: {...graphConfig.lambda, warningPenalty: Number(e.target.value)}})}
                                                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Administration;
