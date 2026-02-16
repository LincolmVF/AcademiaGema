import React from 'react';
import { Ticket, Flame, Clock, CalendarCheck } from 'lucide-react';

const RecoveryTicketList = ({ tickets, selectedTicket, onSelect }) => {
    if (!tickets || tickets.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                <CalendarCheck size={48} className="mx-auto mb-4 opacity-50" />
                <p>¡Todo al día! No tienes clases pendientes de recuperar.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const isVip = ticket.es_por_lesion;
                const fechaVencimiento = ticket.fecha_caducidad;

                return (
                    <button
                        key={ticket.id}
                        onClick={() => onSelect(isSelected ? null : ticket)}
                        className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group ${isSelected
                            ? 'bg-orange-500 border-orange-400 shadow-xl shadow-orange-900/20 scale-[1.02]'
                            : 'bg-[#1e293b] border-white/10 hover:border-white/30 hover:bg-[#253246]'
                            }`}
                    >
                        {/* Badge VIP */}
                        {isVip && (
                            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                <Flame size={12} fill="currentColor" /> LESION
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400'}`}>
                                {isVip ? <Flame size={24} /> : <Ticket size={24} />}
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-orange-100' : 'text-gray-400'}`}>
                                    Falta del
                                </p>
                                <p className="text-white font-bold text-lg leading-none">
                                    {new Date(ticket.fecha_falta).toLocaleDateString('es-PE', { day: '2-digit', month: 'long' })}
                                </p>
                            </div>
                        </div>

                        <div className={`mt-2 text-xs border-t pt-3 flex items-center gap-2 ${isSelected ? 'border-white/20 text-orange-50' : 'border-white/5 text-gray-400'}`}>
                            <Clock size={14} />
                            {isVip || !fechaVencimiento ? (
                                <span>Sin fecha de vencimiento</span>
                            ) : (
                                <span><strong className={isSelected ? "text-white" : "text-blue-200"}>Vence: {new Date(fechaVencimiento).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                            )}
                        </div>

                        {isSelected && (
                            <div className="absolute inset-0 border-2 border-white/20 rounded-2xl animate-pulse pointer-events-none"></div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default RecoveryTicketList;