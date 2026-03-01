import React, { useState } from 'react';
import { Mail, Phone, MapPin, Edit2, Shield, Star, ArrowLeft, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import EditProfileModal from '../../components/student/DataUsuario/EditProfileModal.jsx'; // Asegúrate de que el nombre del archivo coincida

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Navegación segura por el objeto user
  const currentUser = user?.user || user || {};
  const alumnosData = currentUser.alumnos || {};
  const direccionesData = alumnosData.direcciones || {};

  const fullName = `${currentUser.nombres || ''} ${currentUser.apellidos || ''}`.trim() || 'Alumno Gema';
  const userInitial = currentUser.nombres?.charAt(0).toUpperCase() || 'G';
  const userRole = currentUser.rol || 'Alumno';
  
  const userEmail = currentUser.email || 'No registrado';
  const userPhone = currentUser.telefono_personal || 'No registrado';
  const userAddress = direccionesData.direccion_completa 
    ? `${direccionesData.direccion_completa}, ${direccionesData.distrito || ''}` 
    : 'Dirección no registrada';
  const userMedical = alumnosData.condiciones_medicas || 'Ninguna registrada';

  const handleProfileUpdate = (newData) => {
    updateUserData(newData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">
      <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest italic">
        <ArrowLeft size={14} /> Volver
      </Link>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
          Mi <span className="text-orange-500">Perfil</span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)] mx-auto md:mx-0"></div>
      </div>

      {/* TARJETA DE CABECERA - El 'relative' aquí es CLAVE */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/60 mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
          <img src="/logo.png" alt="" className="w-40 h-auto rotate-12" />
        </div>

        {/* BOTÓN EDITAR - Ahora con fondo naranja para que resalte */}
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-6 right-6 z-10 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white p-3 rounded-2xl transition-all duration-300 shadow-sm border border-orange-100"
        >
          <Edit2 size={20} strokeWidth={2.5} />
        </button>

        <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#1e40af] to-[#0f172a] border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-white transform rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
          {userInitial}
        </div>

        <div className="flex-1 relative z-10">
          <h2 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">{fullName}</h2>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs mt-1 italic">Academia Gema</p>

          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-orange-200">
              <Shield size={12} strokeWidth={3} /> {userRole}
            </span>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-blue-100">
              <Star size={12} strokeWidth={3} /> Activo
            </span>
          </div>
        </div>
      </div>

      {/* CUERPO DE DATOS */}
      <div className="space-y-4">
        <ProfileInfoBox 
          icon={<Mail size={22} />} 
          label="Correo Electrónico" 
          value={userEmail} 
          color="blue" 
        />
        <ProfileInfoBox 
          icon={<Phone size={22} />} 
          label="Teléfono / WhatsApp" 
          value={userPhone} 
          color="orange" 
        />
        <ProfileInfoBox 
          icon={<MapPin size={22} />} 
          label="Dirección" 
          value={userAddress} 
          color="indigo" 
        />
        <ProfileInfoBox 
          icon={<HeartPulse size={22} />} 
          label="Alergias / Condiciones" 
          value={userMedical} 
          color="rose" 
        />
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentUser={currentUser}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
};

// Componente auxiliar para los items del perfil
const ProfileInfoBox = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a]",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-500",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-500"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
      <div className={`p-4 rounded-2xl transition-all duration-300 shadow-sm group-hover:text-white ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="font-bold text-[#1e3a8a] tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default Profile;