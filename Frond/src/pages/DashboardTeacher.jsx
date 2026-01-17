import React, { useState } from 'react';
import { Users, Clock, MapPin, CheckCircle, Calendar } from 'lucide-react';
import { teacherData } from '../data/mockTeacher';
import AttendanceModal from '../components/teacher/AttendanceModal';

const DashboardTeacher = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleOpenAttendance = (clase) => {
    setSelectedClass(clase);
  };

  const handleSaveAttendance = (classId) => {
    // Aquí iría la lógica para enviar a backend
    console.log(`Guardando asistencia para la clase ${classId}...`);
    setSelectedClass(null); // Cerrar modal
    alert("¡Asistencia guardada correctamente!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* 1. Header Simple */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hola, Profe Carlos 👋</h1>
          <p className="text-slate-500">Aquí tienes tu programación de hoy.</p>
        </div>
        <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* 2. Resumen Rápido (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teacherData.stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
              <Calendar size={20} /> 
            </div>
          </div>
        ))}
      </div>

      {/* 3. Lista de Clases */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Mis Clases de Hoy</h2>
        <div className="grid gap-4">
          {teacherData.classes.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Info Izquierda */}
              <div className="flex gap-4">
                <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-xl font-bold">
                  <span>{item.time.split(':')[0]}</span>
                  <span className="text-xs font-normal">PM</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                      {item.level}
                    </span>
                    {item.attended && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle size={10} /> Completado
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={14}/> {item.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {item.court}</span>
                    <span className="flex items-center gap-1"><Users size={14}/> {item.totalStudents} alumnos</span>
                  </div>
                </div>
              </div>

              {/* Botón de Acción */}
              <div>
                <button 
                  onClick={() => handleOpenAttendance(item)}
                  disabled={item.attended}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    item.attended 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200'
                  }`}
                >
                   {item.attended ? 'Asistencia Lista' : 'Marcar Asistencia'}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 4. Modal Emergente (Se renderiza condicionalmente) */}
      {selectedClass && (
        <AttendanceModal 
          classData={selectedClass} 
          onClose={() => setSelectedClass(null)}
          onSave={handleSaveAttendance}
        />
      )}

    </div>
  );
};

export default DashboardTeacher;