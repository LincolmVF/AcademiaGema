import React from 'react';
import { QrCode, Copy, CheckCircle, Clock } from 'lucide-react';

const Payments = () => {
  const pendingPayments = [
    { id: 1, concept: "Mensualidad Mayo", amount: "150.00", due: "05 Mayo" },
  ];

  const history = [
    { id: 2, concept: "Mensualidad Abril", amount: "150.00", date: "04 Abr" },
    { id: 3, concept: "Uniforme Oficial", amount: "85.00", date: "20 Mar" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mis Pagos 💳</h1>

      {/* TARJETA DE YAPE */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-purple-200 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* QR Falso o Imagen */}
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <QrCode size={100} className="text-slate-900" /> 
            {/* <img src="/tu-qr-yape.png" alt="QR Yape" className="w-24 h-24" /> */}
          </div>

          <div className="text-center md:text-left flex-1">
            <h3 className="text-lg font-bold opacity-90 mb-1">Pagar con Yape / Plin</h3>
            <p className="text-sm opacity-80 mb-4">Escanea el QR o usa el número</p>
            
            <div className="flex items-center justify-center md:justify-start gap-3 bg-white/20 p-3 rounded-xl border border-white/10">
              <span className="text-xl font-mono font-bold tracking-wider">999 123 456</span>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Copiar">
                <Copy size={18} />
              </button>
            </div>
            <p className="text-xs mt-2 opacity-70">A nombre de: Academia Gema SAC</p>
          </div>
        </div>
      </div>

      {/* PAGOS PENDIENTES */}
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-orange-500" /> Pendientes
      </h2>
      <div className="space-y-3 mb-8">
        {pendingPayments.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">{p.concept}</p>
              <p className="text-xs text-red-500 font-medium mt-1">Vence: {p.due}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">S/. {p.amount}</p>
              <button className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg mt-1 font-medium">Reportar Pago</button>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORIAL */}
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CheckCircle size={20} className="text-green-500" /> Historial
      </h2>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {history.map((h, i) => (
          <div key={h.id} className={`p-4 flex justify-between items-center ${i !== history.length -1 ? 'border-b border-slate-50' : ''}`}>
            <div>
              <p className="font-medium text-slate-700">{h.concept}</p>
              <p className="text-xs text-slate-400">{h.date}</p>
            </div>
            <span className="font-bold text-slate-600">S/. {h.amount}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Payments;