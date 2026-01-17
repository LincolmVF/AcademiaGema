import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import TeacherSidebar from '../components/teacher/TeacherSidebar'; // <--- Importamos el sidebar nuevo

const TeacherLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            
            {/* Usamos el Sidebar Específico de Profesores */}
            <TeacherSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">Profesor</p>
                        </div>
                        {/* Avatar con toque verde para combinar */}
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm">
                            P
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

export default TeacherLayout;