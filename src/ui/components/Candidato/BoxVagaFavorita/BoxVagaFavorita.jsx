import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../../Context/FavoritesContext'; // Gerenciamento de favoritos via contexto
import { useInterested } from '../../../../Context/InterestedContext'; // Gerenciamento de interessados via contexto
import axiosInstance from '../../../../source/axiosInstance';
import { toast } from 'sonner';
import '../BoxVaga/BoxVaga.css';

export function BoxVagaFavorita() {
  const { favorites, removeFavorite } = useFavorites(); // Usar o contexto de favoritos
  const { isInterested, addInterested, removeInterested } = useInterested(); // Usar o contexto de interessados
  const [selectedVacancy, setSelectedVacancy] = useState(null); // Estado para a vaga selecionada
  const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do carrossel
  const [isCardOpen, setIsCardOpen] = useState(false); // Estado do card de denúncia
  const [motivo, setMotivo] = useState(''); // Motivo da denúncia
  const [descricao, setDescricao] = useState(''); // Descrição da denúncia
  const [itemsPerPage, setItemsPerPage] = useState(3); // Estado para controlar a quantidade de itens exibidos no carrossel
  const cardRef = useRef(null);
  const denunciaCardRef = useRef(null);
  const modalRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Função para remover dos favoritos
  const handleRemoveFavorite = async (vaga) => {
    await removeFavorite(vaga._id); // Chamando a função do contexto
  };

  // Função para abrir o modal com detalhes da vaga
  const handleBoxClick = (vaga, event) => {
    event.preventDefault();
    setSelectedVacancy(vaga);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setSelectedVacancy(null);
    document.body.classList.remove('no-scroll');
  };

  // Detecta a largura da tela e ajusta o número de itens por vez
  const updateItemsPerPage = () => {
    if (window.innerWidth <= 450) {
      setItemsPerPage(2); // Para telas menores ou iguais a 450px, exibe 2 itens
    } else {
      setItemsPerPage(3); // Para telas maiores que 450px, exibe 3 itens
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    // Função para detectar cliques fora do modal
    const handleClickOutside = (event) => {
      // Verificar se as referências são válidas
      if (modalRef.current && denunciaCardRef.current) {
        if (!modalRef.current.contains(event.target) && !denunciaCardRef.current.contains(event.target)) {
          closeModal(); // Fecha o modal se o clique for fora
        }
      }
    };

    // Adiciona o evento de clique fora do modal
    window.addEventListener('mousedown', handleClickOutside);

    // Limpa o evento ao desmontar o componente
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para alternar a exibição do card de denúncia
  const handleDenunciaButtonClick = () => {
    setIsCardOpen((prevState) => !prevState);
  };

  // Funções para atualizar os campos de motivo e descrição da denúncia
  const handleMotivoChange = (event) => setMotivo(event.target.value);
  const handleDescricaoChange = (event) => setDescricao(event.target.value);

  // Função para enviar a denúncia
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

  // Função para navegar para a próxima vaga
  const nextVacancy = () => {
    if (currentIndex < Math.min(favorites.length - itemsPerPage, 5)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Função para voltar para a vaga anterior
  const prevVacancy = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Função para alternar entre se candidatar ou remover a candidatura
  const toggleInterested = async (vaga) => {
    if (isInterested(vaga._id)) {
      await removeInterested(vaga._id);
    } else {
      await addInterested(vaga);
    }
  };

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
      <div className="container-box-vagas">
        {favorites.length === 0 ? (
          <p className="no-vacancies-message">Você não tem nenhuma vaga favorita no momento.</p>
        ) : (
          <div className="carousel-container">
            {favorites.length > itemsPerPage && (
              <button
                className={`carousel-button button-Cleft stretched-button`}
                onClick={prevVacancy}
                disabled={currentIndex === 0}
              >
                <i className="fa-solid fa-caret-up"></i>
              </button>
            )}

            <div className="carousel">
              {favorites.slice(currentIndex, currentIndex + itemsPerPage).map((vaga, index) => (
                <div
                  key={vaga._id}
                  className={`box-vaga ${index === 2 ? 'boxVagaBlur' : ''}`}
                  onClick={(event) => handleBoxClick(vaga, event)}
                >
                  <div className="info-box-vaga">
                    <div className="header-box-vaga">
                      <div className="nome-vaga">
                        {windowWidth < 450 ? truncateText(vaga.jobTitle, 14) : truncateText(vaga.jobTitle, 30)}
                        <Link>{windowWidth < 450
                          ? (vaga.companyId?.companyName ? truncateText(vaga.companyId.companyName, 20) : 'Empresa não encontrada')
                          : (vaga.companyId?.companyName || 'Empresa não encontrada')}
                        </Link>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(vaga);
                        }}
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                    </div>
                    <div className="vaga-info">
                      <h3>{vaga.salary ? `${vaga.salary}` : 'A definir'}</h3>
                      <p>{vaga.jobDescription.slice(0, 100)}...</p>
                    </div>
                  </div>
                  <div className="area-vaga">
                    <Link to="#">{vaga.jobArea}</Link>
                  </div>
                </div>
              ))}
            </div>

            {favorites.length > itemsPerPage && (
              <button
                className={`carousel-button button-Cright stretched-button`}
                onClick={nextVacancy}
                disabled={currentIndex >= Math.min(favorites.length - itemsPerPage, 5)}
              >
                <i className="fa-solid fa-caret-up"></i>
              </button>
            )}
          </div>
        )}

      </div>

      {selectedVacancy && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="vaga-cardInfo" ref={modalRef}>
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
                <button className='buttonDenuncia' onClick={handleDenunciaButtonClick}>Denúnciar</button>
                <button className='buttonEnviarCV' onClick={() => toggleInterested(selectedVacancy)}>
                  <p>{isInterested(selectedVacancy._id) ? 'Remover Candidatura' : 'Enviar Currículo'}</p>
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

export default BoxVagaFavorita;
