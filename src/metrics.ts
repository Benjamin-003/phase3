import type { ScheduledTask, Sample } from './interfaces.js';
import { timeToMinutes } from './utils.js';

export class MetricsCalculator {
    /**
     * Calculates laboratory performance indicators (KPIs).
     * Returns a complete Metrics object to satisfy TypeScript strict typing.
     */
    public static calculate(
        schedule: ScheduledTask[], 
        samples: Sample[], 
        techCount: number, 
        totalWorkTime: number
    ) {
        // Fallback: Return a full object with zero values if no tasks are scheduled
        // This prevents the "Property is missing in type {}" error in the Planner
        if (schedule.length === 0) {
            return {
                totalTime: 0,
                efficiency: 0,
                conflicts: samples.length,
                averageWaitTime: {
                    STAT: 0,
                    URGENT: 0,
                    ROUTINE: 0
                },
                technicianUtilization: 0,
                priorityRespectRate: 0,
                parallelAnalyses: 0,
                lunchInterruptions: 0
            };
        }

        // 1. Calculate Total Time span of the operations
        const startTimes = schedule.map(s => timeToMinutes(s.startTime));
        const endTimes = schedule.map(s => timeToMinutes(s.endTime));
        const totalTime = Math.max(...endTimes) - Math.min(...startTimes);

        // 2. Helper function to calculate average wait time per priority level
        const getAvgWait = (priority: string) => {
            const priorityTasks = schedule.filter(t => t.priority === priority);
            if (priorityTasks.length === 0) return 0;

            const totalWait = priorityTasks.reduce((sum, task) => {
                const sample = samples.find(s => s.id === task.sampleId);
                const arrival = sample ? timeToMinutes(sample.arrivalTime) : 0;
                return sum + (timeToMinutes(task.startTime) - arrival);
            }, 0);
            
            return Math.round(totalWait / priorityTasks.length);
        };

        // 3. Calculate Peak Parallelism (Maximum concurrent analyses)
        let maxParallel = 0;
        let currentRunning = 0;
        // Create a timeline of events (Start = +1, End = -1)
        const timeline = [
            ...schedule.map(t => ({ time: timeToMinutes(t.startTime), type: 1 })),
            ...schedule.map(t => ({ time: timeToMinutes(t.endTime), type: -1 }))
        ].sort((a, b) => a.time - b.time || a.type);

        for (const event of timeline) {
            currentRunning += event.type;
            if (currentRunning > maxParallel) maxParallel = currentRunning;
        }

        // 4. Calculate Resource Utilization 
        // Based on a standard 8-hour shift (480 minutes) per technician
        const theoreticalCapacity = techCount * 480;
        const technicianUtilization = Number(((totalWorkTime / theoreticalCapacity) * 100).toFixed(1));

        // Return the final formatted Metrics object
        return {
            totalTime,
            // Overall system efficiency: actual work vs total time span
            efficiency: Number(((totalWorkTime / (totalTime * techCount)) * 100).toFixed(1)),
            conflicts: samples.length - schedule.length,
            averageWaitTime: {
                STAT: getAvgWait('STAT'),
                URGENT: getAvgWait('URGENT'),
                ROUTINE: getAvgWait('ROUTINE')
            },
            technicianUtilization,
            priorityRespectRate: 100, // Default 100% for this level
            parallelAnalyses: maxParallel,
            // Count STAT tasks that were handled during/shifted by lunch breaks
            lunchInterruptions: schedule.filter(t => t.lunchBreak && t.priority === 'STAT').length
        };
    }
}