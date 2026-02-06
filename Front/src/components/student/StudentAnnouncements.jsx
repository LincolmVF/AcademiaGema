import React from 'react';
import { AlertTriangle, Megaphone, ChevronRight, Trophy } from 'lucide-react';

const StudentAnnouncements = () => {
  // Datos estáticos por ahora, hasta que implementemos el CRUD de avisos
  const avisos = [
    {
      id: 1,
      tipo: 'URGENTE',
      titulo: 'Mantenimiento de Cancha',
      descripcion: 'Este sábado las clases se realizarán en la Sede Norte por mantenimiento.',
      icon: <AlertTriangle size={18} />,
      color: 'bg-orange-500',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: 2,
      tipo: 'NOTICIA',
      titulo: 'Copa Gema 2026',
      descripcion: 'Ya están abiertas las inscripciones para el torneo interno. ¡Participa!',
      icon: <Trophy size={18} />,
      color: 'bg-blue-500',
      iconColor: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Título de la sección */}
      <div className="flex items-center gap-2 mb-6 text-[#1e3a8a]">
        <Megaphone size={20} className="text-orange-500 fill-orange-500/10" />
        <h2 className="font-black uppercase tracking-tighter text-sm italic">Novedades de la Academia</h2>
      </div>

      <div className="space-y-4 flex-grow">
        {avisos.map((aviso) => (
          <div 
            key={aviso.id} 
            className="relative bg-slate-50 rounded-[2rem] p-5 border border-slate-100 transition-all hover:bg-white hover:shadow-md group cursor-pointer"
          >
            {/* Indicador lateral */}
            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${aviso.color}`}></div>

            <div className="flex gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${aviso.iconColor} shadow-sm`}>
                {aviso.icon}
              </div>
              <div className="space-y-1 pr-2">
                <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">
                  {aviso.tipo}
                </span>
                <h4 className="text-xs font-black text-[#1e3a8a] leading-tight uppercase italic">
                  {aviso.titulo}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {aviso.descripcion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de acción */}
      <button className="mt-6 w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors border-t border-slate-50 pt-4">
        Ver historial de avisos <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default StudentAnnouncements;