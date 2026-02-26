import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, CreditCard, User, LogOut, Activity, Ticket,
  ChevronDown, LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CompletarEmailModal from "../../pages/CompletarEmailModal";

const StudentSidebar = () => {
  const location = useLocation();
  const { logout, user, login } = useAuth();

  const userData = user?.user || user || {};
  const debeCompletarEmail = userData?.debeCompletarEmail === true;

  const [openMenus, setOpenMenus] = useState({
    'Academia': true,
    'Salud y Rendimiento': false,
    'Administración': false
  });

  const toggleMenu = (title) => {
    if (debeCompletarEmail) return;
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleUpdateSuccess = (updatedData) => {
    if (!user) return;
    const plainData = updatedData?.user || updatedData;
    const newUserState = {
      ...user,
      user: { ...(user.user || user), ...plainData, debeCompletarEmail: false },
      debeCompletarEmail: false
    };
    login(newUserState);
  };

  const menuGroups = [
    {
      title: "Inicio",
      type: "link",
      icon: LayoutDashboard,
      path: "/dashboard/student"
    },
    {
      title: "Academia",
      type: "dropdown",
      items: [
        { icon: Home, label: "Horarios Actuales", path: "/dashboard/student" },
        { icon: Home, label: "Nueva Inscripción", path: "/dashboard/student/enrollment" },
      ]
    },
    {
      title: "Salud y Rendimiento",
      type: "dropdown",
      items: [
        { icon: Activity, label: "Mis Lesiones", path: "/dashboard/student/injuries" },
        { icon: Ticket, label: "Mis Recuperaciones", path: "/dashboard/student/recoveries" },
      ]
    },
    {
      title: "Administración",
      type: "dropdown",
      items: [
        { icon: CreditCard, label: "Mis Pagos", path: "/dashboard/student/payments" },
        { icon: User, label: "Mi Perfil", path: "/dashboard/student/profile" },
      ]
    }
  ];

  return (
    <>
      {debeCompletarEmail && (
        <CompletarEmailModal isOpen={true} onClose={() => { }} onActionSuccess={handleUpdateSuccess} />
      )}

      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white h-screen fixed left-0 top-0 z-40 border-r border-white/10 shadow-2xl overflow-hidden">

        {/* HEADER: Logo Circular Grande y Recortado */}
<div className="flex-none py-8 px-4 flex flex-col items-center border-b border-white/10 bg-white/5">
  <div className="relative group flex justify-center w-full">
    {/* Resplandor de fondo */}
    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-110"></div>
    
    {/* CONTENEDOR CIRCULAR: 
        - overflow-hidden: ESTO ES LO QUE VA A BORRAR LAS PUNTAS DE TU FOTO
        - w-[180px]: Lo bajé un poquito para que respire mejor y no se vea tan apretado
    */}
    <div className="relative z-10 w-[180px] aspect-square bg-white rounded-full p-2 shadow-2xl flex items-center justify-center border-4 border-white/20 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
      <img 
        src="/Logo con borde blanco.png" 
        alt="Logo Club Gema" 
        className="w-full h-full object-cover" 
        /* object-cover hará que la imagen llene el círculo y el contenedor la recorte */
      />
    </div>
  </div>
  
  <div className="text-center mt-5">
    <span className="block font-black text-xl tracking-tighter uppercase italic text-white leading-none">
      Gema<span className="text-orange-500">Student</span>
    </span>
  </div>
</div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-left">
          <p className="px-4 text-[10px] font-black text-blue-300/40 uppercase tracking-[0.2em] mb-2">
            Acceso al Portal
          </p>

          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.type === 'link' ? (
                <Link
                  to={debeCompletarEmail ? "#" : group.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === group.path
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-blue-100/60 hover:bg-white/5'
                    } ${debeCompletarEmail ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <group.icon size={18} />
                  <span className="text-sm font-bold">{group.title}</span>
                </Link>
              ) : (
                <div className="space-y-0.5">
                  <button
                    onClick={() => toggleMenu(group.title)}
                    disabled={debeCompletarEmail}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-blue-100/60 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${openMenus[group.title] ? 'bg-orange-500' : 'bg-orange-500/40'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{group.title}</span>
                    </div>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${openMenus[group.title] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${openMenus[group.title] ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l border-white/5 ml-4">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={debeCompletarEmail ? "#" : item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-xs ${isActive ? 'text-orange-400 font-bold bg-orange-400/10' : 'text-blue-100/50 hover:text-white'
                              } ${debeCompletarEmail ? "cursor-not-allowed" : ""}`}
                          >
                            <item.icon size={14} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="flex-none p-4 bg-black/20 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;