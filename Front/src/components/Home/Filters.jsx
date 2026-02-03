import React from 'react';
import { CalendarDays, Filter, ChevronRight } from 'lucide-react';

const Filters = ({ activeDay, setActiveDay, activeCategory, setActiveCategory }) => {
  const days = [
    { name: 'Lun', date: '12 OCT' },
    { name: 'Mar', date: '13 OCT' },
    { name: 'Mié', date: '14 OCT' },
    { name: 'Jue', date: '15 OCT' },
    { name: 'Vie', date: '16 OCT' },
    { name: 'Sáb', date: '17 OCT' },
  ];

  const categories = ['Todas', 'Principiantes', 'Intermedios', 'Avanzados', 'Vóley Playa'];

  return (
    <div className="space-y-8 p-1">
      {/* --- SECTOR CALENDARIO --- */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CalendarDays className="text-[#1e3a8a]" size={20} />
            </div>
            <h2 className="text-sm font-black text-[#1e3a8a] uppercase tracking-widest italic">
              Calendario de <span className="text-orange-500">Clases</span>
            </h2>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            Desliza para ver más <ChevronRight size={12} />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide select-none">
          {days.map((day, idx) => {
            const isActive = activeDay === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`min-w-[90px] md:min-w-[110px] flex-1 flex flex-col items-center border-2 rounded-2xl p-4 transition-all duration-300 relative overflow-hidden group ${isActive
                    ? 'border-orange-500 bg-white shadow-lg shadow-orange-100'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-blue-200 hover:bg-white'
                  }`}
              >
                {/* Indicador superior solo cuando está activo */}
                {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>}

                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400'
                  }`}>
                  {day.name}
                </span>
                <span className={`text-lg font-black tracking-tighter transition-colors ${isActive ? 'text-[#1e3a8a]' : 'text-slate-500 group-hover:text-[#1e3a8a]'
                  }`}>
                  {day.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SECTOR CATEGORÍAS --- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
            <Filter size={16} className="text-[#1e3a8a]" />
            <span className="text-[10px] font-black uppercase text-[#1e3a8a] tracking-widest hidden sm:inline">Filtro:</span>
          </div>

          <div className="flex gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border-2 ${isActive
                      ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-md shadow-blue-900/20 scale-105'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200 hover:text-orange-500'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;