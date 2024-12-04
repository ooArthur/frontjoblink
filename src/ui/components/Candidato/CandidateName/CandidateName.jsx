import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';

function CandidateName() {
    // Definindo os estados
    const [candidate, setCandidate] = useState(null);

    // Função para buscar e atualizar as informações do candidato
    const fetchCandidate = async () => {
        try {
            const response = await axiosInstance.get('/api/user/candidate/list-candidate/');
            if (response.data) {
                const candidateData = response.data;
                setCandidate(candidateData);
            }
        } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
        }
    };

    // Obtém a data atual e formata
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


    // Chamando a função fetchCandidate ao carregar o componente
    useEffect(() => {
        fetchCandidate();
    }, []);

    // Exibindo o nome do candidato
    return (
        <h1>
            Olá, {candidate ? candidate.candidateName : 'Carregando...'} <br />
            <p className="Date">{dataFormatada}</p>
        </h1>
    );
}

export default CandidateName;