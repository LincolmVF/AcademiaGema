import React from 'react';
import { ChevronRight, Trophy } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden">
      
      {/* 1. IMAGEN DE FONDO 
          Usamos 'object-cover' para que cubra todo sin deformarse y 'object-center' para centrar la acción.
      */}
      <img 
        src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2000&auto=format&fit=crop" 
        alt="Voleibol Profesional" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
      />

      {/* 2. OVERLAY (Degradado) 
          Esto oscurece la imagen progresivamente para que el texto blanco se lea perfecto.
      */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>

      {/* 3. CONTENIDO 
          Usamos 'max-w-7xl' para alinear el texto con el resto de la página (el Navbar y las cards).
      */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
            <Trophy size={16} className="text-blue-400" />
            <span>Academia #1 en Formación</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Eleva tu juego al <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Siguiente Nivel
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
            Únete a la comunidad de voleibol más grande. Entrenamientos personalizados, ligas competitivas y una pasión que nos une.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:-translate-y-1">
              Matricularme Ahora
              <ChevronRight size={20} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition-all backdrop-blur-sm">
              Ver Horarios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;