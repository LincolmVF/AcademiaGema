import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../interceptors/api';

import StudentStats from '../components/student/StudentStats';
import StudentSchedule from '../components/student/StudentSchedule';
import StudentAnnouncements from '../components/student/StudentAnnouncements';
import StudentPayments from '../components/student/StudentPayments';

const DashboardEstudiante = () => {
  const { user, userId } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [resAsist, resDebts, resPay] = await Promise.all([
          apiFetch.get(`/asistencias/alumno/${userId}`),
          apiFetch.get('/cuentaPorCobrar'),
          apiFetch.get('/pagos')
        ]);

        const dataAsist = await resAsist.json();
        const dataDebts = await resDebts.json();
        const dataPay = await resPay.json();

        setAttendance(dataAsist.data || []);
        setDebts((dataDebts.data || []).filter(d => d.alumno_id === userId));
        setPayments((dataPay.data || []).filter(p => p.cuentas_por_cobrar?.alumno_id === userId));
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadDashboardData();
  }, [userId]);

  const firstName = user?.nombres || 'Campeón';
  const fullName = user ? `${user.nombres} ${user.apellidos}` : 'Alumno Gema';

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center relative overflow-hidden">
      <div className="w-full md:max-w-6xl p-4 md:p-8 pb-28 relative z-10">
        
        <header className="flex justify-between items-start mb-10 mt-2">
           {/* ... (Header identico al tuyo) ... */}
           <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic">
                Hola, <span className="text-orange-500">{firstName}</span> 👋
              </h1>
              <p className="text-sm text-slate-500 font-bold mt-2">Panel de Control de Alto Rendimiento</p>
           </div>
           {/* Perfil (IDEM) */}
        </header>

        {/* Pasamos los datos reales a los componentes */}
        <StudentStats attendance={attendance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <StudentSchedule attendance={attendance} />
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <StudentAnnouncements />
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h2 className="font-black text-[#1e3a8a] uppercase tracking-tighter mb-4">Finanzas</h2>
                <StudentPayments debts={debts} payments={payments} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudiante;