export enum View {
  DASHBOARD = 'DASHBOARD',
  TELEMETRY = 'TELEMETRY',
  DIRECTOR = 'DIRECTOR',
  KANBAN = 'KANBAN',
  CHAT = 'CHAT',
  FILES = 'FILES',
  LIVE = 'LIVE',
  SETTINGS = 'SETTINGS',
  ADMINISTRATION = 'ADMINISTRATION',
  OVERVIEW_DIRECTOR = 'OVERVIEW_DIRECTOR'
}

export interface TelemetryPoint {
  time: string;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate?: string;
  attachment?: string;
}

export interface Message {
  id: string;
  sender: string;
  role: 'engineer' | 'manager' | 'driver';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Car {
    id: number;
    model: string;
    number: string;
    status: string;
}

export interface Driver {
    id: number;
    name: string;
    carId: number;
    license: string;
}

export interface CarTelemetry {
    id: number;
    number: string;
    lap: number;
    speed: number;
    rpm: number;
    fuelFlow: number;
    fuelPressure: number;
    throttle: number;
    ignitionTiming: number;
    lambda: number;
    airflow: number;
    gForce: number;
    gForceLat: number;
    gForceLon: number;
    coolantTemp: number;
    airTemp: number;
    distance: number;
    [key: string]: any;
}

export interface FileItem {
    id: string;
    parentId: string;
    name: string;
    type: 'folder' | 'csv' | 'mp4';
    size?: string;
    date: string;
}

export interface Thresholds {
    [key: string]: number;
    speed: number;
    rpm: number;
    fuelFlow: number;
    fuelPressure: number;
    throttle: number;
    ignitionTiming: number;
    airflow: number;
    lambda: number;
    sensitivity: number;
}
