import React, { useState } from 'react';
import { loginService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Iniciando sesión...');

    try {
      const data = await loginService(email, password); // Retorna { nombres, apellidos, rol, ... }

      // 1. Actualiza el contexto global ANTES de navegar
      login(data);

      const { rol, nombres } = data;

      toast.success(`¡Bienvenido, ${nombres}!`, { id: loadingToast });

      // 2. Redirección basada en el rol exacto del backend
      switch (rol) {
        case 'Administrador':
          navigate('/dashboard/admin');
          break;
        case 'Profesor':
          navigate('/dashboard/teacher');
          break;
        case 'Alumno':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/login');
          toast.error(`Rol no reconocido: ${rol}`, { id: loadingToast });
          break;
      }
    } catch (error) {
      toast.error("Error: " + error.message, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LADO IZQUIERDO: Branding */}
        <div className="w-full md:w-1/2  bg-gradient-to-b from-blue-600 via-blue-800 to-indigo-950 p-10 text-white flex flex-col justify-between relative min-h-[500px]">

          {/* Decoración circular de fondo */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
          </div>

          <div className="z-10 flex flex-col items-center text-center mt-10">
            {/* Logo principal */}
            <div>
              <img
                src="/logo.png"
                alt="Logo Academia Gema"
                className="w-60 h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Títulos */}
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                Academia Gema
              </h2>
              <div className="h-1.5 w-16 bg-orange-500 mx-auto rounded-full"></div>
            </div>

            <p className="mt-8 text-blue-100/80 text-md leading-relaxed font-medium max-w-[300px]">
              Eleva tu potencial deportivo con nuestra
              <span className="block font-semibold text-white mt-1">plataforma de gestión integral</span>
            </p>
          </div>

          {/* Footer del Branding */}
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
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900">Bienvenido al Panel</h3>
            <p className="text-gray-500 mt-2">
              Ingresa tus credenciales para acceder a tu zona de entrenamiento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Identificación de Usuario</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@academia.pe"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Clave de Acceso</label>
                <a href="#" className="text-[11px] text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>

              <div className="relative"> {/* Contenedor relativo para posicionar el botón */}
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduzca su contraseña"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                  ) : (
                    <Eye size={20} strokeWidth={2} />
                  )}
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

          {/* SECCIÓN DE REGISTRO / INSCRIPCIÓN */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500 block mb-3">¿Aún no eres parte de nuestra comunidad?</span>
            <Link
              to="/register"
              className="group text-orange-500 font-bold hover:text-orange-600 transition-all inline-flex items-center gap-2"
            >
              Comienza tu inscripción hoy
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <p className="mt-12 text-center text-[10px] text-gray-400 font-medium uppercase tracking-[0.25em]">
            © 2026 Academia Gema · High Performance Management
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;