import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, UserCog, CalendarRange, Settings, LogOut, MapPin, BarChart3, DollarSign } from 'lucide-react';
import { logoutService } from '../services/auth.service';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutService();
            toast.success('Sesión cerrada correctamente', {
                icon: '👋',
                duration: 5000,
                id: 'logout-toast',
            });
            navigate('/login');
        } catch (error) {
            toast.error('Error al cerrar sesión');
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Resumen General', path: '/dashboard/admin' },
        { icon: UserCog, label: 'Profesores', path: '/dashboard/admin/teachers' },
        { icon: MapPin, label: 'Sedes', path: '/dashboard/admin/locations' },
        { icon: BarChart3, label: 'Niveles', path: '/dashboard/admin/levels' },
        { icon: DollarSign, label: 'Catálogo', path: '/dashboard/admin/catalog' },
        { icon: CalendarRange, label: 'Horarios', path: '/dashboard/admin/schedule' },
        { icon: GraduationCap, label: 'Alumnos', path: '/dashboard/admin/students' },
        { icon: Settings, label: 'Configuración', path: '/dashboard/admin/settings' },
    ];

    return (
        <>
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 h-screen 
                bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:sticky md:top-0 md:translate-x-0 border-r border-white/10
                flex flex-col overflow-hidden shadow-2xl
            `}>

                {/* SECCIÓN LOGO: Branding oficial unificado */}
                <div className="flex-none py-8 px-6 flex flex-col items-center border-b border-white/10">
                    <div className="relative">
                        {/* Brillo decorativo idéntico al StudentSidebar */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                        <img
                            src="/logo.png"
                            alt="Academia Gema"
                            className="w-32 h-auto relative z-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        />
                    </div>
                    <div className="text-center mt-2">
                        <span className="block font-black text-xl tracking-tighter uppercase italic text-white">
                            Gema<span className="text-orange-500 font-black">Admin</span>
                        </span>
                        <div className="h-1 w-8 bg-orange-500 mx-auto mt-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                    </div>
                </div>

                {/* NAVEGACIÓN: Scroll interno oculto */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[10px] font-black text-blue-300/50 uppercase tracking-[0.2em] mb-4">
                        Menú Principal
                    </p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()}
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

                {/* FOOTER: Fijo abajo con estilo Student */}
                <div className="flex-none p-4 bg-black/20 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm text-red-400">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay Móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-all"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};

export default Sidebar;