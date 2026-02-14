import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { apiFetch } from '../../interceptors/api.js';
import ReportPaymentModal from './Payments/ReportPaymentModal.jsx';

const StudentPayments = ({ userId }) => {
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  // 1. Lógica de carga independiente
  const fetchPaymentData = useCallback(async () => {
    if (!userId) return;
    try {
      const [resDebts, resPay] = await Promise.all([
        apiFetch.get("/cuentaPorCobrar"),
        apiFetch.get("/pagos"),
      ]);

      const dataDebts = await resDebts.json();
      const dataPay = await resPay.json();

      setDebts((dataDebts.data || []).filter((d) => d.alumno_id === userId));
      setPayments((dataPay.data || []).filter((p) => p.cuentas_por_cobrar?.alumno_id === userId));
    } catch (error) {
      console.error("Error en pagos:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const handleOpenModal = (debt) => {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  };

  const pendientes = debts.filter(d => d.estado === 'PENDIENTE');
  const enValidacion = payments.filter(p => p.estado_validacion === 'PENDIENTE' || p.estado_validacion === 'POR_VALIDAR');

  if (loading) return <Loader2 className="animate-spin text-orange-500 mx-auto" size={20} />;

  return (
    <div className="space-y-3">
      {/* Cuentas Pendientes */}
      {pendientes.map(pago => (
        <div key={pago.id} className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition-all" onClick={() => handleOpenModal(pago)}>
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-500" size={18} />
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">{pago.catalogo_conceptos?.nombre || "Mensualidad"}</p>
              <p className="text-[8px] text-orange-600 font-bold uppercase mt-1 italic flex items-center gap-1">Reportar Pago <ChevronRight size={10} /></p>
            </div>
          </div>
          <span className="font-black text-[#1e3a8a] text-sm italic">S/ {pago.monto_final}</span>
        </div>
      ))}

      {/* Pagos en Validación */}
      {enValidacion.map(pago => (
        <div key={pago.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" size={18} />
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">En Validación</p>
              <p className="text-[8px] text-blue-600 font-bold uppercase mt-1 italic">Revisando Comprobante</p>
            </div>
          </div>
          <span className="font-black text-blue-700 text-sm italic">S/ {pago.monto_pagado}</span>
        </div>
      ))}

      {!pendientes.length && !enValidacion.length && (
        <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4 italic">Al día con tus pagos 💎</p>
      )}

      {isModalOpen && selectedDebt && (
        <ReportPaymentModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedDebt(null); }}
          debt={selectedDebt}
          onSuccess={fetchPaymentData} // ✅ Llama a la recarga local
        />
      )}
    </div>
  );
};

export default StudentPayments;