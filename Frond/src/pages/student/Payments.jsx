import React from 'react';
import { QrCode, Copy, CheckCircle, Clock, Wallet, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Payments = () => {
  const pendingPayments = [
    { id: 1, concept: "Mensualidad Mayo", amount: "150.00", due: "05 Mayo" },
  ];

  const history = [
    { id: 2, concept: "Mensualidad Abril", amount: "150.00", date: "04 Abr" },
    { id: 3, concept: "Uniforme Oficial", amount: "85.00", date: "20 Mar" },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Número copiado al portapapeles');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">

      {/* HEADER DE SECCIÓN */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
          Centro de <span className="text-orange-500">Pagos</span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)]"></div>
        <p className="text-slate-500 mt-4 font-medium italic">Gestiona tus mensualidades y servicios deportivos.</p>
      </div>

      {/* TARJETA DE PAGO OFICIAL (Estilo Gema) */}
      <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-blue-900/40 relative overflow-hidden border border-white/10">
        {/* Marca de agua decorativa */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <img src="/logo.png" alt="" className="w-64 h-auto rotate-12" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* Contenedor QR */}
          <div className="bg-white p-4 rounded-3xl shadow-2xl transform hover:rotate-2 transition-transform duration-500">
            <QrCode size={120} className="text-[#0f172a]" strokeWidth={1.5} />
            <div className="mt-2 text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">Escaneo Oficial</div>
          </div>

          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 shadow-lg shadow-orange-500/30">
              <ShieldCheck size={12} /> Pago Seguro
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Yape / Plin</h3>
            <p className="text-sm text-blue-100/60 mb-6 font-medium">Realiza tu transferencia y reporta el comprobante debajo.</p>

            <div className="flex items-center justify-center lg:justify-start gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 group">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Número Gema</span>
                <span className="text-2xl font-black tracking-[0.15em] text-white italic">999 123 456</span>
              </div>
              <button
                onClick={() => copyToClipboard('999123456')}
                className="p-3 bg-white/10 hover:bg-orange-500 rounded-xl transition-all duration-300 shadow-lg group-hover:scale-110"
                title="Copiar Número"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="text-[10px] mt-4 font-black text-blue-200/40 uppercase tracking-[0.3em]">Titular: Academia Gema S.A.C.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* COLUMNA: PAGOS PENDIENTES */}
        <div>
          <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
            Pendientes
          </h2>
          <div className="space-y-4">
            {pendingPayments.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-4 group hover:border-orange-200 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-[#1e3a8a] uppercase tracking-tight text-lg">{p.concept}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-red-500" />
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Vence el {p.due}</p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-[#1e3a8a] tracking-tighter">S/ {p.amount}</p>
                </div>
                <button className="w-full bg-[#1e3a8a] hover:bg-orange-500 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/10 uppercase tracking-widest text-[10px]">
                  Reportar Pago
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA: HISTORIAL */}
        <div>
          <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
            Historial
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {history.map((h) => (
                <div key={h.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm leading-tight">{h.concept}</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{h.date}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-600 tracking-tighter italic">S/ {h.amount}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#1e3a8a] transition-colors">Ver historial completo</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Payments;