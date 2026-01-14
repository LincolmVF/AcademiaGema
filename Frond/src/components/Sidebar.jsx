import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';

// Recibimos isOpen y onClose como props desde el Layout
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Resumen', path: '/dashboard' },
        { icon: Calendar, label: 'Agenda', path: '/dashboard/schedule' },
        { icon: Users, label: 'Comunidad', path: '/dashboard/users' },
        { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
    ];

    return (
        <>
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
                <div className="h-full flex flex-col">

                    {/* Logo */}
                    <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">G</div>
                        <span className="font-bold text-lg">Gema<span className="text-blue-500">Panel</span></span>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 py-6 px-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()} // Cierra el menú al hacer clic en un enlace (móvil)
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${location.pathname === item.path
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer Sidebar */}
                    <div className="p-4 border-t border-slate-800">
                        <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut size={20} />
                            <span className="font-medium">Cerrar Sesión</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* 2. OVERLAY OSCURO (Solo móvil) */}
            {/* Lo incluimos aquí para que el Sidebar sea autónomo en su comportamiento visual */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};

export default Sidebar;