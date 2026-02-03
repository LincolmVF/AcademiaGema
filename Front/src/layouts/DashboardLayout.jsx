import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const displayName = user ? `${user.nombres} ${user.apellidos}` : 'Usuario Gema';
    const initial = user ? user.nombres.charAt(0).toUpperCase() : 'G';
    const userRole = user ? user.rol : 'Personal';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* HEADER CON COLORES DE MARCA */}
                <header className="bg-white border-b-2 border-[#1e3a8a]/10 h-20 flex items-center justify-between px-4 sm:px-8 z-10">

                    {/* Sección Izquierda: Toggle y Buscador */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 text-[#1e3a8a] hover:bg-orange-50 rounded-xl transition-colors"
                        >
                            {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {/* Logo móvil con drop-shadow blanco como pediste */}
                    <div className="md:hidden flex items-center">
                        <img
                            src="/logo.png"
                            alt="Gema Logo"
                            className="h-10 w-auto filter drop-shadow-[0_0_3px_rgba(255,255,255,1)]"
                        />
                    </div>

                    {/* Sección Derecha: Acciones y Perfil */}
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden sm:block w-px h-10 bg-slate-200 mx-2"></div>

                        {/* Perfil de Usuario */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-[#1e3a8a] leading-tight uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                                    {displayName}
                                </p>
                                <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-md mt-1">
                                    {userRole}
                                </span>
                            </div>

                            {/* Avatar con degradado y borde naranja */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#0f172a] flex items-center justify-center text-white font-black border-2 border-white shadow-lg shadow-blue-900/20 group-hover:rotate-6 transition-all">
                                    {initial}
                                </div>
                                {/* Indicador de estado online naranja */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL CON FONDO SUAVE */}
                <main className="flex-1 overflow-y-auto bg-[#f1f5f9] p-4 sm:p-6 lg:p-8 relative">
                    {/* Elemento decorativo de marca de agua en el fondo */}
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden xl:block">
                        <img src="/logo.png" alt="" className="w-96 h-auto rotate-12" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;