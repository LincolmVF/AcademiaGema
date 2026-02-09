import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Home, CreditCard, User, LogOut, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CompletarEmailModal from "../../pages/CompletarEmailModal";

const StudentSidebar = () => {
  const location = useLocation();
  const { logout, user, login } = useAuth();

  const userData = user?.user || user || {};
  const debeCompletarEmail = userData?.debeCompletarEmail === true;

  const registroCompletado = !!userData?.alumnos?.seguro_medico;

  const handleUpdateSuccess = (updatedData) => {
    if (!user) return;
    const plainData = updatedData?.user || updatedData;

    const newUserState = {
      ...user,
      user: {
        ...(user.user || user),
        ...plainData,
        debeCompletarEmail: false,
      },
      debeCompletarEmail: false
    };
    login(newUserState);
  };

  const getMenuItems = () => {
    if (debeCompletarEmail) {
      return [{ icon: User, label: "Verificando...", path: "#" }];
    }

    if (!registroCompletado) {
      return [{ icon: Check, label: "Completa tu inscripción", path: "/dashboard/student/registration" }];
    }

    return [
      { icon: Home, label: "Inicio / Horario", path: "/dashboard/student" },
      { icon: Home, label: "Nueva Inscripción", path: "/dashboard/student/enrollment" },
      { icon: CreditCard, label: "Mis Pagos", path: "/dashboard/student/payments" },
      { icon: User, label: "Mi Perfil", path: "/dashboard/student/profile" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {debeCompletarEmail && (
        <CompletarEmailModal
          isOpen={true}
          onClose={() => { }}
          onActionSuccess={handleUpdateSuccess}
        />
      )}

      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white min-h-screen fixed left-0 top-0 z-40 border-r border-white/10 shadow-2xl">
        {/* SECCIÓN LOGO */}
        <div className="py-8 px-6 flex flex-col items-center border-b border-white/10">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <img
              src="/logo.png"
              alt="Academia Gema"
              className="w-42 h-auto relative z-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            />
          </div>
          <div className="text-center">
            <span className="block font-black text-xl tracking-tighter uppercase italic text-white">
              Gema<span className="text-orange-500 font-black">Student</span>
            </span>
            <div className="h-1 w-8 bg-orange-500 mx-auto mt-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
          </div>
        </div>

        {/* Navegación Dinámica */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          <p className="px-4 text-[10px] font-black text-blue-300/50 uppercase tracking-[0.2em] mb-4">
            {debeCompletarEmail
              ? "Seguridad"
              : registroCompletado
                ? "Panel del Alumno"
                : "Acceso Restringido"}
          </p>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={debeCompletarEmail ? "#" : item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-900/40"
                  : "text-blue-100/60 hover:bg-white/5 hover:text-white"
                  } ${debeCompletarEmail ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <item.icon
                  size={20}
                  className={`${isActive ? "text-white" : "group-hover:text-orange-400"} transition-colors`}
                />
                <span
                  className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer con Logout siempre disponible */}
        <div className="p-4 bg-black/20 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
