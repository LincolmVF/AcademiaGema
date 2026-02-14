import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('userData');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                // Aseguramos que el ID se extraiga correctamente de la estructura anidada
                setUserId(parsedUser.user?.id || parsedUser.id);
            } catch (error) {
                console.error("Error al recuperar sesión:", error);
                sessionStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        if (!userData) return;

        // Normalizamos la data para que siempre tenga la forma { user: { ... } }
        const normalizedData = userData.user ? userData : { user: userData };

        setUser(normalizedData);
        setUserId(normalizedData.user?.id || normalizedData.id);
        sessionStorage.setItem('userData', JSON.stringify(normalizedData));
    };

    /**
     * Función para actualizar partes específicas del usuario
     * Útil para completar email o completar registro de alumno
     */
    const updateUserData = (newData) => {
        setUser(prev => {
            if (!prev) return null;

            // Combinamos el estado anterior con la nueva data
            const updatedState = {
                ...prev,
                user: {
                    ...(prev.user || prev),
                    ...newData
                }
            };

            sessionStorage.setItem('userData', JSON.stringify(updatedState));
            return updatedState;
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
            sessionStorage.clear();
            // Opcional: Redirigir manualmente si es necesario
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