import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
export const fetchWeekData = async (startDateString) => {
    try {
        const docRef = doc(db, "semanas", startDateString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null; // Don't return empty weeks here so we don't accidentally erase caches
        }
    } catch (e) {
        console.error("Error cargando datos de Firestore:", e);
        return null; // Return null on error
    }
};

export const saveWeekData = async (weekData) => {
    try {
        // Create a deep copy and clean it up for Firestore
        const cleanData = JSON.parse(JSON.stringify(weekData));

        const docRef = doc(db, "semanas", cleanData.weekStartDate);
        await setDoc(docRef, cleanData);
    } catch (e) {
        console.error("Error guardando datos en Firestore:", e);
    }
};
