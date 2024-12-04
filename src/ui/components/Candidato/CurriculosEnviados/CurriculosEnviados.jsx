import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile"
import CandidateName from "../CandidateName/CandidateName";
import './CurriculosEnviados.css';

export function CurriculosEnviados() {
  const [appliedVacancies, setAppliedVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // Estado para filtro de status
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedVacancies = async () => {
      try {
        const response = await axiosInstance.get('/api/user/company/vacancy/vacancy-status');
        if (Array.isArray(response.data)) {
          const filteredVacancies = response.data.filter(vaga => vaga.status !== 'Dispensado'); // Filtra as candidaturas dispensadas
          setAppliedVacancies(filteredVacancies);
          setFilteredVacancies(filteredVacancies); // Inicializa o estado filtrado
        } else {
          console.error('Nenhuma candidatura encontrada.');
        }
      } catch (error) {
        console.error('Erro ao buscar as candidaturas:', error);
      }
    };

    fetchAppliedVacancies();
  }, []);

  // Função para atualizar o filtro e exibir as vagas filtradas com base no status
  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    // Filtra as candidaturas localmente com base no status e no termo de pesquisa
    filterVacancies(selectedStatus, searchTerm);
  };

  // Função para atualizar o filtro e exibir as vagas filtradas com base na pesquisa
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filtra as candidaturas localmente com base no status e no termo de pesquisa
    filterVacancies(statusFilter, term);
  };

  // Função que aplica os filtros de status e pesquisa
  const filterVacancies = (status, term) => {
    let filtered = appliedVacancies;

    // Filtro por status
    if (status && status !== "") {
      filtered = filtered.filter(vaga => vaga.status === status);
    }

    // Filtro por nome do trabalho (jobTitle)
    if (term && term.trim() !== "") {
      filtered = filtered.filter(vaga => vaga.vacancy.jobTitle.toLowerCase().includes(term.toLowerCase()));
    }

    setFilteredVacancies(filtered);
  };

  const handleClick = (vagaId) => {
    navigate(`/vaga/${vagaId}`);
  };

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const handleClick2 = (companyId) => {
    navigate(`/pre-visualizacaoE/${companyId._id}`);
  };

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
      {windowWidth < 450 && <MenuMobile />}
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
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

        </section>

        <section className='curriculos-enviados'>
          <div className="filtro">
            <h2>Minhas Candidaturas</h2>
            <div className='filtro-vagas'>
              <select value={statusFilter} onChange={handleStatusFilterChange}>
                <option disabled value="">Candidaturas</option>
                {['Currículo Enviado', 'Em Análise', 'Aprovado', 'Dispensado'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <section className='curriculo-enviado-content'>
            {filteredVacancies.length === 0 ? (
              <p style={{ color: '#777' }}>
                {statusFilter || searchTerm ? `Nenhuma candidatura encontrada com o status "${statusFilter}" e o nome "${searchTerm}"` : 'Nenhuma candidatura realizada.'}
              </p>
            ) : (
              filteredVacancies.map((vaga) => (
                <div onClick={() => handleClick2(vaga.vacancy.companyId)} key={vaga.vacancy._id} className='candidaturaConfig'>
                  <div className='candidaturas-content'>



                    <div className='detalhesCandidatura'>
                      <div className='divDetalhes'>
                        <h2 id='tituloDetalhes'>{vaga.vacancy.jobTitle}</h2>
                        <h5> {vaga.vacancy.salary ? vaga.vacancy.salary : 'Salário a definir'}</h5>
                      </div>
                      <div className='divDetalhes'>
                        <h5 id='semiTituloDetalhes'>{vaga.vacancy.companyId?.companyName || 'Nome da Empresa Não Disponível'}</h5>
                        <h5>{vaga.vacancy.jobLocation ? `${vaga.vacancy.jobLocation.city}, ${vaga.vacancy.jobLocation.state}` : 'Localização não informada'}</h5>
                      </div>
                      <p>{truncateText(vaga.vacancy.jobDescription, 300)}</p>
                    </div>
                    <div className='detalhesStatus'>
                      <div className='detalhesStatusTitulo'>
                        <h3 onClick={() => handleClick(vaga.vacancy._id)} >
                          Status
                        </h3>
                      </div>
                      <div className='optionDetalhesStatus'>
                        <div className={`divDetalhesStatus ${vaga.status === 'Currículo Enviado' ? 'curriculoActive' : ''}`}>
                          <h4>Currículo Enviado</h4>
                        </div>
                        <div className={`divDetalhesStatus ${vaga.status === 'Em Análise' ? 'curriculoActive' : ''}`}>
                          <h4>Em Análise</h4>
                        </div>
                        <div className={`divDetalhesStatus ${vaga.status === 'Aprovado' ? 'curriculoActive' : ''}`}>
                          <h4>Aprovado</h4>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </section>
        </section>

      </main>
    </>
  );
}

export default CurriculosEnviados;