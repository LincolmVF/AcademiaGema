import React, { useState } from 'react';
import MassRescheduleForm from '../../components/admin/MassRescheduleForm';
import MassRescheduleHistory from '../../components/admin/MassRescheduleHistory';
import {
    History,
    Info,
    Bell,
    ShieldCheck,
    Cpu
} from 'lucide-react';

const AdminReprogramaciones = () => {
    // 🔔 Señal para avisar al historial que debe recargarse
    const [refreshSignal, setRefreshSignal] = useState(0);

    const handleRefresh = () => {
        setRefreshSignal(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[#1e3a8a] py-10 md:py-16 mb-8 md:mb-12">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10">
                    <div className="w-96 h-96 rounded-full border-[40px] border-white animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 opacity-10">
                    <div className="w-64 h-64 rounded-full bg-white rotate-45"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-400/20 text-blue-100 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-white/10">
                                <Cpu size={14} />
                                Panel de Control Administrativo
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-lg leading-none">
                                REPROGRAMACIÓN <span className="text-blue-400">MASIVA</span>
                            </h1>
                            <p className="text-blue-100/80 text-base md:text-lg font-medium leading-relaxed">
                                Gestiona cambios globales en el calendario del club. Mueve bloques completos de clases y otorga compensaciones automáticas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                                    <Bell size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Notificaciones</p>
                                    <p className="text-sm font-bold text-white">Push Automáticas</p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                                    <ShieldCheck size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-green-300 uppercase tracking-widest">Seguridad</p>
                                    <p className="text-sm font-bold text-white">Ciclo +7 Días</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between pl-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Editor de Reprogramación</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-4 sm:p-8 md:p-12">
                            {/* 📤 Enviamos la función de éxito */}
                            <MassRescheduleForm onSuccess={handleRefresh} />
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 pl-2">
                            <History size={20} className="text-[#1e3a8a]" />
                            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest underline decoration-blue-500/30 underline-offset-8">Historial de Lotes</h2>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden min-h-[400px]">
                            <div className="p-2">
                                {/* 📥 Enviamos la señal de refresco */}
                                <MassRescheduleHistory refreshSignal={refreshSignal} />
                            </div>
                        </div>
                    </section>
                </aside>
            </main>
        </div>
    );
};

export default AdminReprogramaciones;