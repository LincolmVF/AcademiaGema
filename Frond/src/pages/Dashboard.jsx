import React from 'react';
import { roleData } from '../data/mockDashboard';

// Componente pequeño para las tarjetas de estadísticas
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
        gray: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color] || colors.blue}`}>
                    <Icon size={24} />
                </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
    );
};

const Dashboard = ({ role = 'student' }) => {
    // Cargamos los datos según el rol recibido (admin, teacher, student)
    const data = roleData[role];

    if (!data) return <div>Rol no encontrado</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in-up">

            {/* Título de Bienvenida */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">{data.title}</h1>
                <p className="text-slate-500">Bienvenido de nuevo al panel de control.</p>
            </div>

            {/* Grid de Estadísticas (Reutilizable) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {data.stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Sección de Contenido Principal (Ejemplo: Lista de Actividad) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-900">{data.recentTitle}</h2>
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Ver todo</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {data.activity.map((item) => (
                        <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-slate-700 font-medium">{item.text}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                                {item.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;