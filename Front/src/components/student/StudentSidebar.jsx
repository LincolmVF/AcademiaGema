import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, User, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Si esto sale 'undefined' en la consola, el problema es que el 
  // AuthContext/Login no está trayendo los datos del alumno.
  console.log("Datos del alumno:", user?.alumnos);

  const registroCompletado = user?.alumnos &&
    user.alumnos.seguro_medico !== null &&
    user.alumnos.seguro_medico?.trim() !== "";

  const menuItems = registroCompletado
    ? [
      { icon: Home, label: 'Inicio / Horario', path: '/dashboard/student' },
      { icon: CreditCard, label: 'Mis Pagos', path: '/dashboard/student/payments' },
      { icon: User, label: 'Mi Perfil', path: '/dashboard/student/profile' },
    ]
    : [
      { icon: Check, label: 'Completa tu inscripción', path: '/dashboard/student/registration' },
    ];

  // ... resto del return igual

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white min-h-screen fixed left-0 top-0 z-40 border-r border-white/10 shadow-2xl">

      {/* SECCIÓN LOGO */}
      <div className="py-8 px-6 flex flex-col items-center border-b border-white/10">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
          <img
            src="/logo.png"
            alt="Academia Gema"
            className="w-42 h-auto relative z-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
        </div>
        <div className="text-center">
          <span className="block font-black text-xl tracking-tighter uppercase italic text-white">
            Gema<span className="text-orange-500 font-black">Student</span>
          </span>
          <div className="h-1 w-8 bg-orange-500 mx-auto mt-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
        </div>
      </div>

      {/* Navegación Dinámica */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        <p className="px-4 text-[10px] font-black text-blue-300/50 uppercase tracking-[0.2em] mb-4">
          {registroCompletado ? 'Panel del Alumno' : 'Acceso Restringido'}
        </p>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon
                size={20}
                className={`${isActive ? 'text-white' : 'group-hover:text-orange-400'} transition-colors`}
              />
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer con Logout */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm text-red-400">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;