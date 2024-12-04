import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../source/axiosInstance';
import { toast } from 'sonner';
import { useUser } from './UserContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const { user } = useUser(); // Obtém o usuário e a função (role)
    const [favorites, setFavorites] = useState([]);

    // Função para buscar favoritos do usuário logado
    const fetchFavorites = useCallback(async () => {
        if (!user) return; // Garante que o usuário está carregado

        try {
            const endpoint = user.role === 'Candidate' 
                ? '/api/user/candidate/list-favorites' 
                : '/api/user/company/list-favorites';
            const response = await axiosInstance.get(endpoint);
            setFavorites(response.data);
        } catch (error) {
            console.error('Erro ao buscar favoritos', error);
        }
    }, [user]);

    useEffect(() => {
        // Executa apenas se o usuário for "Candidate" ou "Company"
        if (user && (user.role === 'Candidate' || user.role === 'Company')) {
            fetchFavorites();
        }
    }, [fetchFavorites, user]);

    // Função para adicionar aos favoritos, seja uma vaga ou um candidato
    const addFavorite = useCallback(async (item) => {
        if (!user) return;

        try {
            const endpoint = user.role === 'Candidate' 
                ? '/api/user/candidate/add-favorite/' 
                : '/api/user/company/add-favorite';

            const payload = user.role === 'Candidate' 
                ? { jobVacancyId: item._id }  // Para candidatos, usa `jobVacancyId`
                : { candidateId: item._id };   // Para empresas, usa `candidateId`

            await axiosInstance.post(endpoint, payload);

            setFavorites(prevFavorites => {
                if (!prevFavorites.some(fav => fav._id === item._id)) {
                    toast.success(user.role === 'Candidate' ? 'Vaga adicionada aos favoritos!' : 'Candidato adicionado aos favoritos!');
                    return [...prevFavorites, item];
                }
                return prevFavorites;
            });
        } catch (error) {
            toast.error('Erro ao adicionar aos favoritos.');
        }
    }, [user]);

    // Função para remover dos favoritos, seja uma vaga ou um candidato
    const removeFavorite = useCallback(async (itemId) => {
        if (!user) return;

        try {
            const endpoint = user.role === 'Candidate' 
                ? '/api/user/candidate/remove-favorite' 
                : '/api/user/company/remove-favorite';

            const payload = user.role === 'Candidate' 
                ? { jobVacancyId: itemId }  // Para candidatos, usa `jobVacancyId`
                : { candidateId: itemId };   // Para empresas, usa `candidateId`

            await axiosInstance({
                method: 'DELETE',
                url: endpoint,
                data: payload
            });

            setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== itemId));
            toast.info(user.role === 'Candidate' ? 'Vaga removida dos favoritos.' : 'Candidato removido dos favoritos.');
        } catch (error) {
            toast.error('Erro ao remover dos favoritos.');
        }
    }, [user]);

    // Função para verificar se um item é favorito
    const isFavorite = useCallback((itemId) => {
        return favorites.some(fav => fav._id === itemId);
    }, [favorites]);

    // Verifica se o usuário tem o papel de "Candidate" ou "Company"
    if (user && (user.role === 'Candidate' || user.role === 'Company')) {
        return (
            <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
                {children}
            </FavoritesContext.Provider>
        );
    }

    // Caso o usuário não seja "Candidate" nem "Company", não renderiza o contexto
    return <>{children}</>;
};