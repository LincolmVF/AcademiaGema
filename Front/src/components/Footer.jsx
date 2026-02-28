import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Planes', path: '/pricing' },
    { name: 'Blog Deportivo', path: '/blog' },
  ];

  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-12 md:pt-20 pb-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* GRID PRINCIPAL: 3 Columnas reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Columna 1: Marca */}
          <div className="flex flex-col items-start space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-lg border border-white/10 group-hover:rotate-3 transition-transform">
                <span className="text-white font-black text-lg md:text-xl italic">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                  Academia<span className="text-orange-500">Gema</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mt-1">
                  Explota tu máximo nivel
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Formando atletas de alto rendimiento desde 2015. Nuestra metodología se basa en la disciplina, el carácter y la pasión por el voleibol profesional.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-orange-500 transition-all border border-white/5">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos - Centrada visualmente pero alineada a la izquierda internamente */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col items-start">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
                Enlaces Rápidos
              </h3>
              <ul className="space-y-4 text-sm font-bold">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="hover:text-orange-500 transition-all flex items-center gap-2 text-slate-300 group">
                      <ArrowRight size={14} className="text-orange-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all hidden md:block" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna 3: Contáctanos - Alineada a la derecha visualmente */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col items-start w-full md:w-auto">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
                Contáctanos
              </h3>
              <ul className="space-y-6 text-sm">
                <li className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 group-hover:bg-orange-500 transition-all">
                    <MapPin size={16} className="text-orange-500 group-hover:text-white" />
                  </div>
                  <span className="font-medium">Av. del Deporte 123, <br />San Isidro, Lima - Perú</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-[#1e3a8a] transition-all">
                    <Phone size={16} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="font-bold">+51 999 123 456</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
          <p className="text-slate-600 italic">
            © 2026 Club Gema. <span className="text-orange-500/50">High Performance Training.</span>
          </p>
          <div className="flex gap-8">
            {['Términos', 'Privacidad'].map((link) => (
              <a key={link} href="#" className="text-slate-600 hover:text-orange-500 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;