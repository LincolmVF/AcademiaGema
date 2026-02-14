import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../interceptors/api";
import { useAuth } from "../../context/AuthContext";
import { Loader2, History, Wallet } from "lucide-react";
import toast from "react-hot-toast";

// Componentes Modulares
import PaymentMethodCard from "../../components/student/Payments/PaymentMethodCard";
import DebtItem from "../../components/student/Payments/DebtItem";
import PaymentHistoryItem from "../../components/student/Payments/PaymentHistoryItem";
import ReportPaymentModal from "../../components/student/Payments/ReportPaymentModal";

const Payments = () => {
  const { userId } = useAuth(); // Usamos userId directamente del contexto
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]); // Para Cuentas por Cobrar
  const [payments, setPayments] = useState([]); // Para Historial de Pagos

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      const [resDebts, resPayments] = await Promise.all([
        apiFetch.get("/cuentaPorCobrar"),
        apiFetch.get("/pagos"),
      ]);

      const dataDebts = await resDebts.json();
      const dataPayments = await resPayments.json();

      if (resDebts.ok) {
        const myDebts = (dataDebts.data || []).filter(
          (d) => d.alumno_id === userId,
        );
        setDebts(myDebts);
      }

      if (resPayments.ok) {
        const myHistory = (dataPayments.data || []).filter(
          (p) => p.cuentas_por_cobrar?.alumno_id === userId,
        );
        setPayments(myHistory);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el servidor financiero");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFinancialData();
    }
  }, [userId, fetchFinancialData]);

  // Clasificación de la UI basada en el estado real de la BD
  // Solo se muestran en pendientes los que tienen estado "PENDIENTE"
  const pending = debts.filter((d) => d.estado === "PENDIENTE");

  const handleOpenModal = (debt) => {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  };

  const handleReportSuccess = () => {
    toast.success("Pago reportado exitosamente. Pendiente de validación.");
    fetchFinancialData();
    setIsModalOpen(false);
    setSelectedDebt(null);
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2
          className="animate-spin text-orange-500"
          size={48}
          strokeWidth={3}
        />
        <p className="font-black text-[#1e3a8a] uppercase italic text-xs tracking-widest">
          Accediendo al centro de pagos...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in-up pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-[#1e3a8a] uppercase tracking-tighter italic leading-none">
          Centro de <span className="text-orange-500">Pagos</span>
        </h1>
        <div className="h-2 w-24 bg-orange-500 rounded-full mt-3 shadow-lg mx-auto md:mx-0"></div>
      </div>

      <PaymentMethodCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* COLUMNA: CUENTAS PENDIENTES */}
        <section>
          <h2 className="font-black text-[#1e3a8a] uppercase italic mb-8 flex items-center gap-3 text-xl">
            <div className="w-3 h-8 bg-orange-500 rounded-full shadow-lg shadow-orange-200"></div>
            Cuentas Pendientes
          </h2>
          <div className="space-y-6">
            {pending.length > 0 ? (
              pending.map((d) => (
                <DebtItem key={d.id} debt={d} onReport={handleOpenModal} />
              ))
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                <Wallet className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-black text-slate-400 uppercase italic text-[10px] tracking-widest">
                  No tienes deudas pendientes de pago
                </p>
              </div>
            )}
          </div>
        </section>

        {/* COLUMNA: HISTORIAL DE REPORTES */}
        <section>
          <h2 className="font-black text-[#1e3a8a] uppercase italic mb-8 flex items-center gap-3 text-xl">
            <div className="w-3 h-8 bg-blue-400 rounded-full shadow-lg shadow-blue-100"></div>
            Historial de Reportes
          </h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[200px]">
            {payments.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {payments.map((p) => (
                  <PaymentHistoryItem key={p.id} payment={p} />
                ))}
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <History className="text-slate-100" size={56} />
                <p className="font-black text-slate-300 uppercase italic text-[10px] tracking-[0.2em]">
                  Sin reportes registrados
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <ReportPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDebt(null);
        }}
        debt={selectedDebt}
        onSuccess={handleReportSuccess}
      />
    </div>
  );
};

export default Payments;
