import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../source/axiosInstance';
import Loading from '../ui/components/Loading/Loading';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!sessionStorage.getItem('accessToken')
    );

    // Buscar informações do usuário logado
    useEffect(() => {
        const fetchUser = async () => {
            if (!isAuthenticated || user) return;

            setLoading(true);

            try {
                const response = await axiosInstance.get('/api/user/me');
                setUser(response.data); // Armazena todas as informações do usuário
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                setIsAuthenticated(false);
                sessionStorage.removeItem('accessToken');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [isAuthenticated, user]);

    // Função de login
    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', credentials);
            if (response.status === 200) {
                sessionStorage.setItem('accessToken', response.data.accessToken);
                setIsAuthenticated(true);
                setUser(response.data.user);
            }
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            const errorMessage = error.response?.data?.error || 'Erro desconhecido ao fazer login';
            throw new Error(errorMessage);
        }
    };

    // Função de logout
    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/logout');
            sessionStorage.removeItem('accessToken');
            if (response.status === 200) {
                setIsAuthenticated(false);
                setUser(null);
                window.location.href = '/login';
            } else {
                console.error('Resposta inesperada do servidor:', response);
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Exibe tela de carregamento enquanto busca informações do usuário
    if (loading) {
        return <Loading />;
    }

    return (
        <UserContext.Provider value={{ user, login, handleLogout, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar o contexto do usuário
export const useUser = () => {
    return useContext(UserContext);
};