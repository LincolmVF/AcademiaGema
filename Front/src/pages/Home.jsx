import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Filters from '../components/Home/Filters';
import ClassCard from '../components/Home/ClassCard';
import Hero from '../components/Home/Hero';

function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Datos simulados (Mock Data)
  const classes = [
    { id: 1, title: "Fundamentos de Voleibol", category: "Principiantes", time: "08:00 AM", location: "Cancha Techada 1", coach: "Ana Martínez", spots: 8, price: 15, image: "https://i.ytimg.com/vi/_EtzSWP8Yd0/maxresdefault.jpg" },
    { id: 2, title: "Táctica Defensiva Pro", category: "Avanzados", time: "10:00 AM", location: "Cancha Principal", coach: "Roberto Gómez", spots: 0, price: 25, image: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80" },
    { id: 3, title: "Vóley Playa Mixto", category: "Vóley Playa", time: "15:00 PM", location: "Arena Externa", coach: "Carla & Diego", spots: 4, price: 20, image: "https://f.rpp-noticias.io/2025/06/06/064106_1754638.jpg?width=860&quality=80" },
    { id: 4, title: "Saque y Recepción", category: "Intermedios", time: "17:30 PM", location: "Cancha Techada 2", coach: "Ana Martínez", spots: 12, price: 18, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNfPHjsadDY9cAN3LfzJAte6vKJOHfvcydUQ&s" },
    { id: 5, title: "Entrenamiento Físico", category: "Todas", time: "19:00 PM", location: "Gimnasio A", coach: "Marcos Fit", spots: 20, price: 10, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80" },
    { id: 6, title: "Liga Nocturna", category: "Avanzados", time: "20:30 PM", location: "Coliseo Central", coach: "Staff Gema", spots: 2, price: 30, image: "https://pbs.twimg.com/media/EP456OMX4AEymmk.jpg" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 flex flex-col">
      <Hero />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex-grow">

        {/* Sección de Encabezado de Clases */}
        <div className="mb-8 md:mb-12 px-4 md:px-0"> {/* Añadido padding lateral en móvil */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1.5 md:h-8 bg-[#cd5a2c] rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-[#263e5e] uppercase italic tracking-tighter leading-none">
              Programación <span className="text-[#cd5a2c]">Semanal</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium ml-4.5 md:ml-4">
            Reserva tu cupo en nuestras clases de alto rendimiento.
          </p>

          {/* Filtros: En móvil ocupan el ancho completo y permiten scroll si es necesario */}
          <div className="mt-6 md:mt-8 bg-white p-1.5 md:p-2 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
            <Filters
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        </div>

        {/* Grid Responsivo con Hover Effects */}
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {classes.map((clase) => (
            <div key={clase.id} className="transform transition-transform duration-300 hover:-translate-y-2">
              <ClassCard {...clase} />
            </div>
          ))}
        </div>

        {/* Estado vacío (si no hay clases) */}
        {classes.length === 0 && (
          <div className="mx-4 md:mx-0 text-center py-16 md:py-24 bg-white rounded-[32px] md:rounded-[40px] border-2 border-dashed border-slate-200 shadow-inner">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl md:text-4xl text-slate-300">🏐</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-400 uppercase tracking-widest px-4">
              Sin clases disponibles
            </h3>
            <p className="text-sm md:text-base text-slate-400 mt-2 px-6">
              Intenta cambiar los filtros de día o categoría.
            </p>
            <button
              onClick={() => { setActiveDay(0); setActiveCategory('Todas'); }}
              className="mt-6 text-[#1e3a8a] font-black uppercase text-[10px] md:text-xs tracking-widest hover:text-orange-500 transition-colors p-2"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;