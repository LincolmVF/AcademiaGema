import React from 'react';

const paymentsData = [
  { id: 1, concept: 'Mensualidad Abril', amount: 'S/ 150.00', date: '05 Abr', status: 'Pendiente' },
  { id: 2, concept: 'Uniforme Oficial', amount: 'S/ 85.00', date: '20 Mar', status: 'Pagado' },
  { id: 3, concept: 'Mensualidad Marzo', amount: 'S/ 150.00', date: '05 Mar', status: 'Pagado' },
];

const StudentPayments = () => {
  return (
    <div className="mb-20"> {/* Margen extra abajo para no chocar con navegación si hubiera */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">💳 Estado de Pagos</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {paymentsData.map((item, index) => (
          <div key={item.id} className={`p-4 flex justify-between items-center ${index !== paymentsData.length - 1 ? 'border-b border-gray-100' : ''}`}>
            
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-base">{item.concept}</span>
              <span className="text-xs text-gray-400 mt-1">Vencimiento: {item.date}</span>
              {item.status === 'Pendiente' && (
                <button className="mt-2 bg-gray-900 text-white text-xs py-1 px-3 rounded-full w-fit active:scale-95 transition-transform">
                  Pagar Ahora
                </button>
              )}
            </div>

            <div className="text-right">
              <p className="font-bold text-gray-900 text-lg">{item.amount}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                item.status === 'Pendiente' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {item.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPayments;