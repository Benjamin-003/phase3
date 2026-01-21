// Convertit une heure format "HH:MM" en nombre total de minutes

export const timeToMinutes = (time: string): number => {
    const parts = time.split(':');
    
    const hoursStr = parts[0] || "0";
    const minutesStr = parts[1] || "0";

    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    return hours * 60 + minutes;
};


 // Convertit un nombre de minutes en format "HH:MM"
 
export const minutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};