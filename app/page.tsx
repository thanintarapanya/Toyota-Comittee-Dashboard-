'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Login from '@/components/Login';
import { View, Car, Driver, FileItem, CarTelemetry, Thresholds } from '@/types';
import { INITIAL_FILES } from '@/constants';

const AllSensors = dynamic(() => import('@/components/AllSensors'), { ssr: false });
const Task = dynamic(() => import('@/components/Task'), { ssr: false });
const TeamComms = dynamic(() => import('@/components/TeamComms'), { ssr: false });
const Engineering = dynamic(() => import('@/components/Engineering'), { ssr: false });
const DirectorGraph = dynamic(() => import('@/components/DirectorGraph'), { ssr: false });
const Settings = dynamic(() => import('@/components/Settings'), { ssr: false });
const FileAndVideo = dynamic(() => import('@/components/FileAndVideo'), { ssr: false });
const LiveStream = dynamic(() => import('@/components/LiveStream'), { ssr: false });
const Administration = dynamic(() => import('@/components/Administration'), { ssr: false });
const OverviewDirector = dynamic(() => import('@/components/OverviewDirector'), { ssr: false });

// Define initial layout here to persist across tab changes
const DEFAULT_TELEMETRY_LAYOUT = [
    // Column 0
    { i: 'alerts', x: 0, y: 0, w: 1, h: 2 },
    { i: 'heart', x: 0, y: 2, w: 1, h: 1 },
    { i: 'breath', x: 0, y: 3, w: 1, h: 1 },
    { i: 'stress', x: 0, y: 4, w: 1, h: 1 },

    // Column 1
    { i: 'race', x: 1, y: 0, w: 1, h: 1 },
    { i: 'map', x: 1, y: 1, w: 1, h: 2 },
    { i: 'gap_time', x: 1, y: 3, w: 1, h: 2 },

    // Column 2 & 3 (Top)
    { i: 'car', x: 2, y: 0, w: 2, h: 3 },

    // Column 2 (Bottom)
    { i: 'cameras', x: 2, y: 3, w: 1, h: 2 },

    // Column 3 (Bottom)
    { i: 'correlation', x: 3, y: 3, w: 1, h: 1 },
    { i: 'conditions', x: 3, y: 4, w: 1, h: 1 },
];

const DRIVER_NAMES = [
  "Liam Thorne", "Noah Vance", "Oliver Sterling", "Elijah Cross", "Jameson Locke",
  "William Hayes", "Benjamin Steele", "Lucas Mercer", "Henry Vance", "Alexander Pierce",
  "Sebastian Shaw", "Jack Reynolds", "Owen Blake", "Theodore Grant", "Caleb Frost",
  "Wyatt Cole", "Julian Chase", "Levi Hunter", "Gabriel Stone", "Mateo Cruz",
  "Jaxon Reed", "Nathan Drake", "Samuel Brooks", "David Clarke", "Joseph Wright",
  "Carter Hayes", "John Mitchell", "Luke Harrison", "Dylan Foster", "Isaac Bennett"
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.OVERVIEW_DIRECTOR);

  // Event & Track State
  const [eventName, setEventName] = useState('Buriram GT3 Series');
  const [trackName, setTrackName] = useState('Buriram International Circuit');
  const [sessionType, setSessionType] = useState('PRACTICE');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [raceSeries, setRaceSeries] = useState('Vios');

  // Shared State for Fleet/Team
  const [cars, setCars] = useState<Car[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      model: i % 2 === 0 ? 'Isuzu D-Max Raider' : 'Isuzu D-Max Proto',
      number: (i + 1).toString().padStart(2, '0'),
      status: i % 5 === 0 ? 'Maintenance' : 'Active'
    }))
  );
  const [drivers, setDrivers] = useState<Driver[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: DRIVER_NAMES[i] || `Driver ${i + 1}`,
      carId: i + 1,
      license: i % 3 === 0 ? 'FIA-A' : 'FIA-B'
    }))
  );

  // Shared State for Files (Files Tab + Telemetry Recording)
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);

  // Persisted Layout State
  const [telemetryLayout, setTelemetryLayout] = useState(DEFAULT_TELEMETRY_LAYOUT);

  // Shared Telemetry State
  const [allCarsTelemetry, setAllCarsTelemetry] = React.useState<CarTelemetry[]>([]);
  const tickRef = React.useRef(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Director Selection State
  const [selectedCarIds, setSelectedCarIds] = useState<number[]>([1]);
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);

  // Shared Thresholds State
  const [thresholds, setThresholds] = React.useState<Thresholds>({
      speed: 250,
      rpm: 8500,
      fuelFlow: 95,
      fuelPressure: 4.8,
      throttle: 95,
      ignitionTiming: 35,
      airflow: 450,
      lambda: 1.05,
      sensitivity: 8
  });

  // Director Graph State
  const [graphConfig, setGraphConfig] = useState<Record<string, any>>({
      speed: { 
          max: 336, alertDelay: 2.0, warningPenalty: 5.0, refreshRate: 10,
          tireDiameter: 650,
          gears: {
              '1': { maxRpm: 9000, gearRatio: 3.5, finalGear: 4.1 },
              '2': { maxRpm: 9000, gearRatio: 2.5, finalGear: 4.1 },
              '3': { maxRpm: 9000, gearRatio: 1.8, finalGear: 4.1 },
              '4': { maxRpm: 9000, gearRatio: 1.3, finalGear: 4.1 },
              '5': { maxRpm: 9000, gearRatio: 1.0, finalGear: 4.1 },
              '6': { maxRpm: 9000, gearRatio: 0.8, finalGear: 4.1 },
              'R': { maxRpm: 9000, gearRatio: 3.0, finalGear: 4.1 },
          }
      },
      rpm: { max: 9000, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      fuelPressure: { 
          max: 10, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10,
          filter: { parameter: 'rpm', condition: 'greater', value: 300 }
      },
      throttle: { max: 100, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      ignitionTiming: { max: 50, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      lambda: { 
          max: 1.3, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10,
          filters: [
              { parameter: 'rpm', condition: 'greater', value: 300 },
              { parameter: 'coolantTemp', condition: 'greater', value: 80 }
          ],
          thresholds: [
              { minThrottle: 0, maxThrottle: 50, value: 1.0 },
              { minThrottle: 51, maxThrottle: 100, value: 0.85 }
          ]
      },
      airflow: { max: 500, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      gForce: { max: 3, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      coolantTemp: { max: 150, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 },
      airTemp: { max: 100, alertDelay: 1.0, warningPenalty: 3.0, refreshRate: 10 }
  });

  // Team Filter Logic
  const teamCarIds = [1, 2];
  const teamCars = cars.filter(c => teamCarIds.includes(c.id));
  const teamDrivers = drivers.filter(d => teamCarIds.includes(d.carId));

  // Telemetry Generation Logic (Lifted from DirectorGraph)
  React.useEffect(() => {
      const generateAllCarsTelemetry = (cars: Car[], tick: number): CarTelemetry[] => {
          return cars.map(car => {
              const t = tick + (car.id * 100);
              
              // To make higher rank cars have higher violations, we scale performance factor by car.id
              // Higher car.id -> higher performance factor -> higher speed/distance (higher rank) AND higher telemetry values (more violations)
              const performanceFactor = 0.9 + (car.id * 0.015);
              
              // Rare spike for normal cars (1% chance)
              const spike = Math.random() < 0.01 ? 1.15 : 1.0;
              const finalPf = performanceFactor * spike;
              
              // Higher car.id gets a distance boost to ensure they are higher rank
              const totalDistance = (tick * 50 * performanceFactor) + (car.id * 500);
              const currentLap = 16 + Math.floor(totalDistance / 5000);
              const currentDistance = totalDistance % 5000;
              
              return {
                  id: car.id,
                  number: car.number,
                  lap: currentLap,
                  speed: Math.max(0, 150 + Math.sin(t * 0.1) * 80 * finalPf + (Math.random() * 10)),
                  rpm: Math.max(0, 6000 + Math.sin(t * 0.2) * 2100 * finalPf + (Math.random() * 100)),
                  fuelFlow: Math.max(0, 70 + Math.sin(t * 0.1) * 18 * finalPf + Math.random() * 5),
                  fuelPressure: Math.max(0, 3.8 + Math.sin(t * 0.05) * 0.7 * finalPf + (Math.random() * 0.2)),
                  throttle: Math.max(0, 50 + Math.sin(t * 0.3) * 50),
                  ignitionTiming: 20 + Math.sin(t * 0.1) * 12 * finalPf + (Math.random() * 2),
                  lambda: 0.98 + (car.id * 0.002) + Math.random() * 0.04 * spike,
                  airflow: Math.max(0, 300 + Math.sin(t * 0.2) * 120 * finalPf + Math.random() * 20),
                  gForce: Math.abs(Math.sin(t * 0.5) * 2.3 * finalPf) + Math.random() * 0.3,
                  gForceLat: Math.sin(t * 0.7) * 2.3 * finalPf + (Math.random() - 0.5) * 0.5,
                  gForceLon: Math.cos(t * 0.5) * 1.3 * finalPf + (Math.random() - 0.5) * 0.5,
                  coolantTemp: 85 + Math.sin(t * 0.01) * 16 * finalPf + Math.random() * 2,
                  airTemp: 30 + Math.sin(t * 0.02) * 5 + Math.random(),
                  distance: currentDistance,
                  lapProgress: (currentDistance / 5000) * 100,
              };
          });
      };

      const interval = setInterval(() => {
          if (!isPaused) {
              tickRef.current += 0.1;
              const t = tickRef.current;
              setAllCarsTelemetry(generateAllCarsTelemetry(cars, t));
          }
      }, 100);
      return () => clearInterval(interval);
  }, [cars, isPaused]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <AllSensors cars={teamCars} drivers={teamDrivers} />;
      case View.TELEMETRY:
        return <Engineering 
                  cars={teamCars} 
                  drivers={teamDrivers} 
                  setFiles={setFiles} 
                  layout={telemetryLayout}
                  onLayoutChange={setTelemetryLayout}
               />;
      case View.DIRECTOR:
        return <DirectorGraph 
                  cars={cars} 
                  telemetryData={allCarsTelemetry} 
                  selectedCarIds={selectedCarIds}
                  setSelectedCarIds={setSelectedCarIds}
                  filterSelectedOnly={filterSelectedOnly}
                  setFilterSelectedOnly={setFilterSelectedOnly}
                  graphConfig={graphConfig}
                  thresholds={thresholds}
                  setThresholds={setThresholds}
                  setFiles={setFiles}
                  eventName={eventName} setEventName={setEventName}
                  trackName={trackName} setTrackName={setTrackName}
                  sessionType={sessionType} setSessionType={setSessionType}
                  eventDate={eventDate} setEventDate={setEventDate}
                  raceSeries={raceSeries} setRaceSeries={setRaceSeries}
               />;
      case View.OVERVIEW_DIRECTOR:
        return <OverviewDirector 
                  cars={cars} 
                  drivers={drivers} 
                  telemetryData={allCarsTelemetry}
                  onCarSelect={(id) => {
                      setSelectedCarIds([id]);
                      setFilterSelectedOnly(true);
                      setCurrentView(View.DIRECTOR);
                  }}
                  thresholds={thresholds}
                  graphConfig={graphConfig}
                  layout={telemetryLayout}
                  onLayoutChange={setTelemetryLayout}
               />;
      case View.KANBAN:
        return <Task />;
      case View.CHAT:
        return <TeamComms />;
      case View.FILES:
        return <FileAndVideo files={files} setFiles={setFiles} />;
      case View.LIVE:
        return <LiveStream cars={teamCars} drivers={teamDrivers} />;
      case View.ADMINISTRATION:
        return <Administration 
                  cars={teamCars} setCars={setCars} 
                  drivers={teamDrivers} setDrivers={setDrivers} 
                  graphConfig={graphConfig} setGraphConfig={setGraphConfig} 
                  eventName={eventName} setEventName={setEventName}
                  trackName={trackName} setTrackName={setTrackName}
                  sessionType={sessionType} setSessionType={setSessionType}
                  eventDate={eventDate} setEventDate={setEventDate}
                  raceSeries={raceSeries} setRaceSeries={setRaceSeries}
               />;
      case View.SETTINGS:
        return <Settings cars={teamCars} setCars={setCars} drivers={teamDrivers} setDrivers={setDrivers} />;
      default:
        return <OverviewDirector 
                  cars={cars} 
                  drivers={drivers} 
                  telemetryData={allCarsTelemetry}
                  onCarSelect={(id) => {
                      setSelectedCarIds([id]);
                      setFilterSelectedOnly(true);
                      setCurrentView(View.DIRECTOR);
                  }}
                  thresholds={thresholds}
                  layout={telemetryLayout}
                  onLayoutChange={setTelemetryLayout}
               />;
    }
  };

  return (
    <div className="flex h-screen text-white overflow-hidden selection:bg-isuzu-red selection:text-white relative bg-[#050505]">
        {/* Isuzu Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-[#2a0505] z-0"></div>
        
        {/* Ambient Aesthetic Glows - Silver (Top Left) & Red (Bottom Right) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-600/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-isuzu-red/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
        
        {/* Grid Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#999 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <Sidebar 
            currentView={currentView} 
            onChangeView={setCurrentView} 
            onLogout={() => setIsAuthenticated(false)} 
            isAdmin={true}
        />
        
        <main className="flex-1 relative z-10 flex flex-col overflow-hidden">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
