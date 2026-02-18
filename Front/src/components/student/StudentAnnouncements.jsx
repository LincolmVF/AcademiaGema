import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Trophy, RefreshCcw, Users, Gift, HeartPulse } from 'lucide-react';

const StudentAnnouncements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const beneficios = [
    {
      id: 1,
      tipo: 'RECUPERACIÓN',
      titulo: 'Recupera tus clases faltantes',
      descripcion: 'Si entrenas 2 o 3 veces/semana, recupera hasta 2 clases. Si vas 4 veces, ¡hasta 4! Máximo hasta el mes siguiente.',
      icon: <RefreshCcw size={18} />,
      color: 'bg-orange-500',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: 2,
      tipo: 'REFERIDOS',
      titulo: 'Trae a un amigo y ahorra',
      descripcion: 'Por cada referido que se inscriba, obtén S/ 10 de descuento directo en tu siguiente pago.',
      icon: <Users size={18} />,
      color: 'bg-blue-500',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      tipo: 'SALUD',
      titulo: 'Gestión de Lesiones',
      descripcion: '¿Te lesionaste? No pierdas tus clases. Puedes recuperarlas todas dentro de tu mes pagado o el siguiente.',
      icon: <HeartPulse size={18} />,
      color: 'bg-red-500',
      iconColor: 'bg-red-100 text-red-600'
    },
    {
      id: 4,
      tipo: 'PREMIO',
      titulo: 'Bonos por Rendimiento',
      descripcion: 'Premiaremos tu esfuerzo y disciplina en la cancha con beneficios exclusivos de la Academia.',
      icon: <Trophy size={18} />,
      color: 'bg-yellow-500',
      iconColor: 'bg-yellow-100 text-yellow-600'
    }
  ];

  // Auto-play cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === beneficios.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? beneficios.length - 1 : prev - 1));
  };

  const item = beneficios[currentIndex];

  return (
    <div className="flex flex-col w-full">
      {/* Header con flechas de control */}
      <div className="flex items-center justify-between mb-4 text-[#1e3a8a]">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-orange-500 fill-orange-500/10" />
          <h2 className="font-black uppercase tracking-tighter text-xs italic text-slate-700">Beneficios Gema</h2>
        </div>
        <div className="flex gap-1">
          <button onClick={prevSlide} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
          <button onClick={nextSlide} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Contenedor del Slide con animación simple */}
      <div className="relative overflow-hidden min-h-[120px]">
        <div 
          key={item.id} 
          className="animate-in fade-in slide-in-from-right-4 duration-500 relative bg-slate-50 rounded-[2rem] p-5 border border-slate-100"
        >
          {/* Indicador lateral */}
          <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${item.color}`}></div>

          <div className="flex gap-4">
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${item.iconColor} shadow-sm`}>
              {item.icon}
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-black text-slate-400 tracking-widest uppercase">
                {item.tipo}
              </span>
              <h4 className="text-[11px] font-black text-[#1e3a8a] leading-tight uppercase italic">
                {item.titulo}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                {item.descripcion}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores (Dots) */}
      <div className="flex justify-center gap-1.5 mt-4">
        {beneficios.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentAnnouncements;