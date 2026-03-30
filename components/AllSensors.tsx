import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, Car as CarIcon, LayoutGrid, Check, ChevronDown, Wifi } from 'lucide-react';
import { Responsive } from 'react-grid-layout';
import * as ReactGridLayout from 'react-grid-layout';
import { Car, Driver } from '../types';

const WidthProvider = (ReactGridLayout as any).WidthProvider;
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
    cars: Car[];
    drivers: Driver[];
}

const AllSensors: React.FC<DashboardProps> = ({ cars, drivers }) => {
  const [activeCarId, setActiveCarId] = useState<number>(cars[0]?.id || 0);
  
  const activeCar = cars.find(c => c.id === activeCarId);
  const activeDriver = drivers.find(d => d.carId === activeCarId);
  
  // Sensor Tabs State
  const [activeSensorTab, setActiveSensorTab] = useState('POWERTRAIN');

  // Sensor Layout State
  const [sensorEditMode, setSensorEditMode] = useState(false);
  const [sensorLayouts, setSensorLayouts] = useState<Record<string, ReactGridLayout.Layout[]>>({});

  // Main Layout (Static)
  const [layout, setLayout] = useState<ReactGridLayout.Layout[]>([
      { i: 'sensors', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
      { i: 'alerts', x: 3, y: 0, w: 1, h: 4, minW: 1, minH: 1 },
      { i: 'connection', x: 0, y: 4, w: 3, h: 2, minW: 1, minH: 1 },
  ]);

  // Ensure active car is valid if cars change
  useEffect(() => {
      if (!cars.find(c => c.id === activeCarId) && cars.length > 0) {
          setActiveCarId(cars[0].id);
      }
  }, [cars]);

  const sensors = {
      'POWERTRAIN': [
          { name: 'Engine Oil Pressure', status: 'ok', value: '4.2 bar' },
          { name: 'Fuel Flow Rate', status: 'ok', value: '98 kg/h' },
          { name: 'Turbo Boost', status: 'warn', value: '2.8 bar' },
          { name: 'Gearbox Temp', status: 'ok', value: '115°C' },
          { name: 'Exhaust Gas Temp', status: 'ok', value: '850°C' },
          { name: 'Coolant Temp', status: 'ok', value: '92°C' },
      ],
      'CHASSIS': [
          { name: 'FL Suspension Travel', status: 'ok', value: '120mm' },
          { name: 'FR Suspension Travel', status: 'ok', value: '118mm' },
          { name: 'Brake Line Pressure', status: 'ok', value: '0 bar' },
          { name: 'Steering Angle', status: 'ok', value: '-2.4°' },
          { name: 'Tire Pressure Monitor', status: 'ok', value: 'Active' },
      ],
      'AERO': [
          { name: 'Front Wing Load', status: 'ok', value: '3200 N' },
          { name: 'Rear Wing Load', status: 'ok', value: '4500 N' },
          { name: 'Underbody Airflow', status: 'calib', value: 'Acquiring' },
          { name: 'Drag Reduction System', status: 'ok', value: 'Closed' },
      ],
      'ELECTRONICS': [
          { name: 'ECU Status', status: 'ok', value: 'Map 4' },
          { name: 'Telemetry Link', status: 'ok', value: '5G - 24ms' },
          { name: 'GPS Signal', status: 'ok', value: '12 Sats' },
          { name: 'Battery Voltage', status: 'warn', value: '12.4 V' },
          { name: 'Hybrid Deployment', status: 'ok', value: 'Ready' },
      ]
  };

  const getSensorLayout = (tab: string) => {
      if (sensorLayouts[tab]) return sensorLayouts[tab];
      const tabSensors = sensors[tab as keyof typeof sensors] || [];
      return tabSensors.map((_, i) => ({
          i: i.toString(),
          x: (i % 3),
          y: Math.floor(i / 3),
          w: 1,
          h: 1
      }));
  };

  const handleSensorLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
      setSensorLayouts(prev => ({
          ...prev,
          [activeSensorTab]: newLayout
      }));
  };

  const StatusIcon = ({ status }: { status: string }) => {
      switch(status) {
          case 'ok': return <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>;
          case 'warn': return <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse"></div>;
          case 'calib': return <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></div>;
          default: return <div className="w-2 h-2 rounded-full bg-zinc-600"></div>;
      }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto h-full space-y-4 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-1 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-light text-white tracking-tight">Race Control</h2>
          <p className="text-zinc-500 text-xs mt-1 font-mono">LIVE TELEMETRY FEED • SESSION 4</p>
        </div>
        <div className="flex gap-4 items-center">
            {/* Car Selector */}
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 relative group">
                    <div className="w-2 h-2 rounded-full bg-isuzu-red animate-pulse"></div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ACTIVE VEHICLE</span>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm font-bold text-white uppercase">
                                #{activeCar?.number} - {activeDriver?.name || 'Unknown'}
                            </span>
                            <ChevronDown className="w-3 h-3 text-zinc-500" />
                        </div>
                    </div>
                    
                    {/* Dropdown */}
                    <select 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={activeCarId}
                        onChange={(e) => setActiveCarId(Number(e.target.value))}
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

            <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
            </span>
        </div>
      </div>

      {/* Grid Layout Area */}
      <div className="flex-1 min-h-0 relative">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={100}
            width={1200} // This is estimated; RGL usually uses width provider to set this automatically
            isDraggable={false}
            isResizable={false}
            margin={[16, 16]}
            onLayoutChange={(newLayout: ReactGridLayout.Layout[]) => setLayout(newLayout)}
          >
            {/* Sensor Status Section */}
            <div key="sensors">
                <div className={`glass-panel rounded-xl border border-white/5 flex flex-col h-full w-full ${sensorEditMode ? 'border-isuzu-red/30' : ''}`}>
                    {/* Tabs Header */}
                    <div className="flex border-b border-white/10 items-center justify-between flex-shrink-0 pr-4">
                        <div className="flex overflow-x-auto">
                            <div className="px-6 py-4 flex items-center gap-2 border-r border-white/10 bg-white/5">
                                <Database className="w-4 h-4 text-zinc-400" />
                                <span className="text-sm font-bold text-zinc-200">SENSOR TELEMETRY</span>
                            </div>
                            {['POWERTRAIN', 'CHASSIS', 'AERO', 'ELECTRONICS'].map(tab => (
                                <button
                                    key={tab}
                                    onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking tabs
                                    onClick={() => setActiveSensorTab(tab)}
                                    className={`px-6 py-4 text-xs font-bold tracking-wider hover:bg-white/5 transition-colors relative ${activeSensorTab === tab ? 'text-white bg-white/5' : 'text-zinc-500'}`}
                                >
                                    {tab}
                                    {activeSensorTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-isuzu-red"></div>}
                                </button>
                            ))}
                        </div>
                        
                        {/* Sensor Edit Button */}
                        <button 
                            onClick={() => setSensorEditMode(!sensorEditMode)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                sensorEditMode 
                                ? 'bg-isuzu-red text-white border-isuzu-red shadow-[0_0_15px_rgba(255,51,51,0.4)]' 
                                : 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-white'
                            }`}
                        >
                            {sensorEditMode ? <Check className="w-3 h-3" /> : <LayoutGrid className="w-3 h-3" />}
                            {sensorEditMode ? 'DONE' : 'EDIT'}
                        </button>
                    </div>
                    
                    {/* Sensor Grid - Using Nested ResponsiveGridLayout */}
                    <div className={`p-6 flex-1 overflow-y-auto relative ${sensorEditMode ? 'bg-zinc-900/20 grid-background' : ''}`}>
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={{ lg: getSensorLayout(activeSensorTab) }}
                            breakpoints={{ lg: 1200, md: 800, sm: 500, xs: 300, xxs: 0 }}
                            cols={{ lg: 3, md: 3, sm: 3, xs: 2, xxs: 1 }}
                            rowHeight={80}
                            isDraggable={sensorEditMode}
                            isResizable={sensorEditMode}
                            margin={[16, 16]}
                            onLayoutChange={handleSensorLayoutChange}
                            compactType="vertical"
                            draggableHandle={sensorEditMode ? "" : ".drag-disabled"}
                        >
                            {sensors[activeSensorTab as keyof typeof sensors].map((sensor, idx) => (
                                <div key={idx.toString()} className={`bg-black/40 border border-white/5 p-3 rounded flex flex-col gap-2 hover:border-white/10 transition-colors h-full ${sensorEditMode ? 'cursor-move border-dashed border-white/30' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <StatusIcon status={sensor.status} />
                                        <span className="text-[10px] text-zinc-600 font-mono uppercase">CH-{idx+1}</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400 truncate mb-1" title={sensor.name}>{sensor.name}</div>
                                        <div className="text-sm font-medium text-white font-mono">{sensor.value}</div>
                                    </div>
                                </div>
                            ))}
                        </ResponsiveGridLayout>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            <div key="alerts">
                <div className="glass-panel p-3 rounded-xl flex flex-col h-full w-full">
                    <h3 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Active Alerts
                    </h3>
                    <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                        {[
                            { msg: 'Front Left Brake Temp High', time: '10:42:01', level: 'warning' },
                            { msg: 'Gap to Car 4 decreasing', time: '10:41:45', level: 'info' },
                            { msg: 'Fuel Mix Strategy Update', time: '10:38:12', level: 'info' },
                            { msg: 'DRS Available Zone 2', time: '10:35:00', level: 'success' },
                        ].map((alert, i) => (
                            <div key={i} className="p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-medium leading-tight ${alert.level === 'warning' ? 'text-yellow-500' : alert.level === 'success' ? 'text-green-500' : 'text-zinc-300'}`}>
                                        {alert.msg}
                                    </span>
                                </div>
                                <span className="text-[9px] text-zinc-600 font-mono mt-0.5 block group-hover:text-zinc-500">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <button className="w-full py-1.5 bg-isuzu-red/10 text-isuzu-red text-[10px] font-bold hover:bg-isuzu-red hover:text-white transition-all rounded border border-isuzu-red/20">
                            ACKNOWLEDGE ALL
                        </button>
                    </div>
                </div>
            </div>

            {/* Connection Widget */}
            <div key="connection">
                <div className="glass-panel p-4 rounded-xl flex flex-col h-full w-full space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Wifi className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Connection</h3>
                            <p className="text-[10px] text-zinc-500">Telemetry Status</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                            <span className="text-xs text-zinc-400">Status</span>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Connected
                            </span>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Telemetry Box</label>
                            <div className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white mt-1 font-mono text-sm flex items-center justify-between">
                                <span>Mini-Telemetry</span>
                                <span className="text-[10px] text-zinc-500">v2.4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </ResponsiveGridLayout>
      </div>

    </div>
  );
};

export default AllSensors;