// Obtener la fecha de inicio de la semana (Lunes)
export function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Formatea la fecha a YYYY-MM-DD
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Parsea YYYY-MM-DD a objeto Date
export function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Calcula la duración en minutos entre dos horas (HH:MM)
export function calculateDurationMinutes(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    let duration = endTotalMinutes - startTotalMinutes;
    if (duration < 0) {
        // cruzando medianoche
        duration += 24 * 60;
    }
    return duration;
}

// Convierte minutos a formato de horas decimales (ej: 7.5 horas)
export function minutesToHoursDecimal(minutes) {
    return (minutes / 60).toFixed(2);
}

// Genera un ID único para los avisos
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
