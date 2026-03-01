import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Phone, HeartPulse, MapPin } from 'lucide-react';
import apiFetch from '../../../interceptors/api.js';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, currentUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    telefono_personal: '',
    fecha_nacimiento: '',
    condiciones_medicas: '',
    seguro_medico: '',
    grupo_sanguineo: '',
    direccion_completa: '',
    distrito: '',
    ciudad: 'Lima',
    referencia: ''
  });

  // Carga los datos actuales cuando se abre el modal
  useEffect(() => {
    if (currentUser && isOpen) {
      const alumnoData = currentUser.alumnos || {};
      const dirData = alumnoData.direcciones || {};

      setFormData({
        email: currentUser.email || '',
        telefono_personal: currentUser.telefono_personal || '',
        fecha_nacimiento: currentUser.fecha_nacimiento ? currentUser.fecha_nacimiento.split('T')[0] : '',
        condiciones_medicas: alumnoData.condiciones_medicas || '',
        seguro_medico: alumnoData.seguro_medico || '',
        grupo_sanguineo: alumnoData.grupo_sanguineo || '',
        direccion_completa: dirData.direccion_completa || '',
        distrito: dirData.distrito || '',
        ciudad: dirData.ciudad || 'Lima',
        referencia: dirData.referencia || ''
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch.patch('/alumno/mi-perfil', formData);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Error al actualizar");

      toast.success("¡Perfil actualizado!");
      if (onSuccess) onSuccess(result.data);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 my-8">

        {/* HEADER */}
        <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="font-black uppercase italic text-2xl">Editar <span className="text-orange-500">Perfil</span></h3>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1 italic">Configuración de Cuenta</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* SECCIÓN CONTACTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 border-b pb-2 flex items-center gap-2">
              <Phone size={14} className="text-[#1e3a8a]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</span>
            </div>
            <input type="text" placeholder="Teléfono" value={formData.telefono_personal} onChange={e => setFormData({ ...formData, telefono_personal: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
          </div>

          {/* SECCIÓN MÉDICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 border-b pb-2 flex items-center gap-2">
              <HeartPulse size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salud</span>
            </div>
            <input type="text" placeholder="Condiciones Médicas" value={formData.condiciones_medicas} onChange={e => setFormData({ ...formData, condiciones_medicas: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 md:col-span-2" />
            <input type="text" placeholder="Seguro" value={formData.seguro_medico} onChange={e => setFormData({ ...formData, seguro_medico: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            <input type="text" placeholder="Grupo Sanguíneo" value={formData.grupo_sanguineo} onChange={e => setFormData({ ...formData, grupo_sanguineo: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "PROCESANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;