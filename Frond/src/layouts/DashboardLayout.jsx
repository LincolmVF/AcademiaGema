import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth(); // Obtenemos el usuario del estado global

    // Si por alguna razón el usuario no ha cargado, mostramos un placeholder
    const displayName = user ? `${user.nombres} ${user.apellidos}` : 'Cargando...';
    const initial = user ? user.nombres.charAt(0).toUpperCase() : '?';

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">{displayName}</p>
                            <p className="text-xs text-slate-500">{user?.rol}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                                {initial}
                            </div>
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;