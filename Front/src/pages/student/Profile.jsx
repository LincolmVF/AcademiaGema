import React from 'react';
import { Mail, Phone, MapPin, Edit2, Shield, User, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); 

  const fullName = user.user ? `${user.user.nombres} ${user.user.apellidos}` : 'Alumno Gema';
  const userInitial = user.user?.nombres?.charAt(0).toUpperCase() || 'G';
  const userRole = user.user?.rol || 'Alumno';
  const userEmail = user.user?.email || 'usuario@ejemplo.com';
  const userPhone = user.user?.telefono || '+51 987 654 321';
  const userAddress = user.user?.direccion || 'Av. Siempre Viva 123, Lima';

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">
      
      {/* HEADER DE SECCIÓN */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
          Mi <span className="text-orange-500">Perfil</span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)] mx-auto md:mx-0"></div>
      </div>

      {/* CABECERA PERFIL (ESTILO GEMA) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/60 mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
          <img src="/logo.png" alt="" className="w-40 h-auto rotate-12" />
        </div>

        <button className="absolute top-6 right-6 text-slate-300 hover:text-orange-500 p-2 transition-colors duration-300">
            <Edit2 size={20} strokeWidth={2.5} />
        </button>
        
        {/* Avatar con degradado oficial */}
        <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#1e40af] to-[#0f172a] border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
          {userInitial}
        </div>
        
        <div className="flex-1 relative z-10">
          <h2 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">{fullName}</h2>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs mt-1 italic">Academia Gema · Sub-17</p>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
             <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-orange-200 shadow-sm">
                <Shield size={12} strokeWidth={3} /> {userRole} Activo
             </span>
             <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-blue-100 shadow-sm">
                <Star size={12} strokeWidth={3} /> Elite
             </span>
          </div>
        </div>
      </div>

      {/* BLOQUE DE DATOS PERSONALES */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
            <div className="p-4 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300 shadow-sm">
                <Mail size={22} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Correo Electrónico</p>
                <p className="font-bold text-[#1e3a8a] tracking-tight">{userEmail}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <Phone size={22} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Teléfono / WhatsApp</p>
                <p className="font-bold text-[#1e3a8a] tracking-tight">{userPhone}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <MapPin size={22} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Dirección de Residencia</p>
                <p className="font-bold text-[#1e3a8a] tracking-tight">{userAddress}</p>
            </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] opacity-50">
            ID de Alumno: #2026-GEMA
        </p>
      </div>

    </div>
  );
};

export default Profile;