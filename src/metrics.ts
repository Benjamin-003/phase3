import type { Metrics } from './interfaces.js';

/**
 * Analyzes the final schedule to produce performance indicators.
 */
export class MetricsCalculator {
    /**
     * Computes efficiency and total duration of the lab session.
     */
    public static calculate(schedule: any[], techCount: number, equipCount: number, totalWorkMinutes: number): Metrics {
        if (schedule.length === 0) return { totalTime: 0, efficiency: 0, conflicts: 0 };

        // Extract all start and end points to find the global time span
        const timePoints = schedule.flatMap(s => [
            this.timeToMinutes(s.startTime), 
            this.timeToMinutes(s.endTime)
        ]);
        
        const firstStart = Math.min(...timePoints);
        const lastEnd = Math.max(...timePoints);
        const totalTimeSpan = lastEnd - firstStart;

        // Efficiency: Ratio of active work vs. total potential capacity
        const totalResources = techCount + equipCount;
        const efficiency = totalTimeSpan > 0 
            ? (totalWorkMinutes / (totalTimeSpan * totalResources)) * 100 
            : 0;

        return {
            totalTime: totalTimeSpan,
            efficiency: parseFloat(efficiency.toFixed(1)),
            conflicts: 0
        };
    }

    private static timeToMinutes(time: string): number {
        const [h, m] = (time || "00:00").split(':').map(Number);
        return (h ?? 0) * 60 + (m ?? 0);
    }
}