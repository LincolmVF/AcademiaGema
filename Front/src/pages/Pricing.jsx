import React, { useState, useEffect } from 'react';
import { Check, Rocket, Star, Zap, MapPin, Trophy, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { catalogoService } from '../services/catalogo.service';

const Pricing = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await catalogoService.getVigentes();
        if (response.success) {
          // Mapeamos los datos de la DB a los estilos del front
          const planesConfigurados = response.data.map((plan, index) => {
            // Lógica para asignar iconos y badges según el plan (ejm: por índice o nombre)
            let config = {
              badge: "Membresía",
              icon: <Rocket className="text-blue-600" size={26} />,
              features: [plan.nombre, "Acceso prioritario", "Comunidad oficial"],
              color: "border-slate-200 bg-white",
              textColor: "text-[#1e3a8a]",
              btnStyle: "bg-slate-100 text-[#1e3a8a] hover:bg-blue-100",
              recommended: false
            };

            if (index === 1) { // El del medio por defecto
              config.badge = "Más Versátil";
              config.icon = <MapPin className="text-blue-600" size={26} />;
              config.color = "border-blue-200 shadow-[0_20px_50px_rgba(249,115,22,0.1)] scale-105 bg-white";
              config.btnStyle = "bg-[#1e3a8a] text-white hover:bg-[#162a63] shadow-lg shadow-blue-900/20";
            }

            if (index === 2 || plan.precio_base >= 180) { // El más caro o el tercero
              config.badge = "Elite";
              config.recommended = true;
              config.icon = <Star className="text-orange-500" size={26} />;
              config.color = "border-orange-500 shadow-[0_20px_50px_rgba(249,115,22,0.1)] scale-105 bg-white z-10";
              config.btnStyle = "bg-[#f97316] text-white hover:bg-[#ea580c] shadow-xl shadow-orange-500/30";
            }

            // Si el plan tiene metadata de clases semanales de la DB, lo usamos
            const features = [
              plan.cantidad_clases_semanal ? `${plan.cantidad_clases_semanal} Sesiones semanales` : "Sesiones flexibles",
              "Kit de bienvenida",
              "Seguimiento técnico"
            ];

            return {
              ...plan,
              ...config,
              features
            };
          });
          setPlanes(planesConfigurados);
        }
      } catch (err) {
        console.error("Error fetching planes:", err);
        setError("No pudimos cargar los planes en este momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-48 bg-[#0f172a] px-6 overflow-hidden">
        {/* Unificación de luces de fondo con la paleta */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Trophy size={14} className="text-orange-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Temporada 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Plan de Juego</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Formación de alto rendimiento con la misma pasión en cada nivel.
          </p>
        </div>
      </section>

      {/* --- GRID DE PRECIOS --- */}
      <section className="relative z-20 -mt-28 max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/10">
            <Loader2 className="text-orange-500 animate-spin mb-4" size={48} />
            <p className="text-white font-bold tracking-widest uppercase text-xs">Cargando niveles de formación...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[3rem] text-center">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
            {planes.map((opt) => (
              <div 
                key={opt.id} 
                className={`relative p-8 lg:p-10 rounded-[3rem] border-2 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 ${opt.color}`}
              >
                {opt.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f97316] text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> RECOMENDADO
                  </div>
                )}

                {/* Icon & Badge - Unificados */}
                <div className="flex justify-between items-center mb-10">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    {opt.icon}
                  </div>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200/50">
                    {opt.badge}
                  </span>
                </div>

                {/* Area de Precio - Consistente con el Azul */}
                <div className="mb-8">
                  <h3 className={`text-xl font-black uppercase italic tracking-tighter mb-2 ${opt.textColor}`}>
                    {opt.nombre}
                  </h3>
                  <div className="flex items-start gap-1">
                    <span className="text-lg font-black text-slate-900 mt-1">S/</span>
                    <span className={`text-7xl font-black tracking-tighter leading-none ${opt.textColor}`}>{Math.round(opt.precio_base)}</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest self-end mb-2 ml-1">/ mes</span>
                  </div>
                </div>

                {/* Features - Iconos verdes unificados */}
                <div className="space-y-4 mb-10 flex-grow">
                  {opt.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <p className="text-sm font-bold text-slate-600 tracking-tight italic">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Botones con paleta unificada */}
                <Link 
                  to="/register" 
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all active:scale-95 flex items-center justify-center gap-2 group/btn ${opt.btnStyle}`}
                >
                  Inscribirme 
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Garantía - Paleta Azul/Naranja */}
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-4 bg-white p-3 pr-10 rounded-full border border-blue-100 shadow-xl">
             <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                <ShieldCheck size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f97316]">Promoción Especial</p>
                <p className="text-sm text-[#1e3a8a] font-bold tracking-tight">Matrícula 100% bonificada en tu primera inscripción</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN INFERIOR --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-[#0f172a] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2000" className="w-full h-full object-cover" alt="voleibol" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-tight mb-8 tracking-tighter">
              ¿Quieres sentir la <span className="text-orange-500 text-glow">Energía</span>?
            </h3>
            <p className="text-slate-400 mb-12 text-lg md:text-xl font-medium leading-relaxed">
              Agenda una clase de prueba y conoce por qué somos el club #1 en alto rendimiento. Sin compromiso, solo deporte.
            </p>
            <Link to="/register" className="bg-[#f97316] text-white hover:bg-white hover:text-[#0f172a] font-black uppercase tracking-[0.2em] px-12 py-6 rounded-3xl text-sm transition-all shadow-2xl shadow-orange-500/20 hover:-translate-y-2 inline-flex items-center gap-3">
              ¡Quiero mi clase gratis!
              <Rocket size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;