import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile"
import CandidateName from "../CandidateName/CandidateName";
import axiosInstance from '../../../../source/axiosInstance';
import './ListarEmpresas.css';

export default function ListarEmpresas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [companies, setCompanies] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    const handleClick = (companyId) => {
        navigate(`/pre-visualizacaoE/${companyId}`);
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axiosInstance.get('/api/user/company/list-companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Erro ao listar empresas:', error);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter((company) => {
        const matchesSearch = company.companyName && company.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter ? company.branchOfActivity === selectedFilter : true;
        return matchesSearch && matchesFilter;
    });

    function truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    useEffect(() => {
        // Função que atualiza a largura da tela
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };

        // Adiciona o event listener para mudanças no tamanho da tela
        window.addEventListener('resize', handleResize);

        // Limpeza do event listener ao desmontar o componente
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <>
            {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
            {windowWidth < 450 && <MenuMobile/>}
            <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className="cabecalhoCandidato cabecalhoMobile">
                    <div>
                        <CandidateName />
                        <div className="input-container">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Buscar Empresas"
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filtro">
                        <h2>Listar Empresas</h2>
                        <div className='filtro-vagas'>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="">Todas as Áreas</option>
                                {['Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia',
                                    'Marketing', 'Vendas', 'Recursos Humanos', 'Administração',
                                    'Jurídico', 'Logística', 'Atendimento ao Cliente',
                                    'Design', 'Operações', 'Construção Civil'].map((area) => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="container-cards-empresas">
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => (
                            <div
                                key={company._id}
                                className='card-empresa'
                                onClick={() => handleClick(company._id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div>
                                    <div className='info-card-empresa'>
                                        <h3>{truncateText(company.companyName, 23)}</h3>
                                        <h5>{company.type}</h5>
                                    </div>
                                    <div className='info-card-empresa'>
                                        <h4>{company.branchOfActivity}</h4>
                                        {company.address && company.address.city && company.address.state ? (
                                            <h5>{company.address.city}, {company.address.state}</h5>
                                        ) : (
                                            <h5>Localização não disponível</h5>
                                        )}
                                    </div>

                                </div>
                                <p className='descricao-card-empresa'>{truncateText(company.description, 180)}</p>
                            </div>
                        ))
                    ) : (
                        <p  className="no-results">Nenhuma empresa encontrada com os filtros aplicados.</p>
                    )}
                </div>
            </main>
        </>
    );
}