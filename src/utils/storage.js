import { formatDate, parseDate } from './helpers';

const WEEKLY_DATA_KEY = 'electromedicina_horas_data';

export const loadData = () => {
    try {
        const data = localStorage.getItem(WEEKLY_DATA_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Error cargando datos de Local Storage:", e);
        return {};
    }
};

export const saveData = (data) => {
    try {
        localStorage.setItem(WEEKLY_DATA_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error guardando datos en Local Storage:", e);
    }
};

export const getWeekData = (startDateString, allData) => {
    if (!allData[startDateString]) {
        const startDate = parseDate(startDateString);
        const daysOfWeek = [];
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            daysOfWeek.push({
                date: formatDate(dayDate),
                avisos: [],
                isFinished: false,
                totalMinutes: 0
            });
        }
        allData[startDateString] = {
            weekStartDate: startDateString,
            days: daysOfWeek
        };
    }
    return allData[startDateString];
};
