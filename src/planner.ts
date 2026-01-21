import type { Sample, Technician, Equipment, FinalOutput, ScheduledTask } from './interfaces.js';
import { timeToMinutes, minutesToTime } from './utils.js';
import { SampleSorter } from './sorter.js';
import { MetricsCalculator } from './metrics.js';

export class Planner {
    private techBusyUntil = new Map<string, number>();
    private equipBusyUntil = new Map<string, number>();

    public execute(samples: Sample[], technicians: Technician[], equipments: Equipment[]): FinalOutput {
        // Init resources availability
        technicians.forEach(t => this.techBusyUntil.set(t.id, timeToMinutes(t.startTime)));
        equipments.forEach(e => this.equipBusyUntil.set(e.id, 0));

        const sorted = SampleSorter.sort(samples);
        const schedule: ScheduledTask[] = [];
        let totalEffectiveWorkTime = 0; // Track total work duration for metrics

        for (const sample of sorted) {
            // Find compatible technician
            const tech = technicians.find(t => 
                t.specialties.includes(sample.type) || t.specialties.includes('GENERAL')
            );
            // Find compatible equipment
            const equip = equipments.find(e => e.type === sample.analysisType || e.type === sample.type);

            if (tech && equip) {
                const arrival = timeToMinutes(sample.arrivalTime);
                let start = Math.max(arrival, this.techBusyUntil.get(tech.id)!, this.equipBusyUntil.get(equip.id)!);
                const duration = Math.ceil(sample.analysisTime * tech.efficiency);
                
                // Lunch logic with safe split and mapping
                const [rawStart, rawEnd] = tech.lunchBreak.split('-');
                const bStart = timeToMinutes(rawStart || "12:00");
                const bEnd = timeToMinutes(rawEnd || "13:00");
                
                let wasShiftedByLunch = false;
                if (start < bEnd && (start + duration) > bStart) {
                    if (sample.priority !== 'STAT') {
                        start = bEnd;
                        wasShiftedByLunch = true;
                    }
                }

                const end = start + duration;
                
                // Update availability status
                this.techBusyUntil.set(tech.id, end);
                this.equipBusyUntil.set(equip.id, end + equip.cleaningTime);
                totalEffectiveWorkTime += duration;

                schedule.push({
                    sampleId: sample.id,
                    priority: sample.priority,
                    technicianId: tech.id,
                    equipmentId: equip.id,
                    startTime: minutesToTime(start),
                    endTime: minutesToTime(end),
                    duration,
                    analysisType: sample.analysisType,
                    efficiency: tech.efficiency,
                    lunchBreak: wasShiftedByLunch,
                    cleaningRequired: equip.cleaningTime > 0
                });
            }
        }

        

        return {
            laboratory: {
                date: "2025-03-15",
                // Fallback to empty string to satisfy TS strict mode if split fails
                processingDate: new Date().toISOString().split('T')[0] || "",
                totalSamples: samples.length,
                algorithmVersion: "v1.0"
            },
            schedule,
            // Added missing totalEffectiveWorkTime argument
            metrics: MetricsCalculator.calculate(schedule, samples, technicians.length, totalEffectiveWorkTime),
            metadata: {
                lunchBreaks: technicians.map(t => ({
                    technicianId: t.id,
                    planned: t.lunchBreak,
                    actual: t.lunchBreak, 
                    reason: "optimized"
                })),
                constraintsApplied: [
                    "priority_management", "specialization_matching", "lunch_breaks",
                    "equipment_compatibility", "cleaning_delays", "efficiency_coefficients"
                ]
            }
        };
    }
}