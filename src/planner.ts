import type { Sample, Technician, Equipment, FinalOutput } from './interfaces.js';
import { timeToMinutes, minutesToTime } from './utils.js';
import { SampleSorter } from './sorter.js';
import { MetricsCalculator } from './metrics.js';

/**
 * Main orchestration class for laboratory resource planning.
 */
export class Planner {
    // Tracking maps to store the next available time (in minutes) for each resource
    private techBusyUntil = new Map<string, number>();
    private equipBusyUntil = new Map<string, number>();

    /**
     * Executes the scheduling logic based on provided samples and resources.
     * @returns A complete schedule and its associated performance metrics.
     */
    public execute(samples: Sample[], technicians: Technician[], equipments: Equipment[]): FinalOutput {
        
        // Resource Initialization
        // Reset availability trackers based on technician shift start times and equipment availability
        technicians.forEach(t => this.techBusyUntil.set(t.id, timeToMinutes(t.startTime)));
        equipments.forEach(e => this.equipBusyUntil.set(e.id, 0));

        // Pre-processing
        // Delegate sorting to the specialized SampleSorter class (Priority + Arrival Time)
        const sorted = SampleSorter.sort(samples);
        
        const schedule = [];
        let totalWorkTime = 0;

        // Resource Assignment Loop
        // Iterate through each sorted sample to find the best possible time slot
        for (const sample of sorted) {
            
            const tech = technicians.find(t => 
                (t.speciality === sample.type || t.speciality === 'GENERAL') &&
                (this.techBusyUntil.get(t.id) || 0) < timeToMinutes(t.endTime)
            );

            const equip = equipments.find(e => e.type === sample.type);

            // --- INSÉREZ VOTRE NOUVEAU BLOC ICI ---
            if (tech && equip) {
                // 1. Calculate the start time (When all are ready)
                const arrival = timeToMinutes(sample.arrivalTime);
                const techFreeAt = this.techBusyUntil.get(tech.id)!;
                const equipFreeAt = this.equipBusyUntil.get(equip.id)!;

                const startTime = Math.max(arrival, techFreeAt, equipFreeAt);
                
                // 2. USE THE INPUT DURATION: sample.analysisTime
                // On utilise la valeur dynamique de l'échantillon
                const duration = sample.analysisTime || 30; 
                const endTime = startTime + duration;

                // 3. BLOCK the resources
                this.techBusyUntil.set(tech.id, endTime);
                this.equipBusyUntil.set(equip.id, endTime);
                
                totalWorkTime += duration;

                // 4. Record in schedule
                schedule.push({
                    sampleId: sample.id,
                    technicianId: tech.id,
                    equipmentId: equip.id,
                    startTime: minutesToTime(startTime),
                    endTime: minutesToTime(endTime),
                    priority: sample.priority
                });
            }
            // --- FIN DU BLOC ---
        }

        // Metrics Analysis
        // Delegate performance calculations to the specialized MetricsCalculator class
        const metrics = MetricsCalculator.calculate(
            schedule, 
            technicians.length, 
            equipments.length, 
            totalWorkTime
        );

        // Final Result Delivery
        // Return the standardized JSON structure expected by the system
        return {
            schedule: schedule,
            metrics: metrics
        };
    }
}