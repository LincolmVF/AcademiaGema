import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, User, 
  Menu, X, Activity, Ticket, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNavbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const userData = user?.user || user || {};
  const debeCompletarEmail = userData?.debeCompletarEmail === true;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* PANEL LATERAL FLOTANTE (Para las opciones que faltan) */}
      <div className={`fixed inset-0 z-[60] transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop oscuro */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleMenu}
        ></div>
        
        {/* Contenido del Menú */}
        <div className={`absolute right-0 top-0 h-full w-72 bg-[#0f172a] shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <span className="text-orange-500 font-black tracking-widest uppercase text-xs">Más Opciones</span>
              <button onClick={toggleMenu} className="text-white/50 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.2em]">Salud y Rendimiento</p>
              <NavLink to="/dashboard/student/injuries" onClick={toggleMenu} className="flex items-center gap-4 text-blue-100/70 py-2"><Activity size={20}/> Mis Lesiones</NavLink>
              <NavLink to="/dashboard/student/recoveries" onClick={toggleMenu} className="flex items-center gap-4 text-blue-100/70 py-2"><Ticket size={20}/> Mis Recuperaciones</NavLink>
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.2em] mb-4">Club</p>
                <NavLink to="/dashboard/student/enrollment" onClick={toggleMenu} className="flex items-center gap-4 text-blue-100/70 py-2"><Ticket size={20}/> Nueva Inscripción</NavLink>
              </div>
            </div>

            <button onClick={logout} className="mt-auto flex items-center gap-4 text-red-400 font-bold py-4 border-t border-white/10">
              <LogOut size={20}/> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR INFERIOR (Los 4 principales) */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-50 md:hidden">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto">
          
          <NavLink to="/dashboard/student" end className={({ isActive }) => `flex flex-col items-center gap-1 w-full ${isActive ? 'text-orange-500' : 'text-blue-100/50'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[9px] uppercase font-black">Inicio</span>
          </NavLink>

          <NavLink to="/dashboard/student/payments" className={({ isActive }) => `flex flex-col items-center gap-1 w-full ${isActive ? 'text-orange-500' : 'text-blue-100/50'}`}>
            <CreditCard size={20} />
            <span className="text-[9px] uppercase font-black">Pagos</span>
          </NavLink>

          <NavLink to="/dashboard/student/profile" className={({ isActive }) => `flex flex-col items-center gap-1 w-full ${isActive ? 'text-orange-500' : 'text-blue-100/50'}`}>
            <User size={20} />
            <span className="text-[9px] uppercase font-black">Perfil</span>
          </NavLink>

          {/* BOTÓN DE MENÚ PARA LO DEMÁS */}
          <button onClick={toggleMenu} className="flex flex-col items-center gap-1 w-full text-blue-100/50">
            <Menu size={20} />
            <span className="text-[9px] uppercase font-black">Menú</span>
          </button>

        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;