import React, { useState } from 'react';
import { loginService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Iniciando sesión...');

    try {
      const data = await loginService(identifier, password);

      if (!data || !data.user) {
        throw new Error("Respuesta del servidor incompleta");
      }

      login(data);

      const { rol, nombres, debeCompletarEmail } = data.user;
      toast.success(`¡Bienvenido, ${nombres}!`, { id: loadingToast });

      if (debeCompletarEmail) {
        navigate(rol === 'Alumno' ? '/dashboard/student' : '/dashboard/admin');
      } else {
        const routes = {
          'Administrador': '/dashboard/admin',
          'Profesor': '/dashboard/teacher',
          'Alumno': '/dashboard/student'
        };
        navigate(routes[rol] || '/login');
      }

    } catch (error) {
      toast.error('Credenciales inválidas', {
        style: {
          border: '1px solid #fee2e2',
          padding: '16px',
          color: '#991b1b',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '0.1em',
          borderRadius: '16px',
          background: '#fff',
        },
        iconTheme: {
          primary: '#f97316',
          secondary: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* FONDO CON IMAGEN Y OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Capa de color para integrar con la marca */}
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"></div>
      </div>

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 hover:shadow-lg transition-all duration-300 group z-50 text-sm font-bold"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </button>

      {/* TARJETA PRINCIPAL (Ahora con z-10 para estar sobre el fondo) */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-white/10 z-10">

        {/* LADO IZQUIERDO: Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-600 via-blue-800 to-indigo-950 p-10 text-white flex flex-col justify-between relative min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
          </div>

          <div className="z-10 flex flex-col items-center text-center mt-10">
            <div className="mb-2">
              <img
                src="/logo.png"
                alt="Logo Academia Gema"
                className="w-60 h-auto filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Academia Gema</h2>
              <div className="h-1.5 w-16 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            <p className="mt-8 text-blue-100/80 text-md leading-relaxed font-medium max-w-[300px]">
              Eleva tu potencial deportivo con nuestra
              <span className="block font-semibold text-white mt-1">plataforma de gestión integral</span>
            </p>
          </div>

          <div className="z-10 flex flex-col items-center">
            <div className="bg-transparent border-4 border-orange-500/40 backdrop-blur-md px-6 py-4 rounded-2xl w-full max-w-sm text-center">
              <div className="text-sm font-bold text-blue-200 mb-1">Ecosistema Deportivo Digital</div>
              <div className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-black">
                Precision · Performance · Power
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* ... resto del formulario ... */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido al Panel</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Ingresa tus credenciales para acceder a tu zona de entrenamiento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 ml-1">Identificación de Usuario</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email o número de DNI"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Clave de Acceso</label>
                <Link to="/forgot-password" size="sm" className="text-[11px] text-blue-600 hover:text-blue-800 font-bold">¿Olvidaste tu contraseña?</Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduzca su contraseña"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-sm uppercase tracking-widest"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 block mb-3 font-medium">¿Aún no eres parte de nuestra comunidad?</span>
            <Link
              to="/register"
              className="group text-orange-500 font-bold hover:text-orange-600 transition-all inline-flex items-center gap-2 text-sm"
            >
              Comienza tu inscripción hoy
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <p className="mt-12 text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em]">
            © 2026 Academia Gema · High Performance
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;