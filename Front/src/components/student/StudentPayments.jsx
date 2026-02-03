import React from 'react';
import { CreditCard, CheckCircle2, Clock, ChevronRight, Wallet } from 'lucide-react';

const paymentsData = [
  { id: 1, concept: 'Mensualidad Abril', amount: 'S/ 150.00', date: '05 Abr', status: 'Pendiente' },
  { id: 2, concept: 'Uniforme Oficial', amount: 'S/ 85.00', date: '20 Mar', status: 'Pagado' },
  { id: 3, concept: 'Mensualidad Marzo', amount: 'S/ 150.00', date: '05 Mar', status: 'Pagado' },
];

const StudentPayments = () => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-[#1e3a8a]" />
          <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter">Estado de Pagos</h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {paymentsData.map((item) => (
            <div
              key={item.id}
              className="p-6 flex justify-between items-center hover:bg-slate-50 transition-all group"
            >
              <div className="flex gap-4 items-center">
                {/* Icono de estado dinámico */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${item.status === 'Pendiente'
                    ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                    : 'bg-blue-50 text-blue-600'
                  }`}>
                  {item.status === 'Pendiente' ? <Clock size={22} /> : <CheckCircle2 size={22} />}
                </div>

                <div className="flex flex-col">
                  <span className="font-black text-[#1e3a8a] text-sm uppercase tracking-tight">
                    {item.concept}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    Vencimiento: {item.date}
                  </span>

                  {item.status === 'Pendiente' && (
                    <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black py-2 px-4 rounded-xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2 w-fit">
                      Pagar Ahora
                      <CreditCard size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <p className="font-black text-[#1e3a8a] text-lg tracking-tighter leading-none">
                  {item.amount}
                </p>
                <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'Pendiente'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                  <div className={`w-1 h-1 rounded-full ${item.status === 'Pendiente' ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}></div>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer de la tarjeta con resumen sutil */}
        <div className="bg-slate-50 p-4 text-center">
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#1e3a8a] transition-all flex items-center justify-center gap-2 w-full group">
            Descargar Historial de Pagos
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;