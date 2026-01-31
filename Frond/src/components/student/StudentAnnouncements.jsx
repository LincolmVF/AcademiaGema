import React from 'react';
import { Megaphone, AlertTriangle, BellRing, ChevronRight } from 'lucide-react';

const StudentAnnouncements = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <BellRing size={20} className="text-[#1e3a8a]" />
          <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter">Comunicados</h2>
        </div>
        <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md tracking-widest uppercase">
          En Vivo
        </span>
      </div>

      <div className="space-y-4">
        {/* AVISO CRÍTICO: Cambio de Sede (Acento Naranja Gema) */}
        <div className="group bg-white border border-slate-100 p-5 rounded-3xl shadow-xl shadow-slate-200/50 flex gap-4 relative overflow-hidden transition-all hover:border-orange-200">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-orange-500 shadow-[2px_0_10px_rgba(249,115,22,0.4)]"></div>

          <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            <AlertTriangle size={22} strokeWidth={2.5} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-[#1e3a8a] text-sm uppercase tracking-tight">Cambio de Sede · Sábado 20</h3>
              <span className="text-[9px] font-bold text-slate-400">URGENTE</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              El entrenamiento táctico se moverá al <span className="text-orange-600 font-bold italic">Coliseo Principal</span> por mantenimiento de canchas.
            </p>
          </div>
        </div>

        {/* AVISO INFORMATIVO: Torneo (Acento Azul Gema) */}
        <div className="group bg-white border border-slate-100 p-5 rounded-3xl shadow-xl shadow-slate-200/50 flex gap-4 relative overflow-hidden transition-all hover:border-blue-200">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#1e3a8a]"></div>

          <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
            <Megaphone size={22} strokeWidth={2.5} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-[#1e3a8a] text-sm uppercase tracking-tight">Torneo Relámpago</h3>
              <span className="text-[9px] font-bold text-slate-400">INFO</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              Inscripciones abiertas para la <span className="text-[#1e3a8a] font-bold">Copa de Verano</span>. Consulta con tu profesor para participar.
            </p>
          </div>
        </div>
      </div>

      {/* Botón Ver Más */}
      <button className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#1e3a8a] transition-colors group">
        Ver todos los avisos
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default StudentAnnouncements;