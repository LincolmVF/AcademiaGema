import React, { useEffect, useState } from 'react';
import { roleData } from '../data/mockDashboard';
import apiFetch from '../interceptors/api';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-[#1e3a8a] border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: "bg-indigo-50 text-indigo-700 border-indigo-100",
        gray: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl border ${colors[color] || colors.blue} transition-transform group-hover:scale-110 shadow-sm`}>
                    <Icon size={26} strokeWidth={2.5} />
                </div>
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-3xl font-black text-[#1e3a8a]">{value}</p>
        </div>
    );
};

const Dashboard = ({ role = 'student' }) => {
    const data = roleData[role];
    const [stats, setStats] = useState(data?.stats || []);

    useEffect(() => {
        if (role === 'admin') {
            const fetchDashboardStats = async () => {
                try {
                    const response = await apiFetch.get('/usuarios/count/usuarios-stats');
                    const result = await response.json();

                    if (response.ok && result.data) {
                        const { alumno, profesor } = result.data;

                        setStats(prevStats =>
                            prevStats.map(stat => {
                                const titleLower = stat.title.toLowerCase();

                                if (titleLower.includes("alumnos")) {
                                    return { ...stat, value: (alumno || 0).toString() };
                                }

                                if (titleLower.includes("profesores") || titleLower.includes("entrenadores")) {
                                    return { ...stat, value: (profesor || 0).toString() };
                                }

                                return stat;
                            })
                        );
                    }
                } catch (error) {
                    console.error("Error cargando estadísticas del dashboard:", error);
                }
            };

            fetchDashboardStats();
        } else {
            setStats(data?.stats || []);
        }
    }, [role, data]);

    if (!data) return (
        <div className="flex items-center justify-center h-64 text-slate-500 font-bold italic">
            Cargando información del panel...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-10 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-slate-500 font-medium italic">Bienvenido de nuevo a tu centro de alto rendimiento.</p>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Estado: Activo
                    </div>
                </div>
            </div>

            {/* Renderizado de Cards con datos reales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-[#1e3a8a] rounded-full"></div>
                        <h2 className="font-black text-[#1e3a8a] uppercase tracking-tight text-lg">
                            {data.recentTitle || 'Actividad Reciente'}
                        </h2>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {data.activity?.map((item) => (
                        <div key={item.id} className="px-8 py-5 flex items-center justify-between hover:bg-blue-50/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a] group-hover:scale-125 group-hover:bg-orange-500 transition-all"></div>
                                <span className="text-slate-700 font-bold group-hover:text-[#1e3a8a] transition-colors">{item.text}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
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