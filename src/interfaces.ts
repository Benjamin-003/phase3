export interface Sample {
    id: string;
    priority: 'STAT' | 'URGENT' | 'ROUTINE';
    type: 'BLOOD' | 'URINE' | 'TISSUE';
    analysisType: string;
    analysisTime: number;
    arrivalTime: string;
}

export interface Technician {
    id: string;
    specialties: string[];
    efficiency: number;
    startTime: string;
    endTime: string;
    lunchBreak: string;
}

export interface Equipment {
    id: string;
    type: string;
    available: boolean;
    cleaningTime: number;
}

export interface ScheduledTask {
    sampleId: string;
    priority: string;
    technicianId: string;
    equipmentId: string;
    startTime: string;
    endTime: string;
    duration: number;
    analysisType: string;
    efficiency: number;
    lunchBreak: boolean; // True if it overlapped or was shifted by lunch
    cleaningRequired: boolean;
}

export interface FinalOutput {
    laboratory: {
        date: string;
        processingDate: string;
        totalSamples: number;
        algorithmVersion: string;
    };

    schedule: ScheduledTask[];
    
    metrics: {
        totalTime: number;
        efficiency: number;
        conflicts: number;
        averageWaitTime: { STAT: number; URGENT: number; ROUTINE: number };
        technicianUtilization: number;
        priorityRespectRate: number;
        parallelAnalyses: number;
        lunchInterruptions: number;
    };
    metadata: {
        lunchBreaks: Array<{ technicianId: string; planned: string; actual: string; reason: string }>;
        constraintsApplied: string[];
    };
}