import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Verificar si hay autenticación mediante context o cookies
    const isAuthenticated = user || Cookies.get('auth_token');
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si `user` en contexto aún no carga (aunque haya cookie) o le falta info, 
    const currentRole = user?.rol || user?.user?.rol || Cookies.get('user_role');

    console.log("[ProtectedRoute] Evaluando acceso:");
    console.log(" -> user ctx:", user);
    console.log(" -> cookie user_role:", Cookies.get('user_role'));
    console.log(" -> currentRole detectado:", currentRole);
    console.log(" -> allowedRoles:", allowedRoles);

    // Comprobar rol permitido si está definido "allowedRoles"
    if (allowedRoles && (!currentRole || !allowedRoles.includes(currentRole))) {
        console.warn("[ProtectedRoute] BLOQUEADO. ", currentRole, "no está en", allowedRoles);
        return <Navigate to="/forbidden" replace />;
    }

    // Si todo está correcto, renderizar las rutas hijas (Outlet) o children
    return <Outlet />;
};

export default ProtectedRoute;
