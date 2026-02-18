import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Loader2, Receipt } from 'lucide-react';
import { apiFetch } from '../../interceptors/api.js';
import ReportPaymentModal from './Payments/ReportPaymentModal.jsx';

const StudentPayments = ({ userId }) => {
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const fetchPaymentData = useCallback(async () => {
    if (!userId) return;
    try {
      const [resDebts, resPay] = await Promise.all([
        apiFetch.get("/cuentaPorCobrar"),
        apiFetch.get("/pagos"),
      ]);

      const dataDebts = await resDebts.json();
      const dataPay = await resPay.json();

      // Filtramos las deudas por el ID del alumno
      setDebts((dataDebts.data || []).filter((d) => d.alumno_id === userId));
      
      // Ajuste según tu JSON: accedemos a cuentas_por_cobrar para filtrar por alumno_id
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

  // Filtrado de estados
  const pendientes = debts.filter(d => d.estado === 'PENDIENTE');
  // Se muestran los que están en proceso de validación por la administración
  const enValidacion = payments.filter(p => 
    p.estado_validacion === 'PENDIENTE' || p.estado_validacion === 'POR_VALIDAR'
  );

  if (loading) return (
    <div className="flex justify-center py-4">
      <Loader2 className="animate-spin text-orange-500" size={24} />
    </div>
  );

  return (
    <div className="space-y-3">
      {/* 1. Cuentas por Cobrar (Pendientes de reportar) */}
      {pendientes.map(pago => (
        <div 
          key={pago.id} 
          className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition-all group" 
          onClick={() => handleOpenModal(pago)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">
                {pago.catalogo_conceptos?.nombre || "Mensualidad"}
              </p>
              <p className="text-[8px] text-orange-600 font-bold uppercase mt-1 italic flex items-center gap-1">
                Reportar Pago <ChevronRight size={10} />
              </p>
            </div>
          </div>
          <span className="font-black text-[#1e3a8a] text-sm italic">S/ {pago.monto_final}</span>
        </div>
      ))}

      {/* 2. Pagos Realizados (En espera de validación) */}
      {enValidacion.map(pago => (
        <div key={pago.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-500">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1e3a8a] uppercase leading-none">En Validación</p>
              <p className="text-[8px] text-blue-600 font-bold uppercase mt-1 italic">
                {pago.cuentas_por_cobrar?.detalle_adicional || "Revisando Comprobante"}
              </p>
            </div>
          </div>
          <span className="font-black text-blue-700 text-sm italic">S/ {pago.monto_pagado}</span>
        </div>
      ))}

      {/* 3. Estado: Sin registros */}
      {!pendientes.length && !enValidacion.length && (
        <div className="flex flex-col items-center justify-center py-6 opacity-60">
          <Receipt className="text-slate-300 mb-2" size={32} />
          <p className="text-[10px] text-slate-400 font-black uppercase text-center italic tracking-widest">
            No hay pagos registrados / Al día 💎
          </p>
        </div>
      )}

      {/* Modal para reportar el pago */}
      {isModalOpen && selectedDebt && (
        <ReportPaymentModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedDebt(null); }}
          debt={selectedDebt}
          onSuccess={fetchPaymentData} 
        />
      )}
    </div>
  );
};

export default StudentPayments;