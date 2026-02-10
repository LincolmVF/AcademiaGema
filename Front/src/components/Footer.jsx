import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Planes y Precios', path: '/pricing' },
    { name: 'Blog Deportivo', path: '/blog' },
  ];

  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-20 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Columna 1: Marca y Propósito */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 border border-white/10 group-hover:rotate-3 transition-transform">
                <span className="text-white font-black text-xl italic">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                  Academia<span className="text-orange-500">Gema</span>
                </span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mt-1">
                  Explota tu máximo nivel
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Formando atletas de alto rendimiento desde 2015. Nuestra metodología se basa en la disciplina, el carácter y la pasión por el voleibol profesional.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: 'hover:bg-blue-600' },
                { icon: Instagram, color: 'hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500' },
                { icon: Twitter, color: 'hover:bg-sky-500' }
              ].map((social, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:-translate-y-1 border border-white/5`}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Navegación Deportiva */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
              Enlaces Rápidos
            </h3>
            <ul className="space-y-4 text-sm font-bold">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-orange-500 transition-all flex items-center gap-2 group text-slate-300"
                  >
                    <ArrowRight
                      size={14}
                      className="text-orange-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Especialidades */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
              Programas
            </h3>
            <ul className="space-y-4 text-sm font-bold">
              {[
                'Voleibol Infantil', 'Alto Rendimiento', 'Liga Universitaria', 'Vóley Playa Mixto', 'Personalizado'
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center justify-between group">
                    {item}
                    <Trophy size={12} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Ubicación Gema */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
              Contáctanos
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <MapPin size={18} className="text-orange-500 group-hover:text-white" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">Av. del Deporte 123, <br />San Isidro, Lima - Perú</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                  <Phone size={18} className="text-blue-400 group-hover:text-white" />
                </div>
                <span className="font-bold group-hover:text-white transition-colors">+51 999 123 456</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white group-hover:text-[#0f172a] transition-all duration-300">
                  <Mail size={18} className="text-slate-400 group-hover:text-[#0f172a]" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">contacto@academiagema.pe</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BARRA INFERIOR: Copyright con estilo */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
          <p className="text-slate-600 italic">
            © 2026 Academia Gema. <span className="text-orange-500/50">High Performance Training.</span>
          </p>
          <div className="flex gap-8">
            {['Términos', 'Privacidad', 'Cookies'].map((link) => (
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