import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Link, Hash, Banknote } from "lucide-react";
import toast from "react-hot-toast";

const ReportPaymentModal = ({ isOpen, onClose, debt, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  
  // Estado adaptado: de voucher_file (archivo) a voucher_url (texto)
  const [formData, setFormData] = useState({
    metodo_pago: "YAPE",
    codigo_operacion: "",
    monto: "",
    voucher_url: "", // Cambiado aquí
  });

  useEffect(() => {
    if (debt) {
      setFormData((prev) => ({
        ...prev,
        monto: debt.monto_final,
      }));
    }
  }, [debt]);

  if (!isOpen || !debt) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.codigo_operacion.trim())
      return toast.error("El código de operación es vital");
    if (!formData.monto || formData.monto <= 0)
      return toast.error("Ingresa un monto válido");
    if (!formData.voucher_url.trim()) // Validación para la URL
      return toast.error("La URL del comprobante es obligatoria");

    setLoading(true);
    try {
      // Enviamos el objeto exactamente como lo necesitas
      await onSubmit({
        deuda_id: debt.id,
        monto: parseFloat(formData.monto),
        metodo_pago: formData.metodo_pago,
        codigo_operacion: formData.codigo_operacion,
        voucher_url: formData.voucher_url,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al reportar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-zoom-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Banknote size={80} className="-rotate-12" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter text-2xl leading-none">
                Reportar <span className="text-orange-500">Pago</span>
              </h3>
              <p className="text-[10px] text-blue-300 font-black uppercase tracking-[0.2em] mt-2 italic">
                {debt.catalogo_conceptos?.nombre}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-red-500 p-2 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Monto */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote size={12} className="text-orange-500" /> Monto Confirmado (S/)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-lg font-black text-[#1e3a8a] outline-none focus:border-orange-500/50 transition-all italic"
              placeholder="0.00"
            />
          </div>

          {/* Método de Pago */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Vía de Pago
            </label>
            <select
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500/50 transition-all appearance-none"
            >
              <option value="YAPE">YAPE</option>
              <option value="PLIN">PLIN</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA BANCARIA</option>
            </select>
          </div>

          {/* Código de Operación */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Hash size={12} className="text-blue-500" /> Código de Operación
            </label>
            <input
              type="text"
              placeholder="Ej: 19283746"
              value={formData.codigo_operacion}
              onChange={(e) => setFormData({ ...formData, codigo_operacion: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* URL del Voucher (Adaptado) */}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Link size={12} className="text-blue-500" /> Link del Comprobante (Drive/Imgur)
            </label>
            <div className="relative group">
              <input
                type="url"
                placeholder="https://..."
                value={formData.voucher_url}
                onChange={(e) => setFormData({ ...formData, voucher_url: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-500/50 focus:bg-white transition-all pr-12 text-slate-600"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-all">
                <Link size={18} />
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172a] hover:bg-orange-500 text-white font-black py-5 rounded-[1.8rem] transition-all shadow-xl shadow-blue-900/20 uppercase italic tracking-[0.1em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              {loading ? "Procesando..." : "Confirmar Reporte Oficial"}
            </button>
            <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest mt-4 italic">
              * El administrador validará este código en las próximas 24h.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPaymentModal;