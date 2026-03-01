import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Phone, HeartPulse, MapPin } from 'lucide-react';
import apiFetch from '../../../interceptors/api.js'; 
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, currentUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', telefono_personal: '', fecha_nacimiento: '',
    condiciones_medicas: '', seguro_medico: '', grupo_sanguineo: '',
    direccion_completa: '', distrito: '', ciudad: 'Lima', referencia: ''
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      const alu = currentUser.alumnos || {};
      const dir = alu.direcciones || {};
      setFormData({
        email: currentUser.email || '',
        telefono_personal: currentUser.telefono_personal || '',
        fecha_nacimiento: currentUser.fecha_nacimiento ? currentUser.fecha_nacimiento.split('T')[0] : '',
        condiciones_medicas: alu.condiciones_medicas || '',
        seguro_medico: alu.seguro_medico || '',
        grupo_sanguineo: alu.grupo_sanguineo || '',
        direccion_completa: dir.direccion_completa || '',
        distrito: dir.distrito || '',
        ciudad: dir.ciudad || 'Lima',
        referencia: dir.referencia || ''
      });
    }
  }, [currentUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🔥 LIMPIEZA: No enviamos campos vacíos para evitar errores 500
      const dataClean = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)
      );

      const response = await apiFetch.put('/alumno/mi-perfil', dataClean);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("¡Datos guardados!");
      if (onSuccess) onSuccess(result.data); 
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300 my-8">
        <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center rounded-t-[3rem]">
          <h3 className="font-black uppercase italic text-2xl">Editar <span className="text-orange-500">Perfil</span></h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Teléfono" value={formData.telefono_personal} onChange={e => setFormData({...formData, telefono_personal: e.target.value})} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
             <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
             <input type="text" placeholder="Condiciones Médicas" value={formData.condiciones_medicas} onChange={e => setFormData({...formData, condiciones_medicas: e.target.value})} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 md:col-span-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Save />} {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;