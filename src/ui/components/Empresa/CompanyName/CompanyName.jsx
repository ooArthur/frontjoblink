import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';

function CompanyName() {

    const [company, setCompany] = useState(null);

    const fetchCompany = async () => {
        try {
            const response = await axiosInstance.get('/api/user/company/list-company/');
            if (response.data) {
                const companyData = response.data;
                setCompany(companyData);
            }
        } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
        }
    };

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

    useEffect(() => {
        fetchCompany();
    }, []);

    return (
        <h1>
            {company ? company.companyName : 'Carregando...'} <br />
            <p className="Date">{dataFormatada}</p>
        </h1>
    );
}

export default CompanyName;