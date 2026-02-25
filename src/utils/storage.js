import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDate, parseDate } from './helpers';

export const fetchWeekData = async (startDateString) => {
    try {
        const docRef = doc(db, "semanas", startDateString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
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
            return {
                weekStartDate: startDateString,
                days: daysOfWeek
            };
        }
    } catch (e) {
        console.error("Error cargando datos de Firestore:", e);
        // Fallback or offline support
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
        return {
            weekStartDate: startDateString,
            days: daysOfWeek
        };
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
