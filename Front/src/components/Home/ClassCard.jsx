import React from 'react';
import { MapPin, User, Clock, ArrowRight } from 'lucide-react';

const ClassCard = ({ category, title, time, location, coordinator, spots, price, image }) => {
  const isSoldOut = spots === 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
      {/* Imagen de cabecera de la tarjeta */}
      <div className="h-40 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider">
          {category}
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-bold border-2 border-white px-4 py-1 rounded-lg transform -rotate-12">AGOTADO</span>
          </div>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center text-blue-600 font-bold gap-1.5 bg-blue-50 px-2 py-1 rounded-lg text-sm">
            <Clock size={16} />
            {time}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${spots < 5 ? 'text-orange-600 bg-orange-50' : 'text-emerald-600 bg-emerald-50'}`}>
            {spots} cupos libres
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>

        <div className="space-y-2 mt-4 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <User size={16} className="text-slate-400" />
            <span>Coordinator {coordinator}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={16} className="text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Footer de la tarjeta (Precio y Botón) */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block">Precio sesión</span>
            <span className="text-lg font-bold text-slate-900">S/. {price}</span>
          </div>
          <button
            disabled={isSoldOut}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSoldOut ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;