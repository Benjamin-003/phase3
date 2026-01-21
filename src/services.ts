import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Sample, Technician, Equipment } from './interfaces.js';

/**
 * Service class handling data persistence and retrieval.
 */
export class DataService {

    /**
     * Loads all laboratory data from JSON files simultaneously.
     * Uses Promise.all to optimize performance through parallel I/O operations.
     */
    static async loadAllData() {
        try {
            const root = process.cwd(); 

            // Execute multiple read operations in parallel
            const [samplesRaw, techsRaw, equipRaw] = await Promise.all([
                readFile(join(root, 'data', 'samples.json'), 'utf-8'),
                readFile(join(root, 'data', 'technicians.json'), 'utf-8'),
                readFile(join(root, 'data', 'equipements.json'), 'utf-8')
            ]);

            // Parse raw JSON strings into structured objects with type casting
            return {
                samples: JSON.parse(samplesRaw).samples as Sample[],
                technicians: JSON.parse(techsRaw).technicians as Technician[],
                equipments: JSON.parse(equipRaw).equipment as Equipment[]
            };

        } catch (error) {
            console.error("Critical error during data loading:", error);
            throw error;
        }
    }

    /**
     * Exports the planning results to a JSON file.
     * Automatically creates the output directory if it does not exist.
     * @param data - The calculated schedule and metrics to be saved.
     * @param fileName - Target filename for the export.
     */
    static async saveResults(data: any, fileName: string = 'output-example.json'): Promise<void> {
        const outputDir = join(process.cwd(), 'output');
        const filePath = join(outputDir, fileName);

        try {
            // Check for directory existence and create it recursively if missing
            if (!existsSync(outputDir)) {
                await mkdir(outputDir, { recursive: true });
                console.log(`Created missing directory: ${outputDir}`);
            }

            // Write data to disk with 2-space indentation for readability
            await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Results successfully saved to: ${filePath}`);
        } catch (error) {
            console.error("Failed to save results to disk:", error);
            throw error;
        }
    }
}