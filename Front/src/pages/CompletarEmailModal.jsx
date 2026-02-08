import React, { useState } from 'react';
import { completarEmailService } from '../services/auth.service';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CompletarEmailModal = ({ isOpen, onClose, onActionSuccess }) => {
    const [nuevoEmail, setNuevoEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const loadingToast = toast.loading('Actualizando correo...');
        setIsSubmitting(true);

        try {
            const response = await completarEmailService(nuevoEmail);

            const userData = response.data || response.user || response;

            toast.success('¡Registro completado!', { id: loadingToast });

            if (onActionSuccess) {
                onActionSuccess(userData);
            }

            onClose();
        } catch (error) {
            toast.error(error.message || 'Error al actualizar', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-8">

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Paso Final</h3>
                    <div className="h-1 w-12 bg-orange-500 mx-auto rounded-full mt-1 mb-3"></div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Para garantizar la seguridad de tu cuenta en la <strong>Academia GEMA</strong>, vincula tu correo electrónico real.
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 ml-1">
                            Nuevo Correo Electrónico
                        </label>
                        <input
                            type="email"
                            required
                            disabled={isSubmitting}
                            value={nuevoEmail}
                            onChange={(e) => setNuevoEmail(e.target.value)}
                            placeholder="ejemplo@academia.pe"
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group text-sm uppercase tracking-widest disabled:bg-slate-400"
                    >
                        {isSubmitting ? 'Procesando...' : 'Finalizar Registro'}
                        {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Protección de Datos · High Performance
                </p>
            </div>
        </div>
    );
};

export default CompletarEmailModal;