import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';
import { useFavorites } from '../../../../Context/FavoritesContext'; // Importando o hook corretamente
import { useInterested } from '../../../../Context/InterestedContext';
import { toast } from 'sonner';
import './PreVisualizacao.css';


export default function PrevisualizacaoE() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Usando o hook `useFavorites` para acessar o contexto de favoritos
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites() || {};
  const { isInterested, addInterested, removeInterested } = useInterested() || {};

  const cardRef = useRef(null);
  const denunciaCardRef = useRef(null);

  const fetchCompany = async () => {
    try {
      const response = await axiosInstance.get(`api/user/company/list-company/${id}`);
      if (response.data) {
        setCompany(response.data);
        console.log("Empresa carregada:", response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar a empresa:', error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchCompany();
    fetchJobVacancies();
  }, [id]);

  const fetchJobVacancies = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/company-vacancies/${id}`);
      setJobVacancies(response.data);
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!company) {
    return <div>Empresa não encontrada.</div>;
  }

  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  /* Fução de formatar descrição da vaga */

  function truncateDescription(description) {
    const maxLength = 30;
    if (!description) return '';
    return description.length > maxLength
      ? description.slice(0, maxLength) + '...'
      : description;
  }

  const openCompanyModal = () => setIsCompanyModalOpen(true);
  const closeCompanyModal = () => setIsCompanyModalOpen(false);

  const handleSubmitCompanyReport = async () => {
    if (!motivo || !descricao) {
      toast.error("Por favor, preencha todos os campos da denúncia.");
      return;
    }

    try {
      const payload = {
        type: "company",
        targetId: company._id,
        reportReason: motivo,
        description: descricao,
      };

      const response = await axiosInstance.post('/api/report/create-report', payload);

      setMotivo('');
      setDescricao('');
      closeCompanyModal();
      toast.success(response.data.message || "Denúncia enviada com sucesso!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao enviar denúncia.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <header>
        <div className='headerPreVisualizacao'>
          <div className='iconVoltar' onClick={() => navigate(-1)}>
            <i style={{ color: 'black' }} className="fa-solid fa-chevron-left"></i>
          </div>
          <div className='infoPreVisualizacao'>
            <h3>{company.companyName || "Não informado"}</h3>
            <h5>{company.branchOfActivity || "Não informado"}</h5>
          </div>
        </div>
      </header>
      <section className='sectionPreVisualizacaoE'>
        <div className='dadosEmpresaPreVisualizacao'>
          <h3>Dados da Empresa</h3>
          <div className='infoDadosEmpresa'>
            <h5>{company.telephone || "Não informado"}</h5>
            <h5>{company.type || "Não informado"}</h5>
          </div>
          <div className='infoDadosEmpresa'>
            <h5>12.345.678/0003-00</h5>
            <h5>
              {company.address?.publicPlace || "Não informado"} {company.address?.number || "S/N"},
              {company.address?.city || "Não informado"} - {company.address?.state || "Não informado"}
            </h5>
          </div>
          <div className='infoDadosEmpresa'>
            <Link to={company.site || "#"} target="_blank">{company.site || "Não informado"}</Link>
            <h5>Número de Empregados: {company.employeerNumber || "Não informado"}</h5>
          </div>
        </div>

        <div className='EmpresaPreVisualizacao'>
          <div className='descricaoEmpresaPreVisualizacao'>
            <h3>{company.companyName || "Não informado"}</h3>
            <p>{company.description || "Não informado"}</p>
          </div>
          <img src="https://fastly.picsum.photos/id/448/300/200.jpg?hmac=WHgZcNfmMcA8Sl33YH3lirNV6pSOFPOrxigNhp-lNzc" alt="Company Preview" />
        </div>
        <hr />
        <button className='buttonDenuncia' onClick={openCompanyModal}>
          Denunciar Empresa
        </button>

        {isCompanyModalOpen && (
          <>
            <div id="modal-overlay" onClick={closeCompanyModal}></div>  {/* Overlay com ID */}
            <div id="denunciaCard" ref={denunciaCardRef}>  {/* Modal com ID */}
              <h3>Denunciar Empresa</h3>
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
                <textarea
                  value={descricao}
                  onChange={handleDescricaoChange}
                  placeholder="Descreva o motivo da denúncia"
                ></textarea>
              </label>
              <div className="denunciaActions">
                <button onClick={closeCompanyModal}>Cancelar</button>
                <button onClick={handleSubmitCompanyReport}>Enviar Denúncia</button>
              </div>
            </div>
          </>
        )}

      </section>

      <section className='boxVagasPreVisualizacao'>
        <h3>Todas as Vagas de {company.companyName || "Não informado"}</h3>
        <div className="container-box-vagas containerBoxVagasPV">
          {jobVacancies.length === 0 ? (
            <p className="no-vacancies-message">Nenhuma vaga cadastrada no momento.</p>
          ) : (
            jobVacancies.map((vaga) => (
              <div key={vaga._id} className="box-vaga" onClick={() => setSelectedVacancy(vaga)}>
                <div className="info-box-vaga">
                  <div className="header-box-vaga">
                    <div className="nome-vaga">
                      <h2>{truncateText(vaga.jobTitle || "Não informado", 20)}</h2>
                      <Link>{company.companyName || 'Empresa não encontrada'}</Link>
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
                    <p>{truncateDescription(vaga.jobDescription || "Não informado")}</p>
                    <p>{company.email}</p>
                  </div>
                </div>
                <div className="area-vaga">
                  <Link to="#">{vaga.jobArea || "Não informado"}</Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className='buttonPreVisualizacao'>
          <button>Carregar Mais</button>
        </div>
      </section>

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
                      <li key={index}>- {qualification}</li>
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
