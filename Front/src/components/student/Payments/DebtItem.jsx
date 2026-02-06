import React from 'react';
import { Clock, ArrowRight, AlertCircle, CalendarDays } from 'lucide-react';

/**
 * Componente que renderiza una tarjeta de deuda individual.
 * @param {Object} debt - Objeto con los datos de la cuenta por cobrar.
 * @param {Function} onReport - Función que se dispara al querer reportar el pago.
 */
const DebtItem = ({ debt, onReport }) => {
  // Verificamos si la deuda está vencida comparando con la fecha actual
  const dueDate = new Date(debt.fecha_vencimiento);
  const isExpired = dueDate < new Date() && debt.estado === 'PENDIENTE';

  return (
    <div className={`
      relative p-6 rounded-[2.5rem] border transition-all duration-500 group
      ${isExpired 
        ? 'bg-red-50/30 border-red-100 hover:border-red-300' 
        : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-orange-200'}
    `}>
      
      {/* Badge de Estado Vencido */}
      {isExpired && (
        <div className="absolute -top-3 right-8 bg-red-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
          Vencido
        </div>
      )}

      <div className="flex flex-col gap-5">
        
        {/* Encabezado: Concepto y Monto */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-black text-[#1e3a8a] uppercase tracking-tighter text-xl leading-none italic group-hover:text-orange-600 transition-colors">
              {debt.catalogo_conceptos?.nombre || 'Concepto General'}
            </h3>
            
            <div className="flex items-center gap-2 mt-3">
              <div className={`p-1.5 rounded-lg ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-500'}`}>
                <CalendarDays size={14} strokeWidth={3} />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-red-600' : 'text-slate-400'}`}>
                Vencimiento: {dueDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-black text-[#1e3a8a] tracking-tighter italic">
              <span className="text-sm mr-1">S/</span>{debt.monto_final}
            </p>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="h-px bg-gradient-to-r from-slate-50 via-slate-100 to-transparent" />

        {/* Detalles Adicionales (si existen) */}
        {debt.detalle_adicional && (
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle size={12} />
            <p className="text-[11px] font-bold italic">{debt.detalle_adicional}</p>
          </div>
        )}

        {/* Botón para abrir el reporte de pago */}
        <button 
          onClick={() => onReport(debt)}
          className={`
            w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[11px] transition-all duration-300 shadow-lg
            ${isExpired 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' 
              : 'bg-[#1e3a8a] hover:bg-orange-500 text-white shadow-blue-900/10'}
          `}
        >
          Reportar Pago Oficial
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decoración lateral decorativa */}
      <div className={`
        absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all duration-500
        ${isExpired ? 'bg-red-500' : 'bg-orange-500 group-hover:h-20'}
      `} />
    </div>
  );
};

export default DebtItem;