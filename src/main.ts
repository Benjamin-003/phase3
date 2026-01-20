import { DataService } from './services.js';
import { Planner } from './planner.js';

async function main() {
    const { samples, technicians, equipments } = await DataService.loadAllData();
    
    const planner = new Planner();
    const result = planner.execute(samples, technicians, equipments);

    console.log(JSON.stringify(result, null, 2));
}

main();