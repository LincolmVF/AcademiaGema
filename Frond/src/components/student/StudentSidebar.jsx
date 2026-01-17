import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, User, LogOut } from 'lucide-react';

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Inicio / Horario', path: '/dashboard/student' },
    { icon: CreditCard, label: 'Mis Pagos', path: '/dashboard/student/payments' },
    { icon: User, label: 'Mi Perfil', path: '/dashboard/student/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 z-40">
      
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
        <span className="font-bold text-lg text-slate-800">Gema<span className="text-blue-600">Student</span></span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === item.path || (item.path === '/dashboard/student' && location.pathname === '/dashboard/student')
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Salir</span>
        </Link>
      </div>
    </aside>
  );
};

export default StudentSidebar;