import React from 'react';
import { Calendar, User, ArrowRight, Trophy, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: 1,
      titulo: "5 ejercicios para mejorar tu salto vertical",
      resumen: "Descubre la rutina de pliometría que utilizan nuestros atletas de élite para dominar la red.",
      categoria: "Entrenamiento",
      autor: "Coordinator Roberto",
      fecha: "10 Feb, 2026",
      imagen: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80",
      tiempo: "5 min"
    },
    {
      id: 2,
      titulo: "Nutrición: Qué comer antes de un partido",
      resumen: "La energía es clave. Aprende a cargar glucógeno de manera eficiente sin sentir pesadez.",
      categoria: "Nutrición",
      autor: "Dra. Ana M.",
      fecha: "08 Feb, 2026",
      imagen: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      tiempo: "4 min"
    },
    {
      id: 3,
      titulo: "Mentalidad Ganadora: El set invisible",
      resumen: "Cómo manejar la presión en puntos de partido y mantener la concentración bajo estrés.",
      categoria: "Psicología",
      autor: "Staff Gema",
      fecha: "05 Feb, 2026",
      imagen: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&q=80",
      tiempo: "7 min"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 overflow-x-hidden">

      {/* --- HERO SECTION: Blog --- */}
      <section className="relative bg-[#0f172a] py-28 md:py-36 px-6 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Trophy size={14} className="text-orange-500" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Blog Club Gema</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
            ADN <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Deportivo</span>
          </h1>
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Consejos técnicos, nutrición y actualidad del voleibol para llevar tu juego al siguiente nivel.
          </p>
        </div>
      </section>

      {/* --- ARTÍCULO DESTACADO --- */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row group">
          <div className="lg:w-1/2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2000"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Destacado"
            />
          </div>
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-6">
            <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
              Tendencia
            </span>
            <h2 className="text-4xl font-black text-[#1e3a8a] uppercase italic tracking-tighter leading-tight">
              La evolución técnica del remate en el 2026
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Analizamos las nuevas tendencias tácticas que están revolucionando las ligas profesionales de voleibol este año.
            </p>
            <div className="flex items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
              <span className="flex items-center gap-2"><User size={14} /> Staff Gema</span>
              <span className="flex items-center gap-2"><Clock size={14} /> 10 min lectura</span>
            </div>
            <button className="bg-[#1e3a8a] text-white w-fit px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all flex items-center gap-3">
              Leer Artículo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* --- GRID DE NOTICIAS --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-2 bg-orange-500 rounded-full"></div>
          <h2 className="text-3xl font-black text-[#1e3a8a] uppercase italic tracking-tighter">Últimas Publicaciones</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <img src={post.imagen} className="w-full h-full object-cover" alt={post.titulo} />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">
                  {post.categoria}
                </span>
              </div>
              <div className="p-8 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.fecha}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.tiempo}</span>
                </div>
                <h3 className="text-xl font-black text-[#1e3a8a] uppercase italic tracking-tighter group-hover:text-orange-500">
                  {post.titulo}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {post.resumen}
                </p>
                <div className="pt-6 mt-auto border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400">Por {post.autor}</span>
                  <button className="text-orange-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    Leer más <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;