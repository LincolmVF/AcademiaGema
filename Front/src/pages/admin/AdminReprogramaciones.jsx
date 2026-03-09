import React from 'react';
import MassRescheduleForm from '../../components/admin/MassRescheduleForm';
import MassRescheduleHistory from '../../components/admin/MassRescheduleHistory';

const AdminReprogramaciones = () => {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1e3a8a] uppercase italic tracking-tighter">Reprogramación Masiva</h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Mueve bloques completos de clases a nuevas fechas por motivos institucionales.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario (2 columnas en pantallas grandes) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Nueva Reprogramación</h2>
                        <p className="text-sm text-slate-500 mt-1">Completa los datos para reubicar a todos los alumnos afectandos en una nueva fecha.</p>
                    </div>
                    <div className="p-6">
                        <MassRescheduleForm />
                    </div>
                </div>

                {/* Historial (1 columna en pantallas grandes) */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Historial Activo</h2>
                        <p className="text-sm text-slate-500 mt-1">Reprogramaciones que puedes revertir.</p>
                    </div>
                    <div className="p-4 bg-slate-50 min-h-full">
                        <MassRescheduleHistory />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReprogramaciones;
