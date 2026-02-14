import React, { useState, useEffect } from "react";
import { X, Send, Loader2, Link, Hash, Banknote, Upload, Image as ImageIcon } from "lucide-react";
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

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen || !debt) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Solo se permiten archivos de imagen");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB");
        return;
      }

      setVoucherFile(file);
      
      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      // Clear URL field when file is selected
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

    // Validaciones
    if (!formData.codigo_operacion.trim())
      return toast.error("El código de operación es vital");
    if (!formData.monto || formData.monto <= 0)
      return toast.error("Ingresa un monto válido");
    if (!voucherFile && !formData.voucher_url.trim())
      return toast.error("Debes subir una imagen o proporcionar una URL del comprobante");

    setLoading(true);
    try {
      // If there's a file, we need to upload it first or send it with FormData
      let voucherUrl = formData.voucher_url;
      
      if (voucherFile) {
        // Here you would typically upload the file to your backend
        // For now, we'll include it in the submission
        const submitData = new FormData();
        submitData.append('deuda_id', debt.id);
        submitData.append('monto', parseFloat(formData.monto));
        submitData.append('metodo_pago', formData.metodo_pago);
        submitData.append('codigo_operacion', formData.codigo_operacion);
        submitData.append('voucher_file', voucherFile);
        
        await onSubmit(submitData);
      } else {
        // Send regular JSON data with URL
        await onSubmit({
          deuda_id: debt.id,
          monto: parseFloat(formData.monto),
          metodo_pago: formData.metodo_pago,
          codigo_operacion: formData.codigo_operacion,
          voucher_url: formData.voucher_url,
        });
      }
      
      onClose();
      // Reset form
      setVoucherFile(null);
      setPreviewUrl(null);
      setFormData({
        metodo_pago: "YAPE",
        codigo_operacion: "",
        monto: "",
        voucher_url: "",
      });
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

          {/* Voucher Upload/URL Section */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon size={12} className="text-blue-500" /> Comprobante de Pago
            </label>

            {/* Image Upload with Preview */}
            <div className="space-y-3">
              {previewUrl ? (
                // Preview Mode
                <div className="relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 group">
                  <div className="flex items-start gap-4">
                    <img
                      src={previewUrl}
                      alt="Vista previa del voucher"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500/30"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {voucherFile?.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            {(voucherFile?.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ImageIcon size={10} /> Imagen cargada exitosamente
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Upload Zone
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-500/50 rounded-2xl px-6 py-8 text-center transition-all group">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-blue-500/10 group-hover:bg-blue-500/20 p-4 rounded-2xl transition-all">
                        <Upload size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          Arrastra o haz clic para subir
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          PNG, JPG, JPEG (máx. 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              )}

              {/* Divider "O" */}
              {!previewUrl && (
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      O
                    </span>
                  </div>
                </div>
              )}

              {/* URL Input - only show when no file uploaded */}
              {!previewUrl && (
                <div className="relative group">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... o https://imgur.com/..."
                    value={formData.voucher_url}
                    onChange={(e) => setFormData({ ...formData, voucher_url: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-500/50 focus:bg-white transition-all pr-12 text-slate-600"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-all">
                    <Link size={18} />
                  </div>
                </div>
              )}
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