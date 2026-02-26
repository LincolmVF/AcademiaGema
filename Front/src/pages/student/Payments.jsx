import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../interceptors/api";
import { useAuth } from "../../context/AuthContext";
import { Loader2, History, Wallet, ArrowLeft, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import PaymentMethodCard from "../../components/student/Payments/PaymentMethodCard";
import DebtItem from "../../components/student/Payments/DebtItem";
import PaymentHistoryItem from "../../components/student/Payments/PaymentHistoryItem";
import ReportPaymentModal from "../../components/student/Payments/ReportPaymentModal";

const Payments = () => {
  const { userId } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]); 
  const [payments, setPayments] = useState([]); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      const [resDebts, resPayments] = await Promise.all([
        apiFetch.get(`/cuentaPorCobrar/historial/${userId}`),
        apiFetch.get(`/pagos/alumno/${userId}`),
      ]);

      const dataDebts = await resDebts.json();
      const dataPayments = await resPayments.json();

      if (resDebts.ok) setDebts(dataDebts.data || []);
      if (resPayments.ok) setPayments(dataPayments.data || []);
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchFinancialData();
  }, [userId, fetchFinancialData]);

  const activeDebts = debts.filter((d) => 
    ["PENDIENTE", "PARCIAL", "POR_VALIDAR"].includes(d.estado)
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={48} />
      <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">Cargando...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] mb-6 text-[10px] font-black uppercase tracking-widest italic transition-colors">
        <ArrowLeft size={14} /> REGRESAR AL PANEL
      </Link>
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-5xl font-black text-[#1e3a8a] uppercase tracking-tighter italic leading-none">
          CENTRO DE <span className="text-orange-500">PAGOS</span>
        </h1>
        <div className="h-2 w-24 bg-orange-500 rounded-full mt-3 mx-auto md:mx-0"></div>
      </div>

      <PaymentMethodCard />

      {/* AVISO DE CONTINUIDAD HORIZONTAL */}
      {activeDebts.length > 0 && (
        <div className="w-full my-12 bg-[#ff4d4d] text-white p-6 md:p-8 rounded-[3rem] shadow-2xl shadow-red-200/50 border-4 border-white flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <div className="bg-white text-[#ff4d4d] p-4 rounded-3xl shrink-0 shadow-lg">
            <ShieldAlert size={44} strokeWidth={3} />
          </div>
          <div className="max-w-4xl">
            <h4 className="font-black uppercase italic tracking-tighter text-3xl leading-none mb-2">
              AVISO DE CONTINUIDAD CRÍTICO
            </h4>
            <p className="text-[13px] font-black uppercase leading-tight tracking-wide">
              Si no liquidas el <span className="underline decoration-4 underline-offset-4 italic font-black">pago completo</span> de tus deudas, no podrás inscribirte a nuevas clases ni mantener tu continuidad en la academia.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* CUENTAS PENDIENTES */}
        <section>
          <h2 className="font-black text-[#1e3a8a] uppercase italic mb-8 flex items-center gap-3 text-2xl">
            <div className="w-3 h-8 bg-orange-500 rounded-full"></div>
            CUENTAS PENDIENTES
          </h2>
          <div className="space-y-6">
            {activeDebts.map((d) => {
              const pagado = (d.pagos || []).reduce((acc, p) => acc + parseFloat(p.monto_pagado), 0);
              const saldo = parseFloat(d.monto_final) - pagado;
              return (
                <DebtItem 
                  key={d.id} 
                  debt={{ ...d, saldoRestante: saldo, montoPagadoYa: pagado, esParcial: pagado > 0 }} 
                  onReport={(debt) => { setSelectedDebt(debt); setIsModalOpen(true); }} 
                />
              );
            })}
          </div>
        </section>

        {/* HISTORIAL DE REPORTES CON SCROLL EN TAILWIND */}
        <section className="sticky top-8">
          <h2 className="font-black text-[#1e3a8a] uppercase italic mb-8 flex items-center gap-3 text-2xl">
            <div className="w-3 h-8 bg-blue-400 rounded-full"></div>
            HISTORIAL DE REPORTES
          </h2>
          
          <div className="bg-white rounded-[2.5rem] border shadow-2xl overflow-hidden">
            {/* Altura máxima y scroll configurado con clases de Tailwind */}
            <div className="max-h-[500px] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {payments.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {payments.map((p) => (
                    <PaymentHistoryItem key={p.id} payment={p} />
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center text-slate-300 font-black uppercase italic text-xs tracking-widest">
                  Sin reportes registrados
                </div>
              )}
            </div>
          </div>
          
          {/* Indicador visual de scroll si hay muchos pagos */}
          {payments.length > 3 && (
            <div className="mt-4 flex justify-center">
               <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest animate-bounce">
                 ↓ Desliza para ver más reportes ↓
               </span>
            </div>
          )}
        </section>
      </div>

      <ReportPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debt={selectedDebt}
        onSuccess={() => fetchFinancialData()}
      />
    </div>
  );
};

export default Payments;