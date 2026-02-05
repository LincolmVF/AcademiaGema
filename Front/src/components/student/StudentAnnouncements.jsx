import React from 'react';
import { AlertTriangle, Megaphone, ChevronRight } from 'lucide-react';

const StudentAnnouncements = () => {
  const avisos = [
    {
      id: 1,
      tipo: 'URGENTE',
      titulo: 'CAMBIO DE SEDE - SÁBADO 20',
      descripcion: 'El entrenamiento táctico se moverá al Coliseo Principal por mantenimiento.',
      icon: <AlertTriangle size={18} />,
      color: 'border-orange-500',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: 2,
      tipo: 'INFO',
      titulo: 'TORNEO RELÁMPAGO',
      descripcion: 'Inscripciones abiertas para la Copa de Verano. Consulta con tu profesor.',
      icon: <Megaphone size={18} />,
      color: 'border-blue-500',
      iconColor: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="space-y-4">
      {avisos.map((aviso) => (
        <div key={aviso.id} className={`relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md group cursor-pointer`}>
          {/* Borde lateral de color */}
          <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${aviso.color.replace('border', 'bg')}`}></div>

          <div className="flex gap-4">
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${aviso.iconColor}`}>
              {aviso.icon}
            </div>
            <div className="space-y-1 pr-4">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-slate-400 tracking-widest">{aviso.tipo}</span>
              </div>
              <h4 className="text-xs font-black text-[#1e3a8a] leading-tight uppercase">{aviso.titulo}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                {aviso.descripcion}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1e3a8a] transition-colors">
        Ver todos los avisos <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default StudentAnnouncements;