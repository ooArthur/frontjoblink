import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';
import MenuMobile from '../MenuMobile/MenuMobile';
import CompanyName from '../CompanyName/CompanyName';
import './ListarCandidato.css';
import BoxCandidatos from '../BoxCandidatos/BoxCandidatos';

export default function ListarCandidatos() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const cardRef = useRef(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('Idioma');
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axiosInstance.get('/api/user/candidate/list-candidates');
                setCandidates(response.data);
                setFilteredCandidates(response.data);
            } catch (error) {
                console.error('Erro ao buscar os candidatos:', error);
            }
        };
        fetchCandidates();
    }, []);

    useEffect(() => {
        const filtered = candidates.filter(candidato =>
            (candidato.candidateName && candidato.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (candidato.areaOfInterest && candidato.areaOfInterest.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (candidato.candidateAbout && candidato.candidateAbout.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (candidato.candidateTargetSalary && candidato.candidateTargetSalary.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCandidates(filtered);
    }, [searchTerm, candidates]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleFilterSelect(filter) {
        setSelectedFilter(filter);
    }

    function handleFilterClick(option) {
        setAppliedFilters(prev =>
            prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
        );
    }

    function renderFilterOptions() {
        const filterOptions = {
            'Idioma': ['Africâner', 'Albanês', 'Alemão', 'Amárico', 'Árabe', 'Armênio', 'Azeri', 'Basco', 'Bengali', 'Bielorrusso', 'Birmanês', 'Bósnio', 'Búlgaro', 'Cazaque', 'Cebuano', 'Chinês', 'Cingalês', 'Coreano', 'Croata', 'Dinamarquês', 'Eslovaco', 'Esloveno', 'Espanhol', 'Esperanto', 'Estoniano', 'Finlandês', 'Francês', 'Gaélico Escocês', 'Galês', 'Georgiano', 'Grego', 'Guzerate', 'Haitiano', 'Hebraico', 'Híndi', 'Holandês', 'Húngaro', 'Indonésio', 'Inglês', 'Islandês', 'Italiano', 'Japonês', 'Javanês', 'Khmer', 'Kinyarwanda', 'Kirguiz', 'Laosiano', 'Letão', 'Lituano', 'Luxemburguês', 'Macedônio', 'Malaio', 'Malgaxe', 'Maltês', 'Maori', 'Marata', 'Mongol', 'Nepalês', 'Norueguês', 'Pachto', 'Persa', 'Polonês', 'Português', 'Punjabi', 'Quirguiz', 'Romeno', 'Russo', 'Sérvio', 'Suaíli', 'Sueco', 'Tadjique', 'Tailandês', 'Tâmil', 'Tcheco', 'Telugu', 'Tibetano', 'Tigrínia', 'Tonga', 'Turco', 'Turcomano', 'Ucraniano', 'Urdu', 'Uzbeque', 'Vietnamita', 'Xhosa', 'Zulu', 'Outro'],
            'Idade': [
                'Menor que 20', 'Menor que 25', 'Menor que 30', 'Menor que 35', 'Menor que 40',
                'Menor que 45', 'Menor que 50', 'Menor que 55', 'Menor que 60', 'Menor que 65',
                'Menor que 70', 'Menor que 75', 'Menor que 80',
                'Maior que 20', 'Maior que 25', 'Maior que 30', 'Maior que 35', 'Maior que 40',
                'Maior que 45', 'Maior que 50', 'Maior que 55', 'Maior que 60', 'Maior que 65',
                'Maior que 70', 'Maior que 75', 'Maior que 80',
                'Entre 20 e 30', 'Entre 30 e 40', 'Entre 40 e 50', 'Entre 50 e 60', 'Entre 60 e 70',
                'Entre 70 e 80', 'Entre 80 e 90',
                'Exatamente 18', 'Exatamente 21', 'Exatamente 25', 'Exatamente 30',
                'Exatamente 35', 'Exatamente 40', 'Exatamente 45', 'Exatamente 50',
                'Exatamente 55', 'Exatamente 60', 'Exatamente 65', 'Exatamente 70',
                'Exatamente 75', 'Exatamente 80'
            ],
            'Área de Atuação': ['Tecnologia',
                'Saúde',
                'Educação',
                'Finanças',
                'Engenharia',
                'Marketing',
                'Vendas',
                'Recursos Humanos',
                'Administração',
                'Jurídico',
                'Logística',
                'Atendimento ao Cliente',
                'Design',
                'Operações',
                'Construção Civil'],
            'Experiência': ['Tem experiência', 'Não tem experiência', 'Mais de 3 experiências', 'Mais de 5 experiências'],
            'Habilidades e Competências': ['Comunicação',
                'Trabalho em equipe',
                'Liderança',
                'Resolução de problemas',
                'Pensamento crítico',
                'Gestão de tempo',
                'Flexibilidade',
                'Iniciativa',
                'Criatividade',
                'Adaptabilidade',
                'Organização',
                'Atenção aos detalhes',
                'Ética profissional',
                'Empatia',
                'Inteligência emocional',
                'Gestão de conflitos',
                'Capacidade de aprendizado',
                'Planejamento estratégico',
                'Negociação',
                'Análise de dados',
                'Técnicas de apresentação',
                'Automotivação',
                'Escuta ativa',
                'Gestão de projetos',
                'Multitarefa',
                'Conhecimento em tecnologia',
                'Resiliência',
                'Autogestão',
                'Solução de conflitos',
                'Pensamento analítico',
                'Tomada de decisão',
                'Comprometimento',
                'Orientação para resultados',
                'Competências interpessoais',
                'Proatividade',
                'Habilidades em vendas',
                'Habilidades em atendimento ao cliente',
                'Gestão de riscos',
                'Inovação',
                'Conhecimento em diversidade e inclusão',
                'Mentoria e treinamento',
                'Gestão de mudanças',
                'Desenvolvimento de pessoas',
                'Habilidades em redes sociais',
                'Conhecimento em SEO',
                'Programação',
                'Gerenciamento de stakeholders',
                'Planejamento financeiro']
        };

        return filterOptions[selectedFilter].map(option => (
            <button
                key={option}
                className={`filter-button ${appliedFilters.includes(option) ? 'selected' : ''}`}
                onClick={() => handleFilterClick(option)}
            >
                {option}
            </button>
        ));
    }
    function handleRemoveFilter(filter) {
        setAppliedFilters(prev => prev.filter(f => f !== filter));
    }

    function ageCalculator(birth) {
        const candidateBirth = new Date(birth);
        const today = new Date();
        let age = today.getFullYear() - candidateBirth.getFullYear();
        const monthBirth = candidateBirth.getMonth();
        const dayBirth = candidateBirth.getDate();
        const actualMonth = today.getMonth();
        const actualDay = today.getDate();

        if (actualMonth < monthBirth || (actualMonth === monthBirth && actualDay < dayBirth)) {
            age--;
        }

        return age;
    }

    function applyFilters() {
        let filtered = candidates;

        appliedFilters.forEach(filter => {
            if (filter.startsWith('Menor que')) {
                const ageLimit = parseInt(filter.replace('Menor que ', ''));
                filtered = filtered.filter(candidato => Number(ageCalculator(candidato.candidateBirth)) < ageLimit);
            } else if (filter.startsWith('Maior que')) {
                const ageLimit = parseInt(filter.replace('Maior que ', ''));
                filtered = filtered.filter(candidato => Number(ageCalculator(candidato.candidateBirth)) > ageLimit);
            } else if (filter.startsWith('Entre')) {
                const [min, max] = filter.replace('Entre ', '').split(' e ').map(Number);
                filtered = filtered.filter(candidato => Number(ageCalculator(candidato.candidateBirth)) >= min && Number(ageCalculator(candidato.candidateBirth)) <= max);
            } else if (filter.startsWith('Exatamente')) {
                const exactAge = parseInt(filter.replace('Exatamente ', ''));
                filtered = filtered.filter(candidato => Number(ageCalculator(candidato.candidateBirth)) === exactAge);
            } else if (filter.toLowerCase() === 'tem experiência') {
                // Verifica se o candidato tem pelo menos uma experiência
                filtered = filtered.filter(candidato => candidato.candidateExperience && candidato.candidateExperience.length > 0);
            } else if (filter.toLowerCase() === 'não tem experiência') {
                // Verifica se o candidato não tem nenhuma experiência
                filtered = filtered.filter(candidato => !candidato.candidateExperience || candidato.candidateExperience.length === 0);
            } else if (filter.startsWith('Experiência: ')) {
                // Filtra pela quantidade de experiências (Ex.: "Experiência: 3")
                const experienceCount = parseInt(filter.replace('Experiência: ', ''));
                filtered = filtered.filter(candidato => candidato.candidateExperience && candidato.candidateExperience.length === experienceCount);
            } else {
                // Caso seja um filtro de idioma, área de atuação, experiência ou habilidades
                const lowerCaseFilter = filter.toLowerCase();
                filtered = filtered.filter(candidato => {
                    const candidateData = JSON.stringify(candidato).toLowerCase();
                    return (
                        candidateData.includes(lowerCaseFilter) ||
                        // Verifica se o idioma contém o filtro
                        (candidato.candidateIdioms?.name && candidato.candidateIdioms.name.toLowerCase().includes(lowerCaseFilter)) ||
                        // Verifica se a área de interesse contém o filtro
                        (candidato.areaOfInterest && candidato.areaOfInterest.toLowerCase().includes(lowerCaseFilter)) ||
                        // Verifica se a experiência contém o filtro
                        (candidato.candidateExperience?.role && candidato.candidateExperience.role.toLowerCase().includes(lowerCaseFilter)) ||
                        // Verifica se alguma das habilidades contém o filtro
                        (candidato.skills && candidato.skills.some(skill => skill.toLowerCase().includes(lowerCaseFilter)))
                    );
                });
            }
        });

        setFilteredCandidates(filtered);
        setFilterModalVisible(false);
    }

    return (
        <>
            {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
            {windowWidth < 450 && <MenuMobile />}
            <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className="cabecalhoCandidato">
                    <div>
                        <CompanyName />
                        <div className="input-container">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Buscar Candidatos"
                                className="search-input"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="filtro">
                        <h2>Todas os candidatos</h2>
                        <div className='filtro-vagas'>
                            <button onClick={() => setFilterModalVisible(true)}>Filtro</button>
                        </div>
                    </div>



                </section>

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
                                    {['Idioma', 'Idade', 'Área de Atuação', 'Experiência', 'Habilidades e Competências'].map(filter => (
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
                                    <div className="filter-itens">
                                        {renderFilterOptions()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <div className='container-box-vagas'>
                    <BoxCandidatos filteredCandidates={filteredCandidates} />
                </div>



            </main>
        </>
    );
}
