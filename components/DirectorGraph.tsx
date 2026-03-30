import React, { useState, useEffect, useRef } from 'react';
import { Car, CarTelemetry, FileItem, Thresholds } from '../types';
import Graph from './Graph';

interface DirectorDashboardProps {
    cars: Car[];
    telemetryData: CarTelemetry[];
    selectedCarIds: number[];
    setSelectedCarIds: React.Dispatch<React.SetStateAction<number[]>>;
    filterSelectedOnly: boolean;
    setFilterSelectedOnly: React.Dispatch<React.SetStateAction<boolean>>;
    graphConfig: Record<string, any>;
    thresholds: Thresholds;
    setThresholds: React.Dispatch<React.SetStateAction<Thresholds>>;
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
    eventName?: string;
    setEventName?: (name: string) => void;
    trackName?: string;
    setTrackName?: (name: string) => void;
    sessionType?: string;
    setSessionType?: (type: string) => void;
    eventDate?: string;
    setEventDate?: (date: string) => void;
    raceSeries?: string;
    setRaceSeries?: (series: string) => void;
}

const DirectorGraph: React.FC<DirectorDashboardProps> = ({ 
    cars, 
    telemetryData,
    selectedCarIds,
    setSelectedCarIds,
    filterSelectedOnly,
    setFilterSelectedOnly,
    graphConfig,
    thresholds,
    setThresholds,
    setFiles,
    eventName, setEventName, trackName, setTrackName, sessionType, setSessionType,
    eventDate, setEventDate, raceSeries, setRaceSeries
}) => {

    return (
        <div className="flex-1 h-full min-h-0 relative flex flex-col">
            <div className="flex-1 min-h-0 relative">
                <Graph 
                    cars={cars}
                    telemetryData={telemetryData}
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
                />
            </div>
        </div>
    );
};

export default DirectorGraph;
