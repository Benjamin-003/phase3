import { readFile } from 'fs/promises';
import type { Sample, Technician, Equipment } from './interfaces.js';

export const DataService = {
    async loadAllData() {
        // Le bloc try/catch est essentiel pour les erreurs de lecture de fichiers
        try {
            const samplesRaw = await readFile('./data/samples.json', 'utf-8');
            const techsRaw = await readFile('./data/technicians.json', 'utf-8');
            const equipRaw = await readFile('./data/equipements.json', 'utf-8');

            return {
                samples: JSON.parse(samplesRaw).samples as Sample[],
                technicians: JSON.parse(techsRaw).technicians as Technician[],
                equipments: JSON.parse(equipRaw).equipment as Equipment[]
            };
        } catch (error) {
            console.error("Erreur de chargement des fichiers :", error);
            throw error;
        }
    }
};