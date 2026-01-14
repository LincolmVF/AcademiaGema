import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Usamos el componente Sidebar y le pasamos el control del estado */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">

                    {/* Botón Hamburguesa (Controla el estado del layout) */}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">Usuario Demo</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                            U
                        </div>
                    </div>
                </header>

                {/* Vistas Dinámicas */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;