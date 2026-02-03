import React from 'react';
import { Clock, MapPin, User, Zap, Star } from 'lucide-react'; 

const scheduleData = [
  { id: 1, day: 'HOY', date: 'LUN 15', time: '16:00 - 18:00', category: 'Sub-17 Avanzado', coach: 'Prof. Carlos', court: 'Cancha Central', isNext: true },
  { id: 2, day: 'MIÉRCOLES', date: 'MIE 17', time: '16:00 - 18:00', category: 'Físico / Táctico', coach: 'Prof. Ana', court: 'Gimnasio Gema', isNext: false },
  { id: 3, day: 'VIERNES', date: 'VIE 19', time: '15:30 - 17:30', category: 'Partido Práctica', coach: 'Prof. Carlos', court: 'Cancha 2', isNext: false },
];

const StudentSchedule = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6 px-1">
        <Zap size={20} className="text-orange-500 fill-orange-500" />
        <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter">Próximas Sesiones</h2>
      </div>
      
      <div className="space-y-4">
        {scheduleData.map((item) => (
          <div 
            key={item.id} 
            className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl ${
              item.isNext 
                ? 'bg-[#1e3a8a] text-white shadow-blue-900/20' 
                : 'bg-white text-slate-700 border border-slate-100'
            }`}
          >
            <div className={`absolute left-0 top-0 h-full w-2 ${item.isNext ? 'bg-orange-500' : 'bg-slate-200 group-hover:bg-blue-400'} transition-colors`}></div>

            <div className="p-6">
              {item.isNext && (
                <div className="absolute top-0 right-0">
                   <div className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg animate-pulse">
                     Next Session
                   </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-center gap-6">
                  <div className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl ${item.isNext ? 'bg-white/10' : 'bg-slate-50'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.isNext ? 'text-orange-400' : 'text-slate-400'}`}>
                      {item.date.split(' ')[0]}
                    </span>
                    <span className="text-2xl font-black tracking-tighter">{item.date.split(' ')[1]}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className={item.isNext ? 'text-orange-400' : 'text-blue-600'} />
                      <span className={`text-xs font-black uppercase tracking-widest ${item.isNext ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter leading-none">
                      {item.time.split(' - ')[0]} 
                      <span className={`text-sm font-medium ml-2 opacity-60`}>
                        a {item.time.split(' - ')[1]}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 flex-1 md:justify-items-center border-t md:border-t-0 md:border-l ${item.isNext ? 'border-white/10' : 'border-slate-100'} pt-4 md:pt-0`}>
                  
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.isNext ? 'bg-white/10' : 'bg-blue-50 text-blue-600'}`}>
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Lugar</p>
                      <p className="text-sm font-bold truncate">{item.court}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.isNext ? 'bg-white/10' : 'bg-orange-50 text-orange-600'}`}>
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Coach</p>
                      <p className="text-sm font-bold truncate">{item.coach}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.isNext ? 'bg-white/10' : 'bg-indigo-50 text-indigo-600'}`}>
                      {/* Reemplazamos Volleyball por Star o un emoji */}
                      <Star size={16} fill={item.isNext ? "currentColor" : "none"} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Sesión</p>
                      <p className="text-sm font-bold truncate">{item.category}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-700">
               <img src="/logo.png" alt="" className="w-24 h-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSchedule;