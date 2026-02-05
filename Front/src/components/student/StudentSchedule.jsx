import React from 'react';
import { Clock, MapPin, User, Star, Zap } from 'lucide-react';

const StudentSchedule = () => {
  const sesiones = [
    { id: 1, dia: 'LUN', num: '15', hora: '16:00 a 18:00', etiqueta: 'HOY', lugar: 'Cancha Central', coach: 'Prof. Carlos', nivel: 'Sub-17 Avanzado', isNext: true },
    { id: 2, dia: 'MIE', num: '17', hora: '16:00 a 18:00', etiqueta: 'MIÉRCOLES', lugar: 'Gimnasio Gema', coach: 'Prof. Ana', nivel: 'Físico / Táctico', isNext: false },
    { id: 3, dia: 'VIE', num: '19', hora: '15:30 a 17:30', etiqueta: 'VIERNES', lugar: 'Cancha 2', coach: 'Prof. Carlos', nivel: 'Partido Práctica', isNext: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 px-2">
        <Zap size={22} className="text-orange-500 fill-orange-500" />
        <h3 className="font-black text-[#1e3a8a] uppercase tracking-tighter text-xl">Próximas Sesiones</h3>
      </div>

      <div className="space-y-5">
        {sesiones.map((s) => (
          <div key={s.id} className={`relative rounded-[2.5rem] border transition-all duration-300 ${s.isNext ? 'bg-[#213a85] text-white border-transparent shadow-2xl' : 'bg-white text-slate-600 border-slate-100 hover:shadow-lg'}`}>
            
            {/* Indicador Naranja Lateral con mayor altura */}
            {s.isNext && <div className="absolute left-0 top-12 bottom-12 w-1.5 bg-orange-500 rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>}
            
            <div className="p-8 flex flex-wrap md:flex-nowrap items-center gap-8">
              {/* Bloque Fecha - Más Grande */}
              <div className="flex items-center gap-5 min-w-[160px]">
                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-3xl font-black shadow-inner ${s.isNext ? 'bg-white/10' : 'bg-slate-50 text-[#1e3a8a]'}`}>
                  <span className="text-[12px] opacity-60 uppercase tracking-tighter">{s.dia}</span>
                  <span className="text-3xl leading-none mt-1">{s.num}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className={s.isNext ? 'text-orange-400' : 'text-slate-400'} />
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] opacity-80">{s.etiqueta}</span>
                  </div>
                  <h4 className="text-xl font-black italic leading-none whitespace-nowrap">{s.hora}</h4>
                </div>
              </div>

              {/* Bloque Detalles con divisores */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 flex-1 border-t md:border-t-0 md:border-l border-white/10 md:pl-10 pt-6 md:pt-0">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Ubicación</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="text-sm font-bold uppercase tracking-tight">{s.lugar}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Instructor</p>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-orange-400" />
                    <span className="text-sm font-bold uppercase tracking-tight">{s.coach}</span>
                  </div>
                </div>
                <div className="space-y-1.5 hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Programa</p>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-blue-400" />
                    <span className="text-sm font-bold uppercase tracking-tight">{s.nivel}</span>
                  </div>
                </div>
              </div>

              {/* Badge Next Session - Estilizado */}
              {s.isNext && (
                <div className="absolute top-0 right-10 bg-orange-500 text-white text-[10px] font-black px-6 py-2 rounded-b-2xl uppercase tracking-[0.2em] shadow-lg">
                  Next Session
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSchedule;