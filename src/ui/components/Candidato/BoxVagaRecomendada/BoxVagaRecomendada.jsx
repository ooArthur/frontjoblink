import React, { useEffect, useRef, useState } from 'react';
import { useFavorites } from '../../../../Context/FavoritesContext'; // Usar o contexto de favoritos
import { useInterested } from '../../../../Context/InterestedContext'; // Usar o contexto de interessados
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import '../BoxVaga/BoxVaga.css';

export function BoxVagaRecomendada() {
  const [recommendedVacancies, setRecommendedVacancies] = useState([]); // Vagas recomendadas
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); // Contexto de favoritos
  const { isInterested, addInterested, removeInterested } = useInterested(); // Contexto de interessados
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [motivo, setMotivo] = useState(''); // Motivo da denúncia
  const [descricao, setDescricao] = useState(''); // Descrição da denúncia
  const [isCardOpen, setIsCardOpen] = useState(false); // Controle do card de denúncia
  const cardRef = useRef(null);
  const denunciaCardRef = useRef(null);

  // Fetching as vagas recomendadas
  useEffect(() => {
    const fetchRecommendedVacancies = async () => {
      try {
        const response = await axiosInstance.get('/api/user/company/vacancy/recommend-jobvacancies');
        if (Array.isArray(response.data)) {
          setRecommendedVacancies(response.data);
          console.log("Recomendações: " + recommendedVacancies)
        } else {
          setRecommendedVacancies([]); // Reset para array vazio se não for um array
        }
      } catch (error) {
        setRecommendedVacancies([]); // Reset para array vazio em caso de erro
      }
    };

    fetchRecommendedVacancies();
  }, []);

  // Fechar o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSelectedVacancy(null);
        document.body.classList.remove('no-scroll');
      }
      if (denunciaCardRef.current && !denunciaCardRef.current.contains(event.target)) {
        setIsCardOpen(false);
      }
    };

    if (selectedVacancy) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('no-scroll');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('no-scroll');
    };
  }, [selectedVacancy]);

  const toggleFavorite = async (vaga) => {
    if (isFavorite(vaga._id)) {
      await removeFavorite(vaga._id);
    } else {
      await addFavorite(vaga);
    }
  };

  // Alterna a candidatura do usuário para uma vaga
  const toggleInterested = async (vaga) => {
    if (isInterested(vaga._id)) {
      await removeInterested(vaga._id);
    } else {
      await addInterested(vaga);
    }
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  const handleDenunciaButtonClick = () => {
    setIsCardOpen((prevState) => !prevState);
  };

  const handleMotivoChange = (event) => setMotivo(event.target.value);
  const handleDescricaoChange = (event) => setDescricao(event.target.value);

  const handleSubmitDenuncia = async () => {
    if (!motivo || !descricao || !selectedVacancy) {
      toast.error("Por favor, preencha todos os campos da denúncia.");
      return;
    }

    try {
      const payload = {
        type: "vacancy",
        targetId: selectedVacancy._id,
        reportReason: motivo,
        description: descricao,
      };

      const response = await axiosInstance.post('/api/report/create-report', payload);
      setIsCardOpen(false);
      setMotivo('');
      setDescricao('');
      toast.success(response.data.message || "Denúncia enviada com sucesso!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro ao enviar a denúncia.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="container-box-vagas" id='container-box-vagasFavoritas'>
        {recommendedVacancies.length === 0 ? (
          <p className="no-vacancies-message">Nenhuma vaga recomendada no momento.</p>
        ) : (
          recommendedVacancies.map((vaga) => (
            <div key={vaga._id} className="box-vaga" id='box-vagaFavorita' onClick={() => setSelectedVacancy(vaga)}>
              <div className="info-box-vaga">
                <div className="header-box-vaga">
                  <div className="nome-vaga">
                    <h2>{vaga.jobTitle}</h2>
                    <h3>{vaga.companyId?.companyName || 'Empresa não encontrada'}</h3>
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(vaga);
                  }}>
                    <i className={`fa-${isFavorite(vaga._id) ? 'solid' : 'regular'} fa-star`}></i>
                  </button>
                </div>
                <div className="vaga-info">
                  <h3>{vaga.salary ? ` ${vaga.salary}` : 'A definir'}</h3>
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
                <h3>{selectedVacancy.companyId?.companyName || 'Empresa não encontrada'}</h3>
              </div>
              <div className="vagaInfo">
                <h3>{selectedVacancy.jobLocation?.city} - {selectedVacancy.jobLocation?.state}</h3>
                <p><span>Faixa salarial:</span> {selectedVacancy.salary ? ` ${selectedVacancy.salary}` : 'A definir'}</p>
              </div>
              <div className="vagaDescription">
                <p>{selectedVacancy.jobDescription}</p>
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
                      <li style={{ fontSize: '1.2vw', fontWeight: '300' }} key={index}>- {qualification} </li>
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

export default BoxVagaRecomendada;