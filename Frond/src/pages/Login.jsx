import React, { useState } from 'react';
import { loginService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link

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
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="z-10">
            <h2 className="text-3xl font-bold mb-2">Academia Gema</h2>
            <p className="text-blue-100 font-medium">Gestión inteligente para tu centro deportivo.</p>
          </div>
          <div className="z-10 text-xs opacity-70">
            Desarrollado para la excelencia deportiva.
          </div>
        </div>

        {/* LADO DERECHO: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">¡Hola de nuevo! 👋</h3>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@academia.pe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              Ingresar al Sistema
            </button>
          </form>

          {/* SECCIÓN DE REGISTRO / INSCRIPCIÓN */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              ¿Eres un nuevo alumno?
            </p>
            <Link 
              to="/register" 
              className="mt-2 inline-block text-blue-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Registrar inscripción aquí →
            </Link>
          </div>

          <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 Academia Gema
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;