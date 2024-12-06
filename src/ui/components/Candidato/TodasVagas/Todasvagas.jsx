import React, { useEffect, useState } from 'react';
import BoxVaga from '../BoxVaga/BoxVaga';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile";
import CandidateName from "../CandidateName/CandidateName";
import axiosInstance from '../../../../source/axiosInstance';
import './TodasVagas.css';
import { toast } from 'sonner';

export function TodasVagas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('Idioma');
    const [vacancies, setVacancies] = useState([]);
    const [filteredVacancies, setFilteredVacancies] = useState([]);
    const [salaryFilter, setSalaryFilter] = useState(0); // Adicionando o estado para o filtro de salário
    const [salaryCurrency, setSalaryCurrency] = useState('R$');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const response = await axiosInstance.get('/api/user/company/vacancy/list-vacancies');
                setVacancies(response.data);
                setFilteredVacancies(response.data);  // Define as vagas iniciais como todas
            } catch (error) {
                console.error('Erro ao buscar as vagas:', error);
            }
        };

        fetchVacancies();
    }, [])

    function renderFilterOptions() {
        const filterOptions = {
            'Idioma': ['Africâner', 'Albanês', 'Alemão', 'Amárico', 'Árabe', 'Armênio', 'Azeri', 'Basco', 'Bengali', 'Bielorrusso', 'Birmanês', 'Bósnio', 'Búlgaro', 'Cazaque', 'Cebuano', 'Chinês', 'Cingalês', 'Coreano', 'Croata', 'Dinamarquês', 'Eslovaco', 'Esloveno', 'Espanhol', 'Esperanto', 'Estoniano', 'Finlandês', 'Francês', 'Gaélico Escocês', 'Galês', 'Georgiano', 'Grego', 'Guzerate', 'Haitiano', 'Hebraico', 'Híndi', 'Holandês', 'Húngaro', 'Indonésio', 'Inglês', 'Islandês', 'Italiano', 'Japonês', 'Javanês', 'Khmer', 'Kinyarwanda', 'Kirguiz', 'Laosiano', 'Letão', 'Lituano', 'Luxemburguês', 'Macedônio', 'Malaio', 'Malgaxe', 'Maltês', 'Maori', 'Marata', 'Mongol', 'Nepalês', 'Norueguês', 'Pachto', 'Persa', 'Polonês', 'Português', 'Punjabi', 'Quirguiz', 'Romeno', 'Russo', 'Sérvio', 'Suaíli', 'Sueco', 'Tadjique', 'Tailandês', 'Tâmil', 'Tcheco', 'Telugu', 'Tibetano', 'Tigrínia', 'Tonga', 'Turco', 'Turcomano', 'Ucraniano', 'Urdu', 'Uzbeque', 'Vietnamita', 'Xhosa', 'Zulu', 'Outro'],
            'Área de Atuação': ['Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia', 'Marketing', 'Vendas', 'Recursos Humanos', 'Administração', 'Jurídico', 'Logística', 'Atendimento ao Cliente', 'Design', 'Operações', 'Construção Civil'],
            'Salário': [],
            'Habilidades e Competências': ['Comunicação', 'Trabalho em equipe', 'Liderança', 'Resolução de problemas', 'Pensamento crítico', 'Gestão de tempo', 'Flexibilidade', 'Iniciativa', 'Criatividade', 'Adaptabilidade', 'Organização', 'Atenção aos detalhes', 'Ética profissional', 'Empatia', 'Inteligência emocional', 'Gestão de conflitos', 'Capacidade de aprendizado', 'Planejamento estratégico', 'Negociação', 'Análise de dados', 'Técnicas de apresentação', 'Automotivação', 'Escuta ativa', 'Gestão de projetos', 'Multitarefa', 'Conhecimento em tecnologia', 'Resiliência', 'Autogestão', 'Solução de conflitos', 'Pensamento analítico', 'Tomada de decisão', 'Comprometimento', 'Orientação para resultados', 'Competências interpessoais', 'Proatividade', 'Habilidades em vendas', 'Habilidades em atendimento ao cliente', 'Gestão de riscos', 'Inovação', 'Conhecimento em diversidade e inclusão', 'Mentoria e treinamento', 'Gestão de mudanças', 'Desenvolvimento de pessoas', 'Habilidades em redes sociais', 'Conhecimento em SEO', 'Programação', 'Gerenciamento de stakeholders', 'Planejamento financeiro'],
            'Estados': ['Acre', 'Alagoas', 'Amazonas', 'Bahia', 'Ceará', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins', 'Distrito Federal']
        };

        return filterOptions[selectedFilter].map(option => (
            <button
                key={option}
                className={`filter-button ${appliedFilters.includes(`${selectedFilter}: ${option}`) ? 'selected' : ''}`}
                onClick={() => handleFilterClick(option)}
            >
                {option}
            </button>
        ));
    }

    function handleSearchChange(event) {
        const query = event.target.value;
        setSearchQuery(query);
    
        // Quando a pesquisa é apagada, não aplica filtros de pesquisa, mas mantém os filtros de categoria
        if (!query) {
            setFilteredVacancies(vacancies); // Reseta para todas as vagas quando a pesquisa é apagada
        } else {
            applyFilters(); // Aplica os filtros com base na pesquisa
        }
    }
    


    function handleFilterSelect(filter) {
        console.log("Filtro selecionado: " + filter)
        setSelectedFilter(filter);
    }

    function handleFilterClick(option) {
        const filterString = `${selectedFilter}: ${option}`;
        setAppliedFilters(prev =>
            prev.includes(filterString) ? prev.filter(f => f !== filterString) : [...prev, filterString]
        );
    }

    function handleRemoveFilter(filter) {
        setAppliedFilters(prev => prev.filter(f => f !== filter));
    }
    

    function applyFilters() {
        let filtered = vacancies;  // Inicia com todas as vagas
    
        // Aplica o filtro de pesquisa
        if (searchQuery) {
            filtered = filtered.filter(vaga =>
                vaga.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) // Filtra as vagas pelo título
            );
        }
    
        // Aplica todos os outros filtros (como Área de Atuação, Estado, etc.)
        appliedFilters.forEach(filter => {
            const [category, value] = filter.split(': ');
    
            if (category === 'Área de Atuação') {
                filtered = filtered.filter(vaga => vaga.jobArea.toLowerCase().includes(value.toLowerCase()));
            } else if (category === 'Estados') {
                filtered = filtered.filter(vaga => vaga.jobLocation.state.toLowerCase().includes(value.toLowerCase()));
            } else if (category === 'Idioma') {
                filtered = filtered.filter(vaga => {
                    return (
                        vaga.requiredQualifications.some(qualification => qualification.toLowerCase().includes(value.toLowerCase())) ||
                        vaga.desiredSkills.some(skill => skill.toLowerCase().includes(value.toLowerCase()))
                    );
                });
            } else if (category === 'Habilidades e Competências') {
                filtered = filtered.filter(vaga => {
                    return (
                        vaga.requiredQualifications.some(qualification => qualification.toLowerCase().includes(value.toLowerCase())) ||
                        vaga.desiredSkills.some(skill => skill.toLowerCase().includes(value.toLowerCase()))
                    );
                });
            } else if (category === 'Salário') {
                filtered = filtered.filter(vaga => {
                    const salaryString = vaga.salary; 
                    const salaryRegex = /([A-Za-z₽₩¥₹€$A₽₾₱₤]+)\s*(\d+(\.\d{1,2})?)/;
    
                    const match = salaryString.match(salaryRegex);
    
                    if (match && match[1] === salaryCurrency) {
                        const salaryValue = parseFloat(match[2]);
                        return salaryValue >= salaryFilter;
                    }
                    return false;
                });
            }
        });
    
        setFilteredVacancies(filtered); // Atualiza as vagas filtradas
    } 
    
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);
   
    return (
        <>
            {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
            {windowWidth < 450 && <MenuMobile/>}
            <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className="cabecalhoCandidato">
                    <div>
                        <CandidateName />
                        <div className="input-container">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Buscar Vagas"
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                    </div>

                    <div className="filtro">
                        <h2>Todas as Vagas</h2>
                        <div className="filtro-vagas">
                            <button onClick={() => setFilterModalVisible(true)}>
                                Filtro
                            </button>
                        </div>
                    </div>
                </section>

                <div className="container-todas-vagas">
                    <BoxVaga filteredVacancies={filteredVacancies} />
                </div>

                {filterModalVisible && (
                    <div className="modal-overlay">
                        <div className="filter-modal">
                            <div className="modal-header">
                                <h2>Filtros</h2>
                                <button onClick={() => setFilterModalVisible(false)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="modal-content-filter">
                                <div className="sidebar">
                                    {['Idioma', 'Estados', 'Área de Atuação', 'Salário', 'Habilidades e Competências'].map(filter => (
                                        <button
                                            key={filter}
                                            className={selectedFilter === filter ? 'active' : 'disable'}
                                            onClick={() => handleFilterSelect(filter)}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                    <div className='button-filter'>
                                        <button className='apply-filter' onClick={applyFilters}>Aplicar Filtros</button>
                                    </div>
                                </div>
                                <div className="filter-options">
                                    <div className="applied-filters">
                                        <h4>Filtros selecionados:</h4>
                                        <div className='applied-filters-selected'>
                                            {appliedFilters.map(filter => (
                                                <span key={filter} className="filter-tag" onClick={() => handleRemoveFilter(filter)}>
                                                    {filter} <i className="fa-solid fa-times"></i>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="filter-itens salarioItens">
                                        {renderFilterOptions()}
                                        {selectedFilter === 'Salário' && (
                                            <>
                                                <h5>Salário</h5>
                                                <div>
                                                    {/* <p>Tipo de moeda:</p> */}
                        
                                                </div>
                                                <div className="salary-range">
                                                <select value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value)}>
                                                        <option value="R$">R$ - Real Brasileiro</option>
                                                        <option value="US$">US$ - Dólar Americano</option>
                                                        <option value="€">€ - Euro</option>
                                                        <option value="£">£ - Libra Esterlina</option>
                                                        <option value="¥">¥ - Iene Japonês</option>
                                                        <option value="₩">₩ - Won Sul-Coreano</option>
                                                        <option value="A$">A$ - Dólar Australiano</option>
                                                        <option value="C$">C$ - Dólar Canadense</option>
                                                        <option value="₹">₹ - Rúpia Indiana</option>
                                                        <option value="₽">₽ - Rublo Russo</option>
                                                    </select>
                                                    <span>Salário mínimo: {salaryCurrency}{salaryFilter}</span>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="10000"
                                                        step="100"
                                                        value={salaryFilter}
                                                        onChange={(e) => setSalaryFilter(parseFloat(e.target.value))}
                                                    />
                                                </div>

                                                <div>
                                                <button onClick={() => setSalaryFilter(0)}>Resetar</button>
                                                    <button onClick={() => {
                                                        setAppliedFilters([...appliedFilters, `Salário: ${salaryCurrency} ${salaryFilter}`]);
                                                    }}>Confirmar</button>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default TodasVagas;
