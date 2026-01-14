import React from 'react';
import { CalendarDays, Filter } from 'lucide-react';

const Filters = ({ activeDay, setActiveDay, activeCategory, setActiveCategory }) => {
  const days = [
    { name: 'Lunes', date: '12 OCT' },
    { name: 'Martes', date: '13 OCT' },
    { name: 'Miércoles', date: '14 OCT' },
    { name: 'Jueves', date: '15 OCT' },
    { name: 'Viernes', date: '16 OCT' },
    { name: 'Sábado', date: '17 OCT' },
  ];

  const categories = ['Todas', 'Principiantes', 'Intermedios', 'Avanzados', 'Vóley Playa'];

  return (
    <div className="space-y-6 mb-8">
      {/* Selector de Días */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
          <CalendarDays className="text-blue-600" />
          <h2>Calendario Semanal</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`min-w-[100px] flex-1 border rounded-xl p-3 transition-all text-center ${activeDay === idx
                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-slate-50'
              }`}
          >
            <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{day.name}</span>
            <span className="block text-lg font-bold">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Selector de Categorías*/}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <Filter size={18} className="text-slate-400 min-w-[18px]" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;