import React, { useState } from 'react';
import { loginService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService(email, password);
      const userRole = data.rol;

      if (userRole === 'Administrador') {
        navigate('/dashboard/admin');
      } else if (userRole === 'Profesor') {
        navigate('/dashboard/teacher');
      } else {
        navigate('/dashboard/student');
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LADO IZQUIERDO: Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          
          <div className="z-10">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Academia Gema</h2>
            <div className="h-1 w-12 bg-blue-400 mb-6"></div>
            <p className="text-blue-100 text-lg leading-relaxed font-light">
              Eleva tu potencial deportivo con nuestra <span className="font-semibold text-white">plataforma de gestión integral</span>. 
              Monitorea tu progreso, organiza tus entrenamientos y alcanza la excelencia.
            </p>
          </div>

          <div className="z-10">
            <div className="text-sm font-medium opacity-90 mb-1">Ecosistema Deportivo Digital</div>
            <div className="text-[10px] opacity-60 uppercase tracking-[0.2em]">
              Precision · Performance · Power
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
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Clave de Acceso</label>
                <a href="#" className="text-[11px] text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduzca su contraseña"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300"
              />
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
              className="group text-blue-600 font-bold hover:text-indigo-800 transition-all inline-flex items-center gap-2"
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