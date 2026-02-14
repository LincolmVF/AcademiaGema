import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Link, Hash, Banknote, Upload, Image as ImageIcon } from "lucide-react";
import { apiFetch } from "../../../interceptors/api.js";
import toast from "react-hot-toast";

const ReportPaymentModal = ({ isOpen, onClose, debt, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [voucherFile, setVoucherFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    metodo_pago: "YAPE",
    codigo_operacion: "",
    monto: "",
    voucher_url: "",
  });

  useEffect(() => {
    if (debt) {
      setFormData((prev) => ({
        ...prev,
        monto: debt.monto_final,
      }));
    }
  }, [debt]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen || !debt) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return toast.error("Solo se permiten archivos de imagen");
      }
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("La imagen no debe superar 5MB");
      }
      setVoucherFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData({ ...formData, voucher_url: "" });
    }
  };

  const handleRemoveFile = () => {
    setVoucherFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.codigo_operacion.trim())
    return toast.error("El código de operación es vital");
  if (!formData.monto || formData.monto <= 0)
    return toast.error("Ingresa un monto válido");
  if (!voucherFile && !formData.voucher_url.trim())
    return toast.error("Debes subir una imagen o proporcionar una URL");
  setLoading(true);
  try {
    // 🚀 NUEVA FORMA: Enviar todo en un solo request con FormData
    const paymentData = new FormData();
    paymentData.append('deuda_id', parseInt(debt.id));
    paymentData.append('monto', parseFloat(formData.monto));
    paymentData.append('metodo_pago', formData.metodo_pago);
    paymentData.append('codigo_operacion', formData.codigo_operacion);
    
    // Si hay archivo, agregarlo al FormData
    if (voucherFile) {
      paymentData.append('voucher', voucherFile);
    } 
    // Si no hay archivo pero hay URL, agregarla
    else if (formData.voucher_url) {
      paymentData.append('voucher_url', formData.voucher_url);
    }
    // ✅ UN SOLO REQUEST: El backend se encarga de subir a Cloudinary
    const response = await apiFetch('/pagos/reportar', {
      method: 'POST',
      body: paymentData, // No envíes Content-Type, fetch lo maneja automáticamente con FormData
    });
    if (!response.ok) throw new Error("Error al reportar pago");
    const result = await response.json();
    
    toast.success("¡Pago reportado exitosamente!");
    onSubmit(result.data); // Pasas el resultado al componente padre si es necesario
    
    onClose();
    handleRemoveFile();
    setFormData({
      metodo_pago: "YAPE",
      codigo_operacion: "",
      monto: "",
      voucher_url: "",
    });
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Error al procesar el pago");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
        
        {/* Header con diseño deportivo */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Banknote size={80} className="-rotate-12" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="font-black uppercase italic tracking-tighter text-2xl">
                Reportar <span className="text-orange-500">Pago</span>
              </h3>
              <p className="text-[10px] text-blue-300 font-black uppercase tracking-[0.2em] mt-2 italic">
                {debt.catalogo_conceptos?.nombre}
              </p>
            </div>
            <button onClick={onClose} className="bg-white/10 hover:bg-red-500 p-2 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Input Monto */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Banknote size={12} className="text-orange-500" /> Monto Confirmado (S/)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-lg font-black text-[#1e3a8a] outline-none italic"
              placeholder="0.00"
            />
          </div>

          {/* Select Método */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vía de Pago</label>
            <select
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none appearance-none"
            >
              <option value="YAPE">YAPE</option>
              <option value="PLIN">PLIN</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA BANCARIA</option>
            </select>
          </div>

          {/* Input Código */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Hash size={12} className="text-blue-500" /> Código de Operación
            </label>
            <input
              type="text"
              placeholder="Ej: 19283746"
              value={formData.codigo_operacion}
              onChange={(e) => setFormData({ ...formData, codigo_operacion: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
            />
          </div>

          {/* Sección de Voucher */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon size={12} className="text-blue-500" /> Comprobante
            </label>

            {previewUrl ? (
              <div className="relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <img src={previewUrl} alt="Voucher" className="w-24 h-24 object-cover rounded-xl border-2 border-blue-500/30" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{voucherFile?.name}</p>
                      <button type="button" onClick={handleRemoveFile} className="text-red-500 hover:bg-red-50 p-1 rounded-md">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[9px] text-green-600 font-black mt-2 uppercase italic tracking-tighter">Listo para subir</p>
                  </div>
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-400 rounded-2xl py-6 text-center transition-all">
                  <Upload size={20} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">Subir Foto Voucher</p>
                </div>
              </label>
            )}
            
            {!previewUrl && (
              <div className="relative mt-2">
                <input
                  type="url"
                  placeholder="O pega la URL del comprobante..."
                  value={formData.voucher_url}
                  onChange={(e) => setFormData({ ...formData, voucher_url: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-[10px] font-bold outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f172a] hover:bg-orange-500 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-lg uppercase italic tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? "Sincronizando..." : "Confirmar Reporte"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPaymentModal;