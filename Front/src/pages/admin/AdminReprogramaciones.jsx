import React from 'react';
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
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[#1e3a8a] py-10 md:py-16 mb-8 md:mb-12">
                {/* Decorative Elements */}
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
                                Gestiona cambios globales en el calendario de la academia. Mueve bloques completos de clases de manera eficiente y notifica automáticamente a todos los involucrados.
                            </p>
                        </div>
                        
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 transition-transform hover:scale-105">
                                <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                                    <Bell size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Notificaciones</p>
                                    <p className="text-sm font-bold text-white">Push Automáticas</p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 transition-transform hover:scale-105">
                                <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                                    <ShieldCheck size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-green-300 uppercase tracking-widest">Seguridad</p>
                                    <p className="text-sm font-bold text-white">Cambios Reversibles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Form Area */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between pl-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Editor de Reprogramación</h2>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-4 sm:p-8 md:p-12">
                            <MassRescheduleForm />
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <aside className="lg:col-span-4 space-y-8">
                    {/* Guidance Card */}
                    <div className="bg-gradient-to-br from-indigo-900 to-[#1e3a8a] p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Info size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                            <Info size={24} className="text-blue-400" />
                            ¿Cómo funciona?
                        </h3>
                        <ul className="space-y-4 relative z-10">
                            {[
                                "Selecciona el horario original afectado.",
                                "Elige la fecha específica del bloque a mover.",
                                "Define la nueva fecha y hora de reposición.",
                                "Escribe el motivo institucional (será notificado)."
                            ].map((step) => (
                                <li key={step} className="flex gap-3 text-sm font-medium text-blue-100/90 leading-snug">
                                    <span className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20">{(["Selecciona el horario original afectado.", "Elige la fecha específica del bloque a mover.", "Define la nueva fecha y hora de reposición.", "Escribe el motivo institucional (será notificado)."].indexOf(step) + 1)}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* History Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 pl-2">
                            <History size={20} className="text-[#1e3a8a]" />
                            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest underline decoration-blue-500/30 underline-offset-8">Historial Reciente</h2>
                        </div>
                        
                        <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden min-h-[400px]">
                            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-500 italic">Puedes revertir reprogramaciones que aún no se han ejecutado o que fueron recientes.</p>
                            </div>
                            <div className="p-2">
                                <MassRescheduleHistory />
                            </div>
                        </div>
                    </section>
                </aside>
            </main>
        </div>
    );
};

export default AdminReprogramaciones;
