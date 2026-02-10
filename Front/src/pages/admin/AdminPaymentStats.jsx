import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

const AdminPaymentStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Aprobado */}
            <div className="bg-[#1e3a8a] p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group border border-blue-400/20">
                <TrendingUp className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500" size={120} />
                <p className="text-[9px] font-black uppercase text-blue-300 mb-1 tracking-widest">Recaudación (Filtro Actual)</p>
                <h2 className="text-3xl font-black italic tracking-tighter">S/ {stats.totalAprobado.toFixed(2)}</h2>
            </div>

            {/* Pendientes de Validación */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-orange-400 transition-all duration-300">
                <div className="p-4 bg-orange-100 text-orange-600 rounded-3xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Clock size={28} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Por Validar</p>
                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stats.pendientes}</h2>
                </div>
            </div>

            {/* Gráfico de Barras */}
            <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={18} className="text-[#1e3a8a]" />
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Análisis de Ingresos</h3>
                </div>
                <div className="flex items-end gap-3 h-28 px-2">
                    {stats.chartData.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[8px] px-2 py-1 rounded font-bold z-10 whitespace-nowrap">
                                S/ {item.total.toFixed(0)}
                            </div>
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.total / (stats.maxRecaudacion || 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.05 }}
                                className={`w-full min-h-[4px] rounded-t-lg transition-colors shadow-sm ${item.total > 0 ? 'bg-blue-100 group-hover:bg-[#1e3a8a]' : 'bg-slate-50'}`}
                            />
                            <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentStats;