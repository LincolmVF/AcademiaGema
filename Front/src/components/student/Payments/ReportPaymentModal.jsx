import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Hash, Banknote, Upload } from "lucide-react";
import apiFetch from "../../../interceptors/api.js"; // Importamos tu interceptor
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

  useEffect(() => {
    if (debt) setFormData(prev => ({ ...prev, monto: debt.monto_final }));
  }, [debt]);

  if (!isOpen || !debt) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.codigo_operacion.trim()) return toast.error("Código de operación requerido");
    if (!voucherFile) return toast.error("Sube la foto del voucher");

    setLoading(true);
    try {
      const paymentData = new FormData(); // Necesario para enviar archivos
      paymentData.append('deuda_id', parseInt(debt.id));
      paymentData.append('monto', parseFloat(formData.monto));
      paymentData.append('metodo_pago', formData.metodo_pago);
      paymentData.append('codigo_operacion', formData.codigo_operacion);
      paymentData.append('voucher', voucherFile);

      // Usamos el interceptor que maneja automáticamente las credenciales
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
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center">
          <h3 className="font-black uppercase italic text-2xl">Reportar <span className="text-orange-500">Pago</span></h3>
          <button onClick={onClose} className="hover:bg-red-50 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Selector de Método de Pago */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote size={12} className="text-blue-500" /> Método de Pago
            </label>
            <select 
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer"
            >
              <option value="YAPE">YAPE</option>
              <option value="PLIN">PLIN</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="EFECTIVO">EFECTIVO</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Hash size={12} className="text-blue-500" /> Código Operación
            </label>
            <input 
              type="text" 
              placeholder="Ej: 19283746" 
              value={formData.codigo_operacion} 
              onChange={(e) => setFormData({ ...formData, codigo_operacion: e.target.value })} 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Voucher (Imagen)</label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="voucher-input" 
              onChange={(e) => { 
                setVoucherFile(e.target.files[0]); 
                setPreviewUrl(URL.createObjectURL(e.target.files[0])); 
              }} 
            />
            <label htmlFor="voucher-input" className="block bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-6 text-center cursor-pointer hover:bg-blue-50 transition-all">
              {previewUrl ? <img src={previewUrl} className="h-20 mx-auto rounded-lg" alt="Voucher" /> : <Upload size={20} className="mx-auto text-slate-300" />}
              <p className="text-[10px] font-black text-slate-400 uppercase mt-2">{previewUrl ? "Imagen cargada" : "Subir Foto"}</p>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#0f172a] hover:bg-orange-500 text-white font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? "Procesando..." : "Confirmar Reporte"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPaymentModal;