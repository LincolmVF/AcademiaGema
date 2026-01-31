import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Importamos createPortal
import { X, Check, Clock, UserX, Save, Users } from 'lucide-react';

const AttendanceModal = ({ classData, onClose, onSave }) => {
  const [students, setStudents] = useState(classData?.students || []);

  useEffect(() => {
    // Bloqueo estricto del scroll en el body
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup para restaurar el scroll al cerrar
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    late: students.filter(s => s.status === 'late').length,
    absent: students.filter(s => s.status === 'absent').length,
  };

  const toggleStatus = (studentId, newStatus) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, status: newStatus } : s
    ));
  };

  if (!classData) return null;

  // Contenido del Modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* BACKGROUND OVERLAY: Ocupa toda la ventana y aplica el blur */}
      <div
        className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md animate-fade-in"
        onClick={onClose} // Cerrar si se hace click fuera
      />

      {/* CONTENEDOR DEL MODAL */}
      <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-scale-up">

        {/* HEADER */}
        <div className="pt-10 pb-6 px-10 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-[#1e3a8a] text-2xl uppercase tracking-tighter italic leading-none">Pasar Lista</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {classData.title} • {classData.time}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors">
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        {/* INDICADORES (STATS) */}
        <div className="flex justify-around px-10 py-4 mb-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-green-500 leading-none">{stats.present}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Presentes</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100 px-10">
            <span className="text-2xl font-black text-orange-400 leading-none">{stats.late}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Tardanzas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-red-500 leading-none">{stats.absent}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Faltas</span>
          </div>
        </div>

        {/* LISTA DE ALUMNOS */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-sm transition-colors ${student.status === 'present' ? 'bg-green-500' :
                    student.status === 'late' ? 'bg-orange-400' :
                      student.status === 'absent' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                  {student.name?.charAt(0) || '?'}
                </div>
                <div>
                  <span className="block font-black text-[#1e3a8a] text-base leading-tight">{student.name}</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Perfil Alumno</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(student.id, 'present')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'present' ? 'bg-green-500 text-white' : 'bg-slate-50 text-slate-200'
                    }`}
                >
                  <Check size={18} strokeWidth={4} />
                </button>
                <button
                  onClick={() => toggleStatus(student.id, 'late')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'late' ? 'bg-orange-400 text-white' : 'bg-slate-50 text-slate-200'
                    }`}
                >
                  <Clock size={18} strokeWidth={4} />
                </button>
                <button
                  onClick={() => toggleStatus(student.id, 'absent')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'absent' ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-200'
                    }`}
                >
                  <UserX size={18} strokeWidth={4} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-10 pb-10 bg-white">
          <button
            onClick={() => onSave(classData.id, students)}
            className="w-full bg-[#1e3a8a] hover:bg-[#0f172a] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
          >
            <Save size={18} />
            Finalizar y Guardar
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizamos usando el Portal en el body
  return createPortal(modalContent, document.body);
};

export default AttendanceModal;