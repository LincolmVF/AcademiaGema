import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                G
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Academia<span className="text-blue-500">Gema</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Formando atletas de alto rendimiento desde 2015. Más que un deporte, construimos carácter y disciplina dentro y fuera de la cancha.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><ArrowRight size={16} className="text-slate-600" /> Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><ArrowRight size={16} className="text-slate-600" /> Nuestros Horarios</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><ArrowRight size={16} className="text-slate-600" /> Planes y Precios</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><ArrowRight size={16} className="text-slate-600" /> Blog Deportivo</a></li>
            </ul>
          </div>

          {/* Columna 3: Programas */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Programas</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Voleibol Infantil (Sub-12)</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Alto Rendimiento</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Liga Universitaria</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Vóley Playa Mixto</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Entrenamiento Personalizado</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={20} />
                <span>Av. del Deporte 123, <br />San Isidro, Lima - Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-500 shrink-0" size={20} />
                <span>+51 999 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500 shrink-0" size={20} />
                <span>contacto@academiagema.pe</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BARRA INFERIOR (Copyright) */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Academia Gema. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;