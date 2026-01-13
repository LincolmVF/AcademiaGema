import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Filters from '../components/Filters';
import ClassCard from '../components/ClassCard';
import Hero from '../components/Hero';

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
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 flex flex-col">
      
      <Navbar />

      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Programación Semanal</h2>
          <Filters 
            activeDay={activeDay} 
            setActiveDay={setActiveDay} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
        </div>

        {/* --- GRID RESPONSIVO (La parte clave) --- 
            - grid-cols-1: En celular (1 columna)
            - md:grid-cols-2: En tablet (2 columnas)
            - lg:grid-cols-3: En escritorio (3 columnas)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((clase) => (
            <ClassCard 
              key={clase.id}
              {...clase} // Pasamos todas las propiedades del objeto a la tarjeta
            />
          ))}
        </div>

        {/* Estado vacío (si no hay clases) */}
        {classes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400">No hay clases disponibles para este filtro.</p>
          </div>
        )}

      </main>

      <Footer />

    </div>
  );
}

export default Home;