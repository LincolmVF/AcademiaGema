import React, { useState } from 'react';
import { X, Check, Clock, UserX, Save } from 'lucide-react';

const AttendanceModal = ({ classData, onClose, onSave }) => {
  // Estado local para manejar los cambios antes de guardar
  const [students, setStudents] = useState(classData.students || []);

  const toggleStatus = (studentId, newStatus) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status: newStatus } : s
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Tomar Asistencia</h3>
            <p className="text-sm text-slate-500">{classData.title} • {classData.time}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Lista de Alumnos (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    student.status === 'present' ? 'bg-green-100 text-green-700' :
                    student.status === 'late' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700">{student.name}</span>
                </div>

                {/* Botones de Estado */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => toggleStatus(student.id, 'present')}
                    className={`p-2 rounded-lg transition-all ${student.status === 'present' ? 'bg-green-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-100'}`}
                    title="Presente"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id, 'late')}
                    className={`p-2 rounded-lg transition-all ${student.status === 'late' ? 'bg-orange-400 text-white shadow-md' : 'text-slate-300 hover:bg-slate-100'}`}
                    title="Tardanza"
                  >
                    <Clock size={18} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id, 'absent')}
                    className={`p-2 rounded-lg transition-all ${student.status === 'absent' ? 'bg-red-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-100'}`}
                    title="Ausente"
                  >
                    <UserX size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-4">No hay alumnos registrados en esta clase.</p>
          )}
        </div>

        {/* Footer con Botón Guardar */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <button 
            onClick={() => onSave(classData.id)}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            <Save size={20} />
            Guardar Asistencia
          </button>
        </div>

      </div>
    </div>
  );
};

export default AttendanceModal;