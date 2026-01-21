import { readFile } from 'node:fs/promises';
import { join } from 'node:path'; // Ajoute cet import
import type { Sample, Technician, Equipment } from './interfaces.js';

export const DataService = {

/**
 * Asynchronously loads all data from JSON files.
 * Uses Promise.all for parallel reading to optimize performance.
 */
async loadAllData() {
    try {
        // Path resolution
        // Define the project root to ensure absolute paths regardless of execution context.
        const root = process.cwd(); 

        // Parallel file reading
        // Trigger all read operations simultaneously to avoid blocking the event loop.
        const [samplesRaw, techsRaw, equipRaw] = await Promise.all([
            readFile(join(root, 'data', 'samples.json'), 'utf-8'),
            readFile(join(root, 'data', 'technicians.json'), 'utf-8'),
            readFile(join(root, 'data', 'equipements.json'), 'utf-8')
        ]);

        // Parsing and Data Mapping
        // Convert raw strings into structured objects and extract specific arrays.
        // Type casting (as Sample[], etc.) is used to enforce TypeScript safety.
        return {
            samples: JSON.parse(samplesRaw).samples as Sample[],
            technicians: JSON.parse(techsRaw).technicians as Technician[],
            equipments: JSON.parse(equipRaw).equipment as Equipment[]
        };

    } catch (error) {
        // Catch and log filesystem (ENOENT) or syntax errors (JSON.parse).
        // Re-throwing the error allows the caller (main.ts) to handle the crash gracefully.
        console.error("Data loading failed:", error);
        throw error;
    }
}

};