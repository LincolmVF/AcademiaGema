import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeacherSidebar from '../components/teacher/TeacherSidebar';

const TeacherLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const displayName = user ? `${user.nombres} ${user.apellidos}` : 'Instructor Gema';
    const initial = user ? user.nombres.charAt(0).toUpperCase() : 'G';
    const userRole = user?.rol || 'Coach';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">

            {/* SIDEBAR - Ahora siempre se comportará como un overlay gracias a las props y el cambio en el main */}
            <TeacherSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* CONTENEDOR PRINCIPAL - Quitamos md:ml-64 para que use todo el ancho */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* HEADER */}
                <header className="bg-white border-b-2 border-[#1e3a8a]/10 h-20 flex items-center justify-between px-4 sm:px-8 z-20 shadow-sm">

                    <div className="flex items-center gap-2 sm:gap-6 ml-auto">
                        <div className="hidden sm:block w-px h-10 bg-slate-200 mx-2"></div>

                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-[#1e3a8a] leading-tight uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                                    {displayName}
                                </p>
                                <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-md mt-1">
                                    {userRole}
                                </span>
                            </div>

                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#0f172a] flex items-center justify-center text-white font-black border-2 border-white shadow-lg shadow-blue-900/20 group-hover:rotate-6 transition-all text-lg">
                                    {initial}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO DINÁMICO - Ocupa el 100% al no tener el margen del sidebar */}
                <main className="flex-1 overflow-y-auto bg-[#f1f5f9] p-4 sm:p-6 lg:p-10 relative">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none hidden xl:block">
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

export default TeacherLayout;