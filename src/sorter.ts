import type { Sample } from './interfaces.js';
import { timeToMinutes } from './utils.js';

/**
 * Handles the logic for prioritizing laboratory samples.
 */
export class SampleSorter {
    private static readonly PRIORITY_WEIGHTS: Record<string, number> = {
        'STAT': 1, 'URGENT': 2, 'ROUTINE': 3
    };

    /**
     * Sorts samples by priority weight, then by arrival time (FIFO).
     */
    public static sort(samples: Sample[]): Sample[] {
        return [...samples].sort((a, b) => {
            const weightA = this.PRIORITY_WEIGHTS[a.priority] ?? 99;
            const weightB = this.PRIORITY_WEIGHTS[b.priority] ?? 99;
            
            // If priorities differ, sort by weight
            if (weightA !== weightB) return weightA - weightB;
            
            // If priorities are the same, sort by arrival time
            return timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime);
        });
    }
}