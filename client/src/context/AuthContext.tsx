import React, { createContext, useState, useContext, useEffect } from 'react';
import type { UserAttributes as User, LoginCredentials } from '../types/types';
import { login as apiLogin, logout as apiLogout } from '../services/authService';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                if (isTokenExpired(token)) {
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }

                try {
                    const decoded = decodeJWT(token);
                    const role = decoded?.role;


                    if (role) {
                        setUser({ id: decoded?.userId || '', name: decoded?.name || '', email: decoded?.email || '', role } as User);
                    }
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Error during token check:', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkToken();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiLogin(credentials);
            localStorage.setItem('token', response.token);

            const decoded = decodeJWT(response.token) as any;
            const role = decoded?.role;
            setUser({
                id: response.user?.id || decoded?.userId || '',
                name: response.user?.name || decoded?.name || '',
                email: response.user?.email || decoded?.email || '',
                role: response.user?.role || role,
            } as User);
            setIsAuthenticated(true);
        } catch (err: any) {
            setError(err.message || 'Failed to login');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await apiLogout();
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
        } catch (err: any) {
            setError(err.message || 'Failed to logout');
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};