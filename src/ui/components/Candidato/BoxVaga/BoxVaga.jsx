import React, { useState, useEffect, useRef } from 'react';
import { useFavorites } from '../../../../Context/FavoritesContext';
import { useInterested } from '../../../../Context/InterestedContext';
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'sonner'
import './BoxVaga.css';

export function BoxVaga({ filteredVacancies }) {
  const [jobVacancies, setJobVacancies] = useState([]);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isInterested, addInterested, removeInterested } = useInterested();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const cardRef = useRef(null);
  const denunciaCardRef = useRef(null);
  /* const [filteredVacancies, setFilteredVacancies] = useState([]); */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleFavorite = async (vaga) => {
    if (isFavorite(vaga._id)) {
      await removeFavorite(vaga._id);
    } else {
      await addFavorite(vaga);
    }
  };

useEffect(() => {
  const fetchJobVacancies = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/vacancy/list-vacancies');
      setJobVacancies(response.data);
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
    }
  };

  fetchJobVacancies();
}, []);

/* useEffect(() => {
  const applyFilters = () => {
    const filtered = jobVacancies.filter((vaga) => {
      const jobTitle = vaga.jobTitle || ''; // Garantir que é uma string
      const jobArea = vaga.jobArea || ''; // Garantir que é uma string
  
      const matchesSearch = jobTitle.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesFilter = selectedFilter
        ? jobArea.toLowerCase() === (selectedFilter || '').toLowerCase()
        : true;
  
      let matchesAdvancedFilter = true;
      if (advFilteredFilter) {
        if (advFilteredFilter.salary && vaga.salary < advFilteredFilter.salary) {
          matchesAdvancedFilter = false;
        }
      }
  
      return matchesSearch && matchesFilter && matchesAdvancedFilter;
    });
  
    setFilteredVacancies(filtered);
  };
  

  applyFilters();
}, [jobVacancies, searchQuery, selectedFilter, advFilteredFilter]);
 */
useEffect(() => {
  const handleClickOutside = (event) => {
    console.log("Clique detectado:", event.target);
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      console.log("Fechando selectedVacancy");
      setSelectedVacancy(null);
      document.body.classList.remove('no-scroll');
    }
    if (denunciaCardRef.current && !denunciaCardRef.current.contains(event.target)) {
      console.log("Fechando denúncia");
      setIsCardOpen(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.body.classList.remove('no-scroll');
  };
}, [cardRef, denunciaCardRef]); // Inclua refs como dependências


  const toggleInterested = async (vaga) => {
    if (isInterested(vaga._id)) {
      await removeInterested(vaga._id);
    } else {
      await addInterested(vaga);
    }
  };

  const handleDenunciaButtonClick = () => {
    setIsCardOpen((prevState) => !prevState);
  };

  const handleMotivoChange = (event) => setMotivo(event.target.value);

  const handleDescricaoChange = (event) => setDescricao(event.target.value);

  const handleSubmitDenuncia = async () => {
    if (!motivo || !descricao || !selectedVacancy) {
      console.error("Por favor, preencha todos os campos da denúncia.");
      toast.error("Por favor, preencha todos os campos da denúncia.");
      return;
    }

    try {
      const payload = {
        type: "vacancy", // Ajuste o tipo conforme necessário (pode ser "Vaga" ou outro tipo se houver mais opções)
        targetId: selectedVacancy._id, // ID da vaga denunciada
        reportReason: motivo, // Motivo da denúncia
        description: descricao, // Descrição adicional
      };

      // Enviando a denúncia para o backend
      const response = await axiosInstance.post('/api/report/create-report', payload);

      // Fechando o modal e limpando os campos
      setIsCardOpen(false);
      setMotivo('');
      setDescricao('');

      // Exibir mensagem de sucesso da resposta da API
      toast.success(response.data.message || "Denúncia enviada com sucesso!");
    } catch (error) {
      // Exibir mensagem de erro da resposta da API
      const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro ao enviar a denúncia.";
      toast.error(errorMessage);
    }
  };

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="container-box-vagas">
        {filteredVacancies.length === 0 ? (
          <p className="no-vacancies-message">Nenhuma vaga cadastrada no momento.</p>
        ) : (
          filteredVacancies.map((vaga) => (
            <div key={vaga._id} className="box-vaga" onClick={() => setSelectedVacancy(vaga)}>
              <div className="info-box-vaga">
                <div className="header-box-vaga">
                  <div className="nome-vaga">
                    <h2>{windowWidth < 450 ? truncateText(vaga.jobTitle, 10) : truncateText(vaga.jobTitle, 20)}</h2>
                    <Link>{vaga.companyId?.companyName ? truncateDescription(vaga.companyId.companyName, 20) : 'Empresa não encontrada'}</Link>
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(vaga);
                  }}>
                    <i className={`fa-${isFavorite(vaga._id) ? 'solid' : 'regular'} fa-star`}></i>
                  </button>
                </div>
                <div className="vaga-info">
                  <h3>{vaga.salary ? `${vaga.salary}` : 'A definir'}</h3>
                  <p>{truncateDescription(vaga.jobDescription)}</p>
                </div>
              </div>
              <div className="area-vaga">
                <Link to="#">{vaga.jobArea}</Link>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedVacancy && (
        <>
          <div className="modal-overlay"></div>
          <div className="vaga-cardInfo" ref={cardRef}>
            <div className="vagaArea">
              <h2>{selectedVacancy.jobArea}</h2>
            </div>
            <div className="vagaContent">
              <div className="vagaTitle">
                <h2>{selectedVacancy.jobTitle}</h2>
                <Link to={`/pre-visualizacaoE/${selectedVacancy.companyId?._id}`}>
                  {selectedVacancy.companyId?.companyName || 'Empresa não encontrada'}
                </Link>
              </div>
              <div className="vagaInfo">
                <h3>{selectedVacancy.jobLocation?.city} - {selectedVacancy.jobLocation?.state}</h3>
                <p><span>Faixa salarial:</span> {selectedVacancy.salary ? `${selectedVacancy.salary}` : 'A definir'}</p>
              </div>
              <div className="vagaDescription">
                <p>{truncateText(selectedVacancy.jobDescription, 180)}</p>
              </div>
              <div className='vagaExpediente'>
                <div className='listaDiasTrabalhados'>
                  <h4>Carga de trabalho</h4>
                  <ul>
                    {selectedVacancy.workSchedule.workingDays.map((day, index) => (
                      <li key={index}>- {day}</li>
                    ))}
                  </ul>
                </div>
                <div className='horarioDiasTrabalhados'>
                  <div>
                    <h4>Horário:</h4>
                    <h5>{selectedVacancy.workSchedule.workingHours}</h5>
                  </div>
                  <div className='alinhamentoHorarioDT'>
                    <h4>Tipo de Emprego</h4>
                    <h5>{selectedVacancy.employmentType}</h5>
                  </div>
                </div>
              </div>
              <div className='vagaQualificacoesandHabilidades'>
                <div className='containerVagaCard'>
                  <h4>Qualificações necessárias</h4>
                  <ul>
                    {selectedVacancy.requiredQualifications.map((qualification, index) => (
                      <li key={index}>- {qualification} </li>
                    ))}
                  </ul>
                </div>
                <div className='containerVagaCard'>
                  <h4>Habilidades requisitadas</h4>
                  <span> {selectedVacancy.desiredSkills} </span>
                </div>
              </div>
              <div className='buttonsVagaCard'>
                <button className='buttonDenuncia' onClick={handleDenunciaButtonClick}>
                  Denunciar
                </button>
                <button className='buttonEnviarCV' onClick={() => toggleInterested(selectedVacancy)}>
                  {isInterested(selectedVacancy._id) ? 'Remover Candidatura' : 'Enviar Currículo'}
                </button>
              </div>
              {isCardOpen && (
                <div className="denunciaCard" ref={denunciaCardRef}>
                  <label>
                    Motivo:
                    <select value={motivo} onChange={handleMotivoChange}>
                      <option value="" disabled>Selecione um motivo</option>
                      <option value="Conteúdo Inadequado">Conteúdo Inadequado</option>
                      <option value="Discriminação ou Assédio">Discriminação ou Assédio</option>
                      <option value="Informações Falsas">Informações Falsas</option>
                      <option value="Spam ou Golpe">Spam ou Golpe</option>
                      <option value="Atividade Suspeita">Atividade Suspeita</option>
                      <option value="Linguagem Ofensiva">Linguagem Ofensiva</option>
                      <option value="Violação de Privacidade">Violação de Privacidade</option>
                      <option value="Violência ou Ameaça">Violência ou Ameaça</option>
                      <option value="Falsificação de Identidade">Falsificação de Identidade</option>
                      <option value="Fraude ou Informações Enganosas">Fraude ou Informações Enganosas</option>
                      <option value="Comportamento Desrespeitoso">Comportamento Desrespeitoso</option>
                      <option value="Vaga Enganosa">Vaga Enganosa</option>
                      <option value="Conteúdo Ilegal">Conteúdo Ilegal</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </label>
                  <label>
                    Descrição:
                    <textarea value={descricao} onChange={handleDescricaoChange} placeholder="Descreva o motivo da denúncia"></textarea>
                  </label>
                  <button onClick={handleSubmitDenuncia}>Enviar Denúncia</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default BoxVaga;