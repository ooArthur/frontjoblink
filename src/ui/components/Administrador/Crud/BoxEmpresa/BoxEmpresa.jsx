    import React, { useState, useEffect } from 'react';
    import axiosInstance from '../../../../../source/axiosInstance';
    import { toast } from 'sonner';
    import '../../../Empresa/BoxCandidatos/BoxCandidato.css';
    import './BoxEmpresa.css';

    export default function BoxEmpresa() {
        const [companies, setCompanies] = useState([]);
        const [selectedCompanies, setSelectedCompanies] = useState(new Set());

        const fetchCompanies = async () => {
            try {
                const response = await axiosInstance.get('/api/user/company/list-companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Erro ao buscar as empresas:', error);
            }
        };
        
        useEffect(() => {
            fetchCompanies();
        }, []);

        const handleSelectCompany = (companyId) => {
            setSelectedCompanies((prevSelected) => {
                const updatedSelected = new Set(prevSelected);
                if (updatedSelected.has(companyId)) {
                    updatedSelected.delete(companyId);
                } else {
                    updatedSelected.add(companyId);
                }
                return updatedSelected;
            });
        };

        const handleSelectAll = () => {
            if (selectedCompanies.size === companies.length) {
                setSelectedCompanies(new Set());
            } else {
                setSelectedCompanies(new Set(companies.map(company => company._id)));
            }
        };

        const handleDeleteSelected = async () => {
            try {
                const idsToDelete = Array.from(selectedCompanies);

                // Itera sobre cada ID e envia uma requisição DELETE
                for (const id of idsToDelete) {
                    await axiosInstance.delete(`/api/user/delete-user/${id}`);
                    toast.success("Deletado com Sucesso!")
                }

                // Atualiza o estado para remover as empresas deletadas da lista
                setCompanies(prevCompanies => prevCompanies.filter(company => !selectedCompanies.has(company._id)));
                setSelectedCompanies(new Set());
                fetchCompanies()

            } catch (error) {
                console.error('Erro ao deletar as empresas selecionadas:', error);
            }
           
        };

        function truncateText(text, maxLength) {
            if (!text) return '';
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        }

        return (
            <section className='container-vagas sectionCandidatura sectionVagasCrud'>
                <div className='actions'>
                    <button className='action-selecionar' onClick={handleSelectAll}>
                        {selectedCompanies.size === companies.length ? 'Desselecionar tudo' : 'Selecionar tudo'}
                    </button>
                    <button className='action-deletar' onClick={handleDeleteSelected} disabled={selectedCompanies.size === 0}>
                        Deletar selecionados
                    </button>
                </div>

                {companies.length === 0 ? (
                    <p>Nenhuma empresa encontrada no momento.</p>
                ) : (
                    companies.map((empresa) => (
                        <div
                            key={empresa._id}
                            className='card-empresa'
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Checkbox para seleção */}
                            <div className='select-company-checkbox'>
                                <input
                                    type="checkbox"
                                    checked={selectedCompanies.has(empresa._id)}
                                    onChange={(e) => { e.stopPropagation(); handleSelectCompany(empresa._id) }}

                                />
                            </div>
                            <div>

                                
                                <div className='info-card-empresa'>
                                    <h3>{truncateText(empresa.companyName, 23)}</h3>
                                    <h5>{empresa.email}</h5>
                                </div>
                                <div className='info-card-empresa'>
                                    <h4>{empresa.branchOfActivity}</h4>
                                    {empresa.address && empresa.address.city && empresa.address.state ? (
                                        <h5>{empresa._id}</h5>
                                    ) : (
                                        <h5>Localização não disponível</h5>
                                    )}
                                </div>
                            </div>
                            <p className='descricao-card-empresa'>{truncateText(empresa.description, 180)}</p>

                        </div>
                    ))
                )}

                {/* {filteredCompanies.length > 0 ? (
                            companies.map((empresa) => (
                                <div
                                    key={empresa._id}
                                    className='card-empresa'
                                    onClick={() => handleClick(empresa._id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div>
                                        <div className='info-card-empresa'>
                                            <h3>{truncateText(empresa.companyName, 23)}</h3>
                                            <h5>{empresa.type}</h5>
                                        </div>
                                        <div className='info-card-empresa'>
                                            <h4>{empresa.branchOfActivity}</h4>
                                            {empresa.address && empresa.address.city && empresa.address.state ? (
                                                <h5>{empresa.address.city}, {empresa.address.state}</h5>
                                            ) : (
                                                <h5>Localização não disponível</h5>
                                            )}
                                        </div>

                                    </div>
                                    <p className='descricao-card-empresa'>{truncateText(empresa.description, 180)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-results">Nenhuma empresa encontrada com os filtros aplicados.</p>
                        )} */}
            </section>
        );
    }
