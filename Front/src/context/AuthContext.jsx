import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutService } from '../services/auth.service';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Inicialización de estado recuperando datos DIRECTAMENTE de Cookies
    const [user, setUser] = useState(() => {
        const savedRole = Cookies.get('user_role');
        const savedName = Cookies.get('user_name');
        const savedId = Cookies.get('user_id');

        if (savedRole) {
            // Reconstruimos el objeto de usuario que espera tu App
            return {
                rol: savedRole,
                nombres: savedName,
                id: savedId,
                user: { id: savedId, rol: savedRole, nombres: savedName }
            };
        }
        return null;
    });

    const [userId, setUserId] = useState(() => Cookies.get('user_id') || null);
    const [loading, setLoading] = useState(true);

    // 2. Sincronización entre pestañas (Escucha el "timbre" de localStorage sin guardar datos)
    useEffect(() => {
        const syncTabs = (event) => {
            if (event.key === 'auth_sync' || event.key === 'logout_sync') {
                window.location.reload();
            }
        };

        window.addEventListener('storage', syncTabs);
        setLoading(false); 
        return () => window.removeEventListener('storage', syncTabs);
    }, []);

    const login = (userData) => {
        if (!userData) return;

        const normalizedData = userData.user ? userData : { user: userData };
        const finalUser = normalizedData.user || normalizedData;

        setUser(normalizedData);
        setUserId(finalUser.id);
    };

    /**
     * Actualiza la data del usuario y sincroniza las cookies
     */
    const updateUserData = (newData) => {
        setUser(prev => {
            if (!prev) return null;

            const updatedUser = {
                ...prev,
                user: {
                    ...(prev.user || prev),
                    ...newData
                }
            };

            if (newData.nombres) Cookies.set('user_name', newData.nombres, { expires: 1, sameSite: 'strict' });
            if (newData.rol) Cookies.set('user_role', newData.rol, { expires: 1, sameSite: 'strict' });

            return updatedUser;
        });
    };

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Error en logout service:", error);
        } finally {
            setUser(null);
            setUserId(null);

            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, userId, login, logout, updateUserData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};