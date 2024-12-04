import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../source/axiosInstance';
import { toast } from 'sonner';
import { useUser } from './UserContext';  // Importar o UserContext para verificar autenticação

const InterestedContext = createContext();

// Hook personalizado para usar o contexto
export const useInterested = () => useContext(InterestedContext);

// Componente provedor do contexto
export const InterestedProvider = ({ children }) => {
    const { isAuthenticated, user } = useUser();  // Adicionei `user` para verificar role
    const [appliedVacancies, setAppliedVacancies] = useState([]);  // Armazena as vagas aplicadas
    const [dailyApplicationsCount, setDailyApplicationsCount] = useState(0);  // Armazena a contagem de candidaturas diárias
    const [totalCurriculos, setTotalCurriculos] = useState(0);  // Armazena o total de currículos enviados
    const dailyLimit = 10;  // Define o limite diário de candidaturas

    // Verificação para carregar o contexto apenas se o usuário estiver autenticado e for candidato
    if (!isAuthenticated || user?.role !== 'Candidate') {
        return children;  // Renderiza apenas os filhos se o usuário não for candidato
    }

    // Função para buscar o número de candidaturas diárias do candidato
    const fetchDailyApplicationCount = useCallback(async () => {
        if (!isAuthenticated) return; // Apenas busca se o usuário estiver autenticado
        try {
            const response = await axiosInstance.get('/api/user/company/vacancy/applications-today');
            setDailyApplicationsCount(response.data.dailyApplicationsCount || 0);
        } catch (error) {
            console.error('Erro ao buscar o número de candidaturas diárias:', error);
            toast.error('Erro ao carregar candidaturas diárias.');
        }
    }, [isAuthenticated]);

    // Função para buscar o total de currículos enviados
    const fetchTotalCurriculos = useCallback(async () => {
        if (!isAuthenticated) return; // Apenas busca se o usuário estiver autenticado
        try {
            const response = await axiosInstance.get('/api/user/company/vacancy/vacancies-applied');
            setTotalCurriculos(response.data.length || 0);  // Calcula o total com base no length
        } catch (error) {
            console.error('Erro ao buscar o número total de currículos enviados:', error);
            toast.error('Erro ao carregar o total de currículos.');
        }
    }, [isAuthenticated]);

    // Função para buscar as vagas aplicadas
    const fetchAppliedVacancies = useCallback(async () => {
        if (!isAuthenticated) return; // Apenas busca se o usuário estiver autenticado
        try {
            const response = await axiosInstance.get('/api/user/company/vacancy/vacancies-applied');
            setAppliedVacancies(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erro ao buscar vagas aplicadas:', error);
            setAppliedVacancies([]); // Define um array vazio em caso de erro
        }
    }, [isAuthenticated]);

    // Função para adicionar interesse do candidato em uma vaga
    const addInterested = useCallback(async (vaga) => {
        if (!isAuthenticated) {
            toast.error('Você precisa estar autenticado para adicionar uma candidatura.');
            return;
        }
        if (dailyApplicationsCount >= dailyLimit) {
            toast.error('Você atingiu o limite diário de candidaturas.');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/user/company/vacancy/add-interested', { jobVacancyId: vaga._id });
            if (response.status === 200) {
                setAppliedVacancies((prev) => [...prev, vaga]); // Adiciona a vaga à lista
                setDailyApplicationsCount((prevCount) => prevCount + 1); // Incrementa a contagem diária
                await fetchTotalCurriculos(); // Atualiza o total de currículos
                toast.success('Candidatura enviada com sucesso!');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Erro ao adicionar candidatura.';
            toast.error(message);
        }
    }, [dailyApplicationsCount, fetchTotalCurriculos, isAuthenticated]);

    // Função para remover interesse em uma vaga
    const removeInterested = useCallback(async (vagaId) => {
        if (!isAuthenticated) {
            toast.error('Você precisa estar autenticado para remover uma candidatura.');
            return;
        }
        try {
            await axiosInstance.delete('/api/user/company/vacancy/remove-interested', { data: { jobVacancyId: vagaId } });
            setAppliedVacancies((prev) => prev.filter((vacancy) => vacancy._id !== vagaId)); // Remove a vaga da lista
            setDailyApplicationsCount((prevCount) => Math.max(0, prevCount - 1)); // Atualiza o contador diário
            await fetchTotalCurriculos(); // Atualiza o total de currículos
            toast.info('Candidatura removida.');
        } catch (error) {
            console.error('Erro ao remover candidatura:', error);
            toast.error('Erro ao remover candidatura.');
        }
    }, [fetchTotalCurriculos, isAuthenticated]);

    // Função para verificar se a vaga está na lista de aplicadas
    const isInterested = useCallback((vagaId) => {
        return appliedVacancies.some((vaga) => vaga._id === vagaId);
    }, [appliedVacancies]);

    // Chamada para buscar dados ao carregar o contexto
    useEffect(() => {
        if (isAuthenticated && user?.role === 'Candidate') {
            fetchDailyApplicationCount();
            fetchAppliedVacancies();
            fetchTotalCurriculos(); // Busca o total de currículos ao carregar o contexto
        }
    }, [isAuthenticated, user, fetchDailyApplicationCount, fetchAppliedVacancies, fetchTotalCurriculos]);

    // Prover o contexto
    return (
        <InterestedContext.Provider value={{
            appliedVacancies,
            addInterested,
            removeInterested,
            isInterested,
            dailyApplicationsCount,
            totalCurriculos // Expor o total de currículos
        }}>
            {children}
        </InterestedContext.Provider>
    );
};