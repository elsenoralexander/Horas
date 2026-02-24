import React, { useState, useEffect } from 'react';
import { getStartOfWeek, formatDate } from './utils/helpers';
import { loadData, saveData, getWeekData } from './utils/storage';
import DayCard from './components/DayCard';
import { ChevronLeft, ChevronRight, BriefcaseMedical } from 'lucide-react';
import './index.css';

function App() {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(getStartOfWeek(new Date()));
  const [weekData, setWeekData] = useState(null);

  // Load data when week changes
  useEffect(() => {
    const allData = loadData();
    const data = getWeekData(formatDate(currentWeekStartDate), allData);
    setWeekData(data);
  }, [currentWeekStartDate]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStartDate(newDate);
  };

  const handleUpdateDay = (updatedDayData) => {
    const allData = loadData();
    const currentWeekData = getWeekData(formatDate(currentWeekStartDate), allData);

    // Update the specific day
    const updatedDays = currentWeekData.days.map(d => d.date === updatedDayData.date ? updatedDayData : d);
    currentWeekData.days = updatedDays;
    allData[currentWeekData.weekStartDate] = currentWeekData;

    saveData(allData);
    setWeekData(currentWeekData); // re-render
  };

  if (!weekData) return null;

  const endDate = new Date(currentWeekStartDate);
  endDate.setDate(currentWeekStartDate.getDate() + 6);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen flex flex-col gap-10">

      {/* Header */}
      <header className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl shadow-lg shadow-cyan-500/20">
            <BriefcaseMedical className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Control Horario</h1>
            <p className="text-cyan-400 font-medium">Gestión de Avisos Electromedicina</p>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5 z-10">
          <button onClick={handlePrevWeek} className="btn-secondary flex items-center gap-1 group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <h2 className="text-lg font-bold text-gray-200 px-4 whitespace-nowrap">
            {formatDate(currentWeekStartDate)} <span className="text-emerald-500 mx-1">→</span> {formatDate(endDate)}
          </h2>

          <button onClick={handleNextWeek} className="btn-secondary flex items-center gap-1 group">
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Days Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 xlg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {weekData.days.map((dayData, index) => (
          <DayCard
            key={dayData.date}
            dayData={dayData}
            onUpdateDay={handleUpdateDay}
          />
        ))}
      </main>

    </div>
  );
}

export default App;
