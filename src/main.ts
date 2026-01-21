import fs from 'fs';
import path from 'path';
import { DataService } from './services.js';
import { Planner } from './planner.js';

async function main() {
    try {
        console.log("🚀 Loading data...");
        const { samples, technicians, equipments } = await DataService.loadAllData();
        
        console.log("⚙️ Running planner...");
        const planner = new Planner();
        const result = planner.execute(samples, technicians, equipments);

        // --- Logic to save the file ---
        
        // 1. Define folder and file paths
        const outputDir = path.join(process.cwd(), 'output');
        const filePath = path.join(outputDir, 'output-example.json');

        // 2. Create the 'output' directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("Folder 'output' created.");
        }

        // 3. Write the JSON file
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`File saved at: ${filePath}`);

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();