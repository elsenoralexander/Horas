import React, { useState } from 'react';
import { calculateDurationMinutes, minutesToHoursDecimal, generateUniqueId } from '../utils/helpers';
import { Clock, Plus, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

const WORKDAY_MINUTES = 8 * 60;

const DayCard = ({ dayData, onUpdateDay }) => {
    const { date, isFinished, avisos, totalMinutes } = dayData;
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // For editing
    const [editingId, setEditingId] = useState(null);
    const [editStart, setEditStart] = useState('');
    const [editEnd, setEditEnd] = useState('');

    const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const lastAvisoEndTime = avisos.length > 0 ? avisos[avisos.length - 1].endTime : '';

    // Add new hours
    const handleAddAviso = () => {
        let start = startTime;
        if (avisos.length > 0 && !start) {
            start = lastAvisoEndTime;
        }

        if (start && endTime) {
            const durationMinutes = calculateDurationMinutes(start, endTime);
            const newAviso = { id: generateUniqueId(), startTime: start, endTime, durationMinutes };

            const newAvisos = [...avisos, newAviso];
            const newTotal = newAvisos.reduce((sum, av) => sum + av.durationMinutes, 0);

            onUpdateDay({
                ...dayData,
                avisos: newAvisos,
                totalMinutes: newTotal
            });

            setEndTime('');
            // We do not clear start time if it's the first one, or we can just let it be empty since it inherits
            if (avisos.length === 0) setStartTime('');
            setErrorMsg('');
        } else {
            showError('Por favor, rellena las horas correctamente.');
        }
    };

    const handleDeleteAviso = (id) => {
        const newAvisos = avisos.filter(a => a.id !== id);
        const newTotal = newAvisos.reduce((sum, av) => sum + av.durationMinutes, 0);
        onUpdateDay({
            ...dayData,
            avisos: newAvisos,
            totalMinutes: newTotal
        });
    };

    const startEdit = (aviso) => {
        setEditingId(aviso.id);
        setEditStart(aviso.startTime);
        setEditEnd(aviso.endTime);
    };

    const saveEdit = (id) => {
        if (editStart && editEnd) {
            const newDuration = calculateDurationMinutes(editStart, editEnd);
            const newAvisos = avisos.map(a =>
                a.id === id ? { ...a, startTime: editStart, endTime: editEnd, durationMinutes: newDuration } : a
            );
            const newTotal = newAvisos.reduce((sum, av) => sum + av.durationMinutes, 0);

            onUpdateDay({
                ...dayData,
                avisos: newAvisos,
                totalMinutes: newTotal
            });
            setEditingId(null);
        } else {
            showError('Rellena las horas para actualizar.');
        }
    };

    const toggleFinished = () => {
        onUpdateDay({
            ...dayData,
            isFinished: !isFinished
        });
    };

    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 3000);
    };

    return (
        <div className={`glass-card relative overflow-hidden flex flex-col transition-all duration-300 ${isFinished ? 'ring-2 ring-emerald-500/50 bg-emerald-900/10' : ''}`}>
            {/* Dynamic Background Glow Based on Finished State */}
            <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${isFinished ? 'bg-emerald-500' : 'bg-cyan-500'}`}></div>

            {errorMsg && (
                <div className="absolute top-0 left-0 w-full p-2 text-center text-sm font-medium text-white bg-red-500/90 backdrop-blur-md z-10 transition-all animate-in fade-in slide-in-from-top-2">
                    {errorMsg}
                </div>
            )}

            <div className="p-6 flex-grow flex flex-col gap-5 z-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-50">{capitalizedDay}</h3>
                        <p className="text-gray-400 font-medium">{date}</p>
                    </div>
                    {isFinished && <CheckCircle2 className="text-emerald-400 w-8 h-8" />}
                </div>

                {/* Avisos List */}
                <div className="flex flex-col gap-3">
                    {avisos.map(aviso => (
                        <div key={aviso.id} className="glass-surface p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                            {editingId === aviso.id ? (
                                <div className="flex-grow w-full flex flex-col sm:flex-row gap-2">
                                    <input type="time" className="input-ghost w-full" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                                    <input type="time" className="input-ghost w-full" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        <button onClick={() => saveEdit(aviso.id)} className="btn-primary flex-1">Ok</button>
                                        <button onClick={() => setEditingId(null)} className="btn-secondary flex-1">X</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-grow mb-2 sm:mb-0">
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            <span className="font-semibold text-lg">{aviso.startTime} - {aviso.endTime}</span>
                                        </div>
                                        <p className="text-sm text-cyan-400/80 font-medium pl-6">{minutesToHoursDecimal(aviso.durationMinutes)}h imputed</p>
                                    </div>
                                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(aviso)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteAviso(aviso.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Aviso Form */}
                <div className={`flex flex-col gap-3 mt-auto pt-4 ${isFinished ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div className="flex gap-2">
                        <input
                            type="time"
                            className="input-ghost w-1/2"
                            value={avisos.length > 0 ? lastAvisoEndTime : startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={isFinished || avisos.length > 0}
                        />
                        <input
                            type="time"
                            className="input-ghost w-1/2"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={isFinished}
                        />
                    </div>
                    <button onClick={handleAddAviso} className="btn-primary flex items-center justify-center gap-2 w-full" disabled={isFinished}>
                        <Plus className="w-5 h-5" /> Añadir Horas
                    </button>
                </div>
            </div>

            {/* Footer Totals */}
            <div className="glass-panel mx-6 mb-6 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-0">
                <div className="flex flex-col w-full sm:w-auto">
                    <div className="flex justify-between sm:justify-start gap-4 text-sm font-medium text-gray-300">
                        <span>Total: <span className="text-white font-bold text-base">{minutesToHoursDecimal(totalMinutes)}h</span></span>
                        <span>Libres: <span className="text-emerald-400 font-bold text-base">{Math.max(0, minutesToHoursDecimal(WORKDAY_MINUTES - totalMinutes))}h</span></span>
                    </div>
                </div>
                <button
                    onClick={toggleFinished}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all ${isFinished ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'btn-secondary'}`}
                >
                    {isFinished ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    {isFinished ? 'Finalizado' : 'Marcar Finalizado'}
                </button>
            </div>
        </div>
    );
};

export default DayCard;
