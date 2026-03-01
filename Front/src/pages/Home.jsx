import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Filters from '../components/Home/Filters';
import ClassCard from '../components/Home/ClassCard';
import Hero from '../components/Home/Hero';
import horarioService from '../services/horario.service'; //

function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [classes, setClasses] = useState([]); //
  const [loading, setLoading] = useState(true); //

  // Mapeo para coincidir el índice del filtro con el nombre en la BD
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        setLoading(true);
        const data = await horarioService.obtenerDisponibles(); //

        // Mapeamos los campos de tu BD a las props que usa ClassCard
        const formattedClasses = data.map(h => ({
          id: h.id_horario,
          title: h.nivel?.nombre || "Entrenamiento Voleibol",
          category: h.nivel?.nombre || "General",
          time: h.hora_inicio,
          location: h.sede?.nombre || "Sede Gema",
          coordinator: h.profesor ? `${h.profesor.nombre} ${h.profesor.apellido}` : "Staff Gema",
          spots: h.cupos_disponibles,
          price: h.precio || 0,
          // Imagen por defecto si la BD no trae una
          image: h.imagen_url || "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80",
          dia_nombre: h.dia_semana // Guardamos para el filtro
        }));

        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, []);

  // Filtrado dinámico
  const filteredClasses = classes.filter(clase => {
    const matchDay = clase.dia_nombre === diasSemana[activeDay];
    const matchCategory = activeCategory === 'Todas' || clase.category === activeCategory;
    return matchDay && matchCategory;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 flex flex-col overflow-x-hidden">
      <Hero />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 md:py-16 flex-grow">
        <div className="mb-6 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="h-5 w-1.5 md:h-8 bg-[#cd5a2c] rounded-full"></div>
            <h2 className="text-xl md:text-3xl font-black text-[#263e5e] uppercase italic tracking-tighter leading-tight">
              Programación <span className="text-[#cd5a2c]">Semanal</span>
            </h2>
          </div>
          <p className="text-[11px] md:text-base text-slate-500 font-medium ml-3.5 md:ml-4 leading-relaxed">
            Reserva tu cupo en nuestras clases de alto rendimiento.
          </p>

          <div className="mt-5 md:mt-8 bg-white p-1 md:p-2 rounded-xl md:rounded-3xl shadow-sm border border-slate-100 overflow-x-auto overflow-y-hidden scrollbar-hide touch-pan-x">
            <div className="inline-block min-w-full align-middle">
              <Filters
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
          </div>
        </div>

        {loading ? (
          // Spinner de carga estético
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd5a2c]"></div>
            <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cargando horarios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {filteredClasses.map((clase) => (
              <div
                key={clase.id}
                className="transform transition-all duration-300 active:scale-[0.97] md:hover:-translate-y-2"
              >
                <ClassCard {...clase} />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredClasses.length === 0 && (
          <div className="text-center py-10 md:py-24 bg-white rounded-[24px] md:rounded-[40px] border-2 border-dashed border-slate-200 shadow-inner mx-2 md:mx-0">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl md:text-4xl">🏐</span>
            </div>
            <h3 className="text-sm md:text-xl font-bold text-slate-400 uppercase tracking-widest px-4">
              Sin clases disponibles
            </h3>
            <p className="text-xs text-slate-400 mt-2">No hay sesiones para {diasSemana[activeDay]}</p>
            <button
              onClick={() => { setActiveDay(new Date().getDay()); setActiveCategory('Todas'); }}
              className="mt-6 text-[#1e3a8a] font-black uppercase text-[10px] tracking-widest py-2 px-4 bg-slate-50 rounded-lg active:bg-slate-100"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;