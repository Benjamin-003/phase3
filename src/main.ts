import { sortSamples } from "./planner.js";
import { DataService } from "./services.js";

async function main() {
    try {
        console.log("=== LABORATORY PLANNER - ===");
        
        // Chargement des données via ton nouveau service
        const { samples, technicians, equipments } = await DataService.loadAllData();
        
        console.log(`📊 Données chargées : ${samples.length} échantillons`);

        // Tri des échantillons
        const sortedQueue = sortSamples(samples);

        console.log("\n📋 FILE D'ATTENTE PRIORISÉE :");
        console.table(sortedQueue.map(s => ({
            ID: s.id,
            Priorité: s.priority,
            Heure: s.arrivalTime,
            Type: s.type
        })));

    } catch (error) {
        console.error("Le programme s'est arrêté suite à une erreur.");
    }
}

main();