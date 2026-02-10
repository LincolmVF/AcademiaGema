import React from 'react';
import { Check, Crown, Rocket, Star, ShieldCheck, Zap } from 'lucide-react';

const Pricing = () => {
  const opciones = [
    {
      nombre: "Básico",
      precio: "165",
      badge: "Iniciación",
      icon: <Rocket className="text-slate-400" size={28} />,
      features: ["2 sesiones semanales", "Kit de bienvenida Gema", "Acceso a canchas libres", "Seguro médico básico"],
      color: "border-slate-100 bg-white",
      textColor: "text-[#1e3a8a]",
      btnStyle: "bg-slate-100 text-slate-900 hover:bg-slate-200"
    },
    {
      nombre: "Pro",
      precio: "275",
      badge: "Más Popular",
      recommended: true,
      icon: <Star className="text-orange-500" size={28} />,
      features: ["4 sesiones semanales", "Kit Pro (Uniforme + Bolso)", "Torneos mensuales internos", "Evaluación técnica mensual", "Plan nutricional base"],
      color: "border-orange-500 shadow-2xl shadow-orange-500/20 scale-105 bg-white z-10",
      textColor: "text-[#1e3a8a]",
      btnStyle: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30"
    },
    {
      nombre: "Elite",
      precio: "410",
      badge: "Alto Rendimiento",
      icon: <Crown className="text-yellow-500" size={28} />,
      features: ["Entrenamiento diario", "Personal trainer asignado", "Psicología deportiva", "Análisis de video pro", "Participación en liga"],
      color: "border-slate-800 bg-[#0f172a]",
      textColor: "text-white",
      btnStyle: "bg-white text-[#0f172a] hover:bg-slate-100"
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- HERO SECTION: Precios --- */}
      <section className="relative bg-[#0f172a] py-28 md:py-40 px-6 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <ShieldCheck size={14} className="text-orange-500" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Membresías Oficiales S/</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
            Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Nivel</span>
          </h1>
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Formación profesional con planes adaptados a tu ritmo de crecimiento. Sin contratos forzosos, solo resultados.
          </p>
        </div>
      </section>

      {/* --- GRID DE PRECIOS: Impacto Visual --- */}
      <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {opciones.map((opt, i) => (
            <div 
              key={i} 
              className={`relative p-10 rounded-[48px] border-2 transition-all duration-500 group flex flex-col ${opt.color}`}
            >
              {opt.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-30">
                  Más Recomendado
                </div>
              )}

              {/* Header de la Card */}
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-slate-50 rounded-3xl group-hover:scale-110 transition-transform duration-300">
                  {opt.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block">Nivel</span>
                  <span className={`text-[11px] font-bold uppercase ${opt.nombre === 'Elite' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {opt.badge}
                  </span>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-10">
                <h3 className={`text-4xl font-black uppercase italic tracking-tighter mb-4 ${opt.textColor}`}>
                  {opt.nombre}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm font-black mr-1 ${opt.nombre === 'Elite' ? 'text-orange-500' : 'text-slate-900'}`}>S/</span>
                  <span className={`text-6xl font-black tracking-tighter ${opt.textColor}`}>{opt.precio}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-2">/ Mes</span>
                </div>
              </div>

              {/* Lista de Beneficios */}
              <ul className="space-y-4 mb-12 flex-grow">
                {opt.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-500/10 p-1 rounded-full text-orange-500">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-semibold ${opt.nombre === 'Elite' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Botón de Acción */}
              <button className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:-translate-y-1 active:scale-95 ${opt.btnStyle}`}>
                Inscribirme Ahora
              </button>
            </div>
          ))}
        </div>

        {/* Garantía y Ayuda */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-[#1e3a8a] bg-blue-50 px-8 py-4 rounded-full border border-blue-100 shadow-sm">
            <Zap size={20} className="text-orange-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-center">
              Matrícula bonificada al 100% durante esta semana
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            ¿Consultas sobre pagos? <span className="text-orange-500 cursor-pointer hover:underline">Chat directo con soporte</span>
          </p>
        </div>
      </section>

      {/* --- SECCIÓN EXTRA: CTA --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#0f172a] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2000" className="w-full h-full object-cover" alt="fondo" />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-8">¿Aún no te decides?</h3>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">Agenda una clase de prueba gratuita y vive la experiencia Gema desde adentro.</p>
            <button className="bg-white text-[#0f172a] hover:bg-orange-500 hover:text-white font-black uppercase tracking-[0.2em] px-10 py-5 rounded-2xl text-sm transition-all shadow-xl hover:-translate-y-1">
              Agendar Clase de Prueba
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;