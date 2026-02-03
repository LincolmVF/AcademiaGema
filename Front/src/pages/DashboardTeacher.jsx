import React, { useState } from 'react';
import { Users, Clock, MapPin, CheckCircle, Calendar, Zap } from 'lucide-react';
import { teacherData } from '../data/mockTeacher';
import AttendanceModal from '../components/teacher/AttendanceModal';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

const DashboardTeacher = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const { user } = useAuth(); // Obtenemos el usuario real

  // Datos dinámicos del profesor
  const coachFirstName = user?.nombres || 'Instructor';
  const coachFullName = user ? `${user.nombres} ${user.apellidos}` : 'Profesor Gema';

  const handleOpenAttendance = (clase) => {
    setSelectedClass(clase);
  };

  const handleSaveAttendance = (classId) => {
    console.log(`Guardando asistencia para la clase ${classId}...`);
    setSelectedClass(null);
    alert("¡Asistencia guardada correctamente!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-10">

      {/* 1. Header Dinámico con Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
            Hola, <span className="text-orange-500">Profe {coachFirstName}</span> 👋
          </h1>
          <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)]"></div>
          <p className="text-slate-500 mt-4 font-medium italic">Bienvenido a tu panel de gestión técnica, {coachFullName}.</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-black text-[#1e3a8a] uppercase tracking-widest">
          <Calendar size={16} className="text-orange-500" />
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* 2. Stats de Marca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teacherData.stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between group hover:-translate-y-1 transition-all">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
              <p className="text-3xl font-black text-[#1e3a8a] mt-1 tracking-tighter">{stat.value}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-[#1e3a8a] group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Zap size={22} fill="currentColor" className="opacity-20 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Lista de Clases Estilizada */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
          <h2 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tight">Programación del Día</h2>
        </div>

        <div className="grid gap-5">
          {teacherData.classes.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">

              <div className="flex gap-6 relative z-10">
                <div className={`hidden md:flex flex-col items-center justify-center w-20 h-20 rounded-2xl font-black shadow-inner transition-colors ${item.attended ? 'bg-slate-50 text-slate-300' : 'bg-[#1e3a8a] text-white'
                  }`}>
                  <span className="text-xl tracking-tighter">{item.time.split(':')[0]}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">PM</span>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-orange-100">
                      {item.level}
                    </span>
                    {item.attended && (
                      <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest border border-blue-100">
                        <CheckCircle size={12} strokeWidth={3} /> Completado
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-[#1e3a8a] uppercase tracking-tight italic group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-blue-400" /> {item.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-400" /> {item.court}</span>
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-400" /> {item.totalStudents} Inscritos</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <button
                  onClick={() => handleOpenAttendance(item)}
                  disabled={item.attended}
                  className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-lg active:scale-95 ${item.attended
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                      : 'bg-[#1e3a8a] text-white hover:bg-orange-500 shadow-blue-900/20 hover:shadow-orange-500/30'
                    }`}
                >
                  {item.attended ? 'Lista Cerrada' : 'Pasar Asistencia'}
                  {!item.attended && <ChevronRight size={16} />}
                </button>
              </div>

              <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <img src="/logo.png" alt="" className="w-32 h-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedClass && (
        <AttendanceModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
          onSave={handleSaveAttendance}
        />
      )}

      <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] opacity-50 pt-10">
        Gema Performance System · Management
      </p>

    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default DashboardTeacher;