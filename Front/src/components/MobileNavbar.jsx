import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, User } from 'lucide-react';

const MobileNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 px-6 shadow-lg z-50 md:hidden">
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        {/* Botón Inicio */}
        <NavLink 
          to="/dashboard/student" 
          end
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
          }
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Inicio</span>
        </NavLink>

        {/* Botón Pagos (RUTA CORREGIDA) */}
        <NavLink 
          to="/dashboard/student/payments" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
          }
        >
          <CreditCard size={24} />
          <span className="text-[10px] font-medium">Pagos</span>
        </NavLink>

        {/* Botón Perfil (RUTA CORREGIDA) */}
        <NavLink 
          to="/dashboard/student/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
          }
        >
          <User size={24} />
          <span className="text-[10px] font-medium">Perfil</span>
        </NavLink>

      </div>
    </div>
  );
};

export default MobileNavbar;