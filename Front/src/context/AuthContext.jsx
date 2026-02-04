import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('userData');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Error al recuperar sesión:", error);
                sessionStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Asegúrate de que userData contenga el 'id' (el backend debe enviarlo)
        setUser(userData);
        sessionStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Error en logout service:", error);
        } finally {
            setUser(null);
            sessionStorage.clear();
        }
    };

    // Helper para obtener el ID rápidamente
    const userId = user?.id || null;

    return (
        <AuthContext.Provider value={{ user, userId, login, logout, loading }}>
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