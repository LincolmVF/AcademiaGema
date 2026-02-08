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
                setUserId(parsedUser.user.id);
            } catch (error) {
                console.error("Error al recuperar sesión:", error);
                sessionStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        setUserId(userData.user.id);
        sessionStorage.setItem('userData', JSON.stringify(userData));
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
        }
    };

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