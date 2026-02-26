import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Hash, Banknote, Upload, Info, Coins } from "lucide-react";
import apiFetch from "../../../interceptors/api.js";
import toast from "react-hot-toast";

const ReportPaymentModal = ({ isOpen, onClose, debt, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [voucherFile, setVoucherFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    metodo_pago: "YAPE",
    codigo_operacion: "",
    monto: ""
  });

  // Condición lógica para que el modal reaccione
  const esEfectivo = formData.metodo_pago === "EFECTIVO";

  useEffect(() => {
    if (debt) {
      const montoSugerido = debt.saldoRestante !== undefined ? debt.saldoRestante : debt.monto_final;
      setFormData(prev => ({ ...prev, monto: montoSugerido }));
    }
  }, [debt]);

  if (!isOpen || !debt) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.monto || parseFloat(formData.monto) <= 0) return toast.error("Ingresa un monto válido");

    // Si NO es efectivo, validamos campos digitales obligatoriamente
    if (!esEfectivo) {
      if (!formData.codigo_operacion.trim()) return toast.error("Código de operación requerido");
      if (!voucherFile) return toast.error("Sube la foto del voucher");
    }

    setLoading(true);
    try {
      const paymentData = new FormData();
      paymentData.append('deuda_id', parseInt(debt.id));
      paymentData.append('monto', parseFloat(formData.monto));
      paymentData.append('metodo_pago', formData.metodo_pago);

      // Enviamos un marcador para que el backend no falle por campo vacío
      paymentData.append('codigo_operacion', esEfectivo ? 'PAGO_PRESENCIAL' : formData.codigo_operacion);

      if (voucherFile && !esEfectivo) {
        paymentData.append('voucher', voucherFile);
      }

      const response = await apiFetch.post('/pagos/reportar', paymentData);

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Error al reportar");
      }

      toast.success("¡Pago reportado!");
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center">
          <div>
            <h3 className="font-black uppercase italic text-2xl">Reportar <span className="text-orange-500">Pago</span></h3>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1 italic">Club Gema - Sistema de Recaudación</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote size={12} className="text-orange-500" /> Monto a Reportar (S/)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-lg font-black text-[#1e3a8a] outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método</label>
              <select
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-xs font-bold outline-none cursor-pointer focus:border-blue-500 transition-all"
              >
                <option value="YAPE">YAPE</option>
                <option value="PLIN">PLIN</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                <option value="EFECTIVO">EFECTIVO</option>
              </select>
            </div>

            {/* REACCIÓN: Solo mostramos Cód. Operación si NO es Efectivo */}
            {!esEfectivo ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cód. Operación</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={formData.codigo_operacion}
                  onChange={(e) => setFormData({ ...formData, codigo_operacion: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <div className="bg-orange-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-orange-100 animate-in fade-in duration-500">
                <Coins size={20} className="text-orange-500 mb-1" />
                <p className="text-[8px] font-black text-orange-600 text-center uppercase leading-tight">Entrega física en recepción</p>
              </div>
            )}
          </div>

          {/* REACCIÓN: Ocultamos Voucher si es Efectivo */}
          {!esEfectivo ? (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Captura del Voucher</label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="voucher-input"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setVoucherFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              <label htmlFor="voucher-input" className="block bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-8 text-center cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all">
                {previewUrl ? (
                  <img src={previewUrl} className="h-32 mx-auto rounded-2xl shadow-md" alt="Voucher" />
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Subir Foto</p>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-3 items-center animate-in slide-in-from-bottom-2 duration-500">
              <Info size={24} className="text-blue-500 shrink-0" />
              <p className="text-[9px] font-bold text-blue-700 leading-tight uppercase italic">
                Nota: No necesitas subir foto. Acércate a la oficina de Club Gema para entregar el efectivo y validar tu pago con el administrador.
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 shadow-xl shadow-blue-900/10 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? "PROCESANDO..." : "CONFIRMAR REPORTE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPaymentModal;