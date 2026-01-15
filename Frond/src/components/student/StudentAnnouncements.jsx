import React from 'react';
import { Megaphone, AlertCircle } from 'lucide-react';

const StudentAnnouncements = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">📢 Tablón de Anuncios</h2>
      
      <div className="space-y-3">
        {/* Aviso Importante */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm flex gap-3">
          <div className="text-amber-500 mt-1">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Cambio de Sede - Sábado 20</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              El entrenamiento táctico se moverá al Coliseo Principal por mantenimiento de la cancha 1.
            </p>
          </div>
        </div>

        {/* Aviso Informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm flex gap-3">
          <div className="text-blue-500 mt-1">
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Torneo Relámpago</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Inscripciones abiertas para la copa de verano. Habla con tu entrenador para participar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnnouncements;