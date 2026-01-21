import { DataService } from './services.js';
import { Planner } from './planner.js';

async function main() {
    try {
        // *Data Acquisition
        const { samples, technicians, equipments } = await DataService.loadAllData();
        
        // Core Logic (Pure Calculation)
        const planner = new Planner();
        const result = planner.execute(samples, technicians, equipments);

        // Persistence (Saving the output)
        // This is where we call the method we just added to DataService
        await DataService.saveResults(result);

        console.log("Process completed successfully.");
    } catch (error) {
        console.error("Process failed:", error);
    }
}

main();