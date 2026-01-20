import type { Sample } from './interfaces.js';
import { timeToMinutes } from './utils.js';

export function sortSamples(samples: Sample[]): Sample[] {
    const priorityOrder: Record<string, number> = {
        'STAT': 1,
        'URGENT': 2,
        'ROUTINE': 3
    };

    return [...samples].sort((a, b) => {
        // 1. Comparaison par priorité
        const weightA = priorityOrder[a.priority] ?? 99;
        const weightB = priorityOrder[b.priority] ?? 99;

        if (weightA !== weightB) {
            return weightA - weightB;
        }

        // 2. Comparaison par heure d'arrivée (si même priorité)
        return timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime);
    });
}