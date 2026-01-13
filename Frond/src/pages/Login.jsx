import React from 'react';

function Login() {
  return (
    // 1. FONDO DE PANTALLA: Un gris muy suave para que resalte la tarjeta
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      {/* 2. LA TARJETA PRINCIPAL:
          - max-w-4xl: Ancho máximo controlado
          - shadow-2xl: Una sombra muy elegante y profunda
          - overflow-hidden: Para que nada se salga de los bordes redondeados
          - flex: Para poner la imagen al lado del formulario
      */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* 3. LADO IZQUIERDO (Arte/Branding):
            - hidden md:flex: Se oculta en celular, aparece en PC
            - bg-gradient-to-br: Gradiente de azul a morado
        */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative">
          {/* Círculos decorativos (Efecto visual) */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full translate-x-5 translate-y-5"></div>

          <div className="z-10">
            <h2 className="text-3xl font-bold mb-2">Academia Gema</h2>
            <p className="text-blue-100">Gestión inteligente para tu centro deportivo.</p>
          </div>

          <div className="z-10">
            <blockquote className="italic opacity-90">
              "La mejor decisión para organizar nuestros horarios y alumnos."
            </blockquote>
            <p className="mt-2 font-semibold text-sm">— Director Deportivo</p>
          </div>
        </div>

        {/* 4. LADO DERECHO (Formulario) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">¡Hola de nuevo! 👋</h3>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus datos para acceder al panel.</p>
          </div>

          <form className="space-y-5">
            
            {/* Input Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="ejemplo@academia.pe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* Input Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">¿Olvidaste tu clave?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* BOTÓN CON EFECTO:
                - hover:-translate-y-0.5: Se mueve un poquito hacia arriba al pasar el mouse
                - shadow-lg: Sombra azul brillante
            */}
            <button 
              type="button"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-500/50 transition-all duration-200"
            >
              Ingresar al Sistema
            </button>

            {/* Separador */}
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs">O ingresa con</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botón Google (Estilo secundario) */}
            <button 
              type="button"
              className="w-full bg-white text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
               {/* Simulación de icono Google */}
               <span className="font-bold text-red-500">G</span> 
               <span>Google</span>
            </button>

          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © 2026 Academia Gema. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login