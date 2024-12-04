import React, { useState, useEffect, useRef } from 'react';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile"
import BoxVagaFavorita from '../BoxVagaFavorita/BoxVagaFavorita';
import CandidateName from '../CandidateName/CandidateName';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';
import { useFavorites } from '../../../../Context/FavoritesContext'; // Usar o contexto de favoritos
import { useInterested } from '../../../../Context/InterestedContext'; // Usar o contexto de interessados
import { toast } from 'sonner';
import './VagasFavoritas.css';


function VagasFavoritas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isInterested, addInterested, removeInterested, dailyApplicationsCount } = useInterested();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const cardRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSelectedVacancy(null);
        document.body.classList.remove('no-scroll');
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

  const [selectedVacancies, setSelectedVacancies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleFavorite = async (vaga) => {
    if (isFavorite(vaga._id)) {
      await removeFavorite(vaga._id);
    } else {
      await addFavorite(vaga);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const toggleVacancySelection = (vacancyId) => {
    if (!vacancyId) {
      console.warn('Tentativa de selecionar vaga com ID indefinido:', vacancyId);
      return;
    }

    setSelectedVacancies((prevSelected) =>
      prevSelected.includes(vacancyId)
        ? prevSelected.filter((id) => id !== vacancyId)
        : [...prevSelected, vacancyId]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitApplications = async () => {
    if (selectedVacancies.length + dailyApplicationsCount > 10) {
      toast.error('Você ultrapassou o limite diário de candidaturas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/api/user/company/vacancy/add-interested-batch', {
        jobVacancyIds: selectedVacancies,
      });

      let failedApplications = [];

      if (response.status === 200) {
        toast.success(response.data.message);
        setSelectedVacancies([]);
      } else if (response.status === 207) {
        failedApplications = response.data.failedApplications;
        failedApplications.forEach((failed) => {
          toast.error(`Falha na candidatura para a vaga ${failed.jobVacancyId}: ${failed.message}`);
        });

        selectedVacancies.forEach((jobVacancyId) => {
          if (!failedApplications.some((failed) => failed.jobVacancyId === jobVacancyId)) {
            addInterested({ _id: jobVacancyId });
          }
        });

        setSelectedVacancies([]);
      }
    } catch (error) {
      console.error('Erro ao enviar candidaturas:', error);
      toast.error('Erro ao enviar candidaturas.');
    } finally {
      closeModal();
      setIsSubmitting(false);

      window.location.reload();
    }
  };


  const confirmApplications = () => {
    if (window.confirm(`Você está prestes a se candidatar a ${selectedVacancies.length} vagas. Deseja continuar?`)) {
      handleSubmitApplications();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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
            <div className='infos-diario'>
              <div className="sessao-diario">
                <div className='limite-diario'>
                  <p>Limite Diário</p>
                  <span>{dailyApplicationsCount} / 10</span>
                </div>
              </div>
              <button onClick={openModal} className="apply-button">
                Candidatar-se a Vagas
              </button>
            </div>
          </div>
        </section>

        <section className='f-container'>
          <div className='container-title'>
            <h2>Vagas Favoritas</h2>
            <div className='limite-mobile'>
            <p style={{fontWeight: '200'}}>Limite diário</p>
              <h2><span>{dailyApplicationsCount} </span>/ 10</h2>

            </div>
          </div>
          <div className="container-box-vagas container-box-vagas2">
            {favorites.length === 0 ? (
              <p className="no-vacancies-message">Nenhuma vaga favoritada no momento.</p>
            ) : (
              favorites.map((vaga) => (
                <div key={vaga._id} className="box-vaga" onClick={() => setSelectedVacancy(vaga)}>
                  <div className="info-box-vaga">
                    <div className="header-box-vaga">
                      <div className="nome-vaga">
                        {/* Aplica truncamento no jobTitle apenas quando a largura da tela for menor que 450px */}
                        <h2> {windowWidth < 450 ? truncateText(vaga.jobTitle, 10) : truncateText(vaga.jobTitle, 20)}</h2>
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
                    <Link to="/pre-visualizacaoE">{selectedVacancy.companyId?.companyName || 'Empresa não encontrada'}</Link>
                  </div>
                  <div className="vagaInfo">
                    <h3>{selectedVacancy.jobLocation?.city} - {selectedVacancy.jobLocation?.state}</h3>
                    <p><span>Faixa salarial:</span> {selectedVacancy.salary ? `${selectedVacancy.salary}` : 'A definir'}</p>
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
                        {selectedVacancy.requiredQualifications.map((qualification, index) => {
                          <li key={index}>- {qualification}</li>
                        })}
                      </ul>
                    </div>
                    <div className='containerVagaCard'>
                      <h4>Habilidades requisitadas</h4>
                      <span> {selectedVacancy.desiredSkills} </span>
                    </div>
                  </div>
                  <div className='buttonsVagaCard'>
                    <button className='buttonDenuncia'>
                      Denunciar
                    </button>
                    <button className='buttonEnviarCV' onClick={() => toggleInterested(selectedVacancy)}>
                      {isInterested(selectedVacancy._id) ? 'Remover Candidatura' : 'Enviar Currículo'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {modalOpen && (
          <>
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="apply-modal-content">
              <div className='apply-modal-header'>
                <h2>Selecione as Vagas</h2>
              </div>
              <div className="apply-vacancy-cards">
                {favorites
                  .filter((vaga) => !isInterested(vaga._id))
                  .map((vaga) => (
                    <div
                      key={vaga._id}
                      className={`apply-vacancy-card ${selectedVacancies.includes(vaga._id) ? 'apply-selected' : ''}`}
                      onClick={() => toggleVacancySelection(vaga._id)}
                    >
                      <h4 style={{ fontSize: '1.2vw' }}>{vaga.jobTitle}</h4>
                      <p style={{ fontSize: '1vw' }}>{vaga.companyId?.companyName || 'Empresa não encontrada'}</p>
                    </div>
                  ))}

              </div>

              <div className='buttonCardEnviar'>
                <button
                  onClick={handleSubmitApplications}
                  className="apply-submit-button"
                  disabled={isSubmitting} // Desativa o botão enquanto está submetendo
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar currículos'}
                </button>
              </div>

            </div>
          </>
        )}
      </main>
    </>
  );
}

export default VagasFavoritas;