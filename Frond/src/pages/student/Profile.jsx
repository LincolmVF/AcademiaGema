import React from 'react';
import { Mail, Phone, MapPin, Edit2, Shield } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mi Perfil 👤</h1>

      {/* CABECERA PERFIL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 p-2">
            <Edit2 size={18} />
        </button>
        
        <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600">
          JM
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">Juan Mercado</h2>
          <p className="text-slate-500 font-medium">Categoría Sub-17</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
             <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Shield size={12} /> Activo
             </span>
          </div>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="grid gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                <Mail size={20} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Correo Electrónico</p>
                <p className="font-medium text-slate-800">juan.mercado@gmail.com</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                <Phone size={20} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Teléfono / WhatsApp</p>
                <p className="font-medium text-slate-800">+51 987 654 321</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                <MapPin size={20} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Dirección</p>
                <p className="font-medium text-slate-800">Av. Siempre Viva 123, Lima</p>
            </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">ID de Alumno: #2024-8891</p>
      </div>

    </div>
  );
};

export default Profile;