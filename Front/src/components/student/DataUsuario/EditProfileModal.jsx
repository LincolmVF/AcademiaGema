import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Phone, HeartPulse, MapPin } from 'lucide-react';
import apiFetch from '../../../interceptors/api.js';
import toast from 'react-hot-toast';
import { API_ROUTES } from '../../../constants/apiRoutes.js';

// Lista de distritos principales de Lima para el Combo Box
const DISTRITOS_LIMA = [
  "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", 
  "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lima (Cercado)", 
  "Lince", "Los Olivos", "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", 
  "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", 
  "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", 
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", 
  "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

const EditProfileModal = ({ isOpen, onClose, onSuccess }) => {
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

  // 🔥 EFECTO ADAPTADO: Carga datos reales desde el backend al abrir el modal
  useEffect(() => {
    const cargarDatosExpediente = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          // Consultamos el endpoint GET que une usuarios, alumnos y direcciones
          const response = await apiFetch.get(API_ROUTES.ALUMNOS.MI_PERFIL);
          const result = await response.json();

          if (response.ok && result.data) {
            const user = result.data;
            const alumno = user.alumnos || {};
            const dir = alumno.direcciones || {};

            setFormData({
              email: user.email || '',
              telefono_personal: user.telefono_personal || '',
              fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
              condiciones_medicas: alumno.condiciones_medicas || '',
              seguro_medico: alumno.seguro_medico || '',
              grupo_sanguineo: alumno.grupo_sanguineo || '',
              direccion_completa: dir.direccion_completa || '',
              distrito: dir.distrito || '',
              ciudad: dir.ciudad || 'Lima',
              referencia: dir.referencia || ''
            });
          }
        } catch (error) {
          toast.error("No se pudo precargar tu información");
        } finally {
          setLoading(false);
        }
      }
    };

    cargarDatosExpediente();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpieza dinámica para evitar enviar cadenas vacías que rompan la validación
      const payload = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.toString().trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await apiFetch.patch(API_ROUTES.ALUMNOS.MI_PERFIL, payload);
      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.errors ? result.errors[0].message : result.message;
        throw new Error(errorMsg || "Error al actualizar");
      }

      toast.success("¡Perfil actualizado con éxito!");
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
            <h3 className="font-black uppercase italic text-2xl">Mi <span className="text-orange-500">Expediente</span></h3>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1 italic">Información sincronizada con el sistema</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* SECCIÓN CONTACTO Y PERSONALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 border-b pb-2 flex items-center gap-2">
              <Phone size={14} className="text-[#1e3a8a]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto y Nacimiento</span>
            </div>
            <input type="text" placeholder="Teléfono" value={formData.telefono_personal} onChange={e => setFormData({ ...formData, telefono_personal: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            <div className="md:col-span-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase absolute -top-2 left-4 bg-white px-2">Fecha de Nacimiento</label>
                <input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({ ...formData, fecha_nacimiento: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            </div>
          </div>

          {/* SECCIÓN MÉDICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 border-b pb-2 flex items-center gap-2">
              <HeartPulse size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ficha de Salud</span>
            </div>
            <input type="text" placeholder="Alergias o condiciones" value={formData.condiciones_medicas} onChange={e => setFormData({ ...formData, condiciones_medicas: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 md:col-span-2" />
            <input type="text" placeholder="Seguro Médico (EPS/SIS)" value={formData.seguro_medico} onChange={e => setFormData({ ...formData, seguro_medico: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
            <select value={formData.grupo_sanguineo} onChange={e => setFormData({ ...formData, grupo_sanguineo: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500">
                <option value="">Grupo Sanguíneo</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* SECCIÓN UBICACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 border-b pb-2 flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</span>
            </div>
            <input type="text" placeholder="Dirección completa" value={formData.direccion_completa} onChange={e => setFormData({ ...formData, direccion_completa: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 md:col-span-2" />
            
            <select 
              value={formData.distrito} 
              onChange={e => setFormData({ ...formData, distrito: e.target.value })} 
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
            >
                <option value="">Selecciona tu Distrito</option>
                {DISTRITOS_LIMA.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <input type="text" placeholder="Referencia" value={formData.referencia} onChange={e => setFormData({ ...formData, referencia: e.target.value })} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "PROCESANDO..." : "CONFIRMAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;