import React from 'react';
import { Clock, MapPin, User } from 'lucide-react'; // Si no tienes lucide-react, usa texto o emojis 🕒 📍 👤

const scheduleData = [
  { id: 1, day: 'HOY', date: 'Lunes 15', time: '16:00 - 18:00', category: 'Sub-17 Avanzado', coach: 'Prof. Carlos', court: 'Cancha 1', isNext: true },
  { id: 2, day: 'Miércoles', date: 'Mier 17', time: '16:00 - 18:00', category: 'Físico / Táctico', coach: 'Prof. Ana', court: 'Gimnasio', isNext: false },
  { id: 3, day: 'Viernes', date: 'Vie 19', time: '15:30 - 17:30', category: 'Partido Práctica', coach: 'Prof. Carlos', court: 'Cancha 2', isNext: false },
];

const StudentSchedule = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">🏐 Mis Entrenamientos</h2>
      
      <div className="space-y-4">
        {scheduleData.map((item) => (
          <div 
            key={item.id} 
            className={`relative rounded-2xl p-5 border shadow-sm transition-transform active:scale-95 ${
              item.isNext 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 shadow-lg' 
                : 'bg-white text-gray-700 border-gray-100'
            }`}
          >
            {/* Etiqueta de "Próximo" solo si es el siguiente */}
            {item.isNext && (
              <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                PRÓXIMO
              </span>
            )}

            <div className="flex justify-between items-start mb-3">
              <div>
                <p className={`text-sm font-semibold opacity-90 ${item.isNext ? 'text-blue-100' : 'text-gray-400'}`}>
                  {item.day}
                </p>
                <h3 className="text-2xl font-bold">{item.time.split(' - ')[0]} <span className="text-sm font-normal opacity-80">{item.time.split(' - ')[1]}</span></h3>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{item.date.split(' ')[0]}</p>
                <p className="text-2xl font-bold">{item.date.split(' ')[1]}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-3 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span> {/* Icono Cancha */}
                <span className="font-medium">{item.court}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span className="text-lg">👤</span> {/* Icono Coach */}
                <span>{item.coach}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span className="text-lg">🏐</span> {/* Icono Voley */}
                <span>{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSchedule;