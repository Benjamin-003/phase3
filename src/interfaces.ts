import type { Specialty, Priority } from "./types.ts";

export interface Sample {
    id: string;
    type: Specialty;
    priority: Priority;
    analysisTime: number;
    arrivalTime: string;
    patientId: string;
}

export interface Technician {
    id: string;
    name: string;
    speciality: Specialty | 'GENERAL';
    startTime: string;
    endTime: string;
}

export interface Equipment {
    id: string;
    name: string;
    type: Specialty;
    available: boolean;
}

export interface ScheduleEntry {
    sampleId: string;
    technicianId: string;
    equipmentId: string;
    startTime: string;
    endTime: string;
    priority: Priority;
}

export interface Metrics {
    totalTime: number;
    efficiency: number;
    conflicts: number;
}


export interface PlanifyResult {
    schedule: ScheduleEntry[];
    metrics: Metrics;
}

export interface FinalOutput {
  schedule: {
    sampleId: string;
    technicianId: string;
    equipmentId: string;
    startTime: string;
    endTime: string;
    priority: string;
  }[];
  metrics: {
    totalTime: number;
    efficiency: number;
    conflicts: number;
  };
}