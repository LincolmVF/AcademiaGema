import React, { useState } from 'react'; // <--- Importamos useState
import { Bell, Menu, X, UserCircle, LogOut } from 'lucide-react'; // <--- Importamos X para cerrar

const Navbar = () => {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Academia<span className="text-blue-600">Gema</span></span>
          </div>

          {/* Menú Desktop (Se oculta en móvil) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Clases y Horarios</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Mis Reservas</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Torneos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Membresías</a>
          </div>

          {/* Acciones Derecha (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Hola, Carlos</p>
                <p className="text-xs text-slate-500">Plan Premium</p>
              </div>
              <UserCircle size={32} className="text-slate-300" />
            </div>
          </div>

          {/* BOTÓN HAMBURGUESA MÓVIL (Visible solo en móvil) */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-slate-400">
               <Bell size={20} />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} // <--- Aquí cambiamos el estado al hacer clic
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {/* Si está abierto mostramos X, si no, mostramos Menu */}
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
      {/* Solo se muestra si isOpen es true */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50">Clases y Horarios</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50">Mis Reservas</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50">Torneos</a>
            <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50">Membresías</a>
            
            {/* Perfil en versión móvil */}
            <div className="border-t border-slate-100 mt-4 pt-4 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle size={32} className="text-slate-400" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Carlos Pérez</p>
                  <p className="text-xs text-slate-500">carlos@email.com</p>
                </div>
              </div>
              <button className="text-red-500 bg-red-50 p-2 rounded-lg">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;