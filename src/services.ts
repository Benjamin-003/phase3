import { readFile } from 'node:fs/promises';
import { join } from 'node:path'; // Ajoute cet import
import type { Sample, Technician, Equipment } from './interfaces.js';

export const DataService = {
    async loadAllData() {
        try {
            // process.cwd() donne la racine du projet peu importe d'où on lance la commande
            const root = process.cwd(); 
            
            const samplesRaw = await readFile(join(root, 'data', 'samples.json'), 'utf-8');
            const techsRaw = await readFile(join(root, 'data', 'technicians.json'), 'utf-8');
            const equipRaw = await readFile(join(root, 'data', 'equipements.json'), 'utf-8');

            return {
                samples: JSON.parse(samplesRaw).samples as Sample[],
                technicians: JSON.parse(techsRaw).technicians as Technician[],
                equipments: JSON.parse(equipRaw).equipment as Equipment[]
            };
        } catch (error) {
            console.error("❌ Erreur de lecture :", error);
            throw error;
        }
    }
};