import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const StudentPayments = ({ debts, payments }) => {
  // Combinamos deudas pendientes y pagos en validación
  const pendientes = debts.filter(d => d.estado === 'PENDIENTE');
  const enValidacion = payments.filter(p => p.estado_validacion === 'PENDIENTE');

  return (
    <div className="space-y-3">
      {/* Cuentas por Cobrar */}
      {pendientes.map(pago => (
        <div key={pago.id} className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-500" size={18} />
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">{pago.detalle_adicional}</p>
              <p className="text-[8px] text-orange-600 font-bold uppercase mt-1 tracking-tighter italic">Pendiente de Reporte</p>
            </div>
          </div>
          <span className="font-black text-[#1e3a8a] text-sm italic">S/ {pago.monto_final}</span>
        </div>
      ))}

      {/* Pagos Reportados (Validando) */}
      {enValidacion.map(pago => (
        <div key={pago.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" size={18} />
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">Pago Reportado</p>
              <p className="text-[8px] text-blue-600 font-bold uppercase mt-1 tracking-tighter italic">En Validación Admin</p>
            </div>
          </div>
          <span className="font-black text-blue-700 text-sm italic">S/ {pago.monto_pagado}</span>
        </div>
      ))}

      {!pendientes.length && !enValidacion.length && (
        <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4 italic">Al día con tus pagos 💎</p>
      )}
    </div>
  );
};

export default StudentPayments;