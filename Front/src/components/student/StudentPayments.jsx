import React from 'react';
import { CreditCard, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';

const StudentPayments = () => {
    // Mockup de datos financieros
    const pagos = [
        {
            id: 1,
            mes: 'FEBRERO',
            monto: '180.00',
            estado: 'PENDIENTE',
            vencimiento: '05 Feb',
            concepto: 'Cuota Mensual'
        },
        {
            id: 2,
            mes: 'ENERO',
            monto: '180.00',
            estado: 'PAGADO',
            vencimiento: '05 Ene',
            concepto: 'Cuota Mensual'
        }
    ];

    return (
        <div className="space-y-4">
            {pagos.map((pago) => (
                <div
                    key={pago.id}
                    className="bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 flex items-center justify-between group hover:bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        {/* Icono con fondo dinámico */}
                        <div className={`p-3 rounded-2xl ${pago.estado === 'PENDIENTE'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-green-100 text-green-600'
                            }`}>
                            {pago.estado === 'PENDIENTE' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pago.mes}</span>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${pago.estado === 'PENDIENTE'
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'bg-green-500 text-white shadow-sm'
                                    }`}>
                                    {pago.estado}
                                </span>
                            </div>
                            <h4 className="text-[#1e3a8a] text-sm font-black uppercase tracking-tight">{pago.concepto}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Vence: {pago.vencimiento}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[#0f172a] font-black italic text-lg tracking-tighter">S/ {pago.monto}</p>
                        <button className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 ml-auto mt-1 group-hover:translate-x-1 transition-transform">
                            Detalles <ArrowUpRight size={10} />
                        </button>
                    </div>
                </div>
            ))}

            {/* Botón de Pago Mejorado para fondo blanco */}
            <button className="w-full mt-4 bg-[#1e3a8a] hover:bg-[#0f172a] text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                <CreditCard size={18} />
                Pagar Mensualidad
            </button>

            <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-tighter mt-4 italic px-4">
                * Los pagos pueden tardar hasta 24h en ser validados por administración.
            </p>
        </div>
    );
};

export default StudentPayments;