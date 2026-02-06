import React from 'react';
import { CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';

const PaymentHistoryItem = ({ payment }) => {
  // Configuración de estilos según el estado de validación del backend
  const statusConfig = {
    PENDIENTE: {
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      icon: Clock,
      label: 'En Validación'
    },
    APROBADO: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      label: 'Aprobado'
    },
    RECHAZADO: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: XCircle,
      label: 'Rechazado'
    }
  };

  const config = statusConfig[payment.estado_validacion] || statusConfig.PENDIENTE;
  const Icon = config.icon;

  const formattedDate = new Date(payment.fecha_pago).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="p-6 flex justify-between items-center hover:bg-slate-50/80 transition-all duration-300 group border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-5">
        {/* Icono dinámico según estado */}
        <div className={`w-12 h-12 ${config.bgColor} ${config.color} rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        
        <div>
          <h4 className="font-black text-slate-700 text-sm uppercase italic leading-tight tracking-tight">
            {payment.cuentas_por_cobrar?.detalle_adicional || 'Pago de Cuota'}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Reportado: {formattedDate}
            </p>
            <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
            <p className={`text-[10px] font-black uppercase italic ${config.color}`}>
              {config.label}
            </p>
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="font-black text-[#1e3a8a] italic text-lg tracking-tighter">
          S/ {payment.monto_pagado}
        </span>
        {payment.url_comprobante && (
          <a 
            href={payment.url_comprobante} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black text-blue-400 uppercase flex items-center gap-1 hover:text-orange-500 mt-1 transition-colors"
          >
            Voucher <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryItem;