import React, { useEffect, useState } from 'react';
import BoxVagaFavorita from "../BoxVagaFavorita/BoxVagaFavorita";
import BoxVagaRecomendada from "../BoxVagaRecomendada/BoxVagaRecomendada";
import { toast } from 'sonner';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile"
import CandidateName from "../CandidateName/CandidateName";
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { useInterested } from '../../../../Context/InterestedContext';
import InputMask from 'react-input-mask';

import './Candidato.css';

function Candidato() {
  const languageOptions = ['Africâner', 'Albanês', 'Alemão', 'Amárico', 'Árabe', 'Armênio', 'Azeri', 'Basco', 'Bengali', 'Bielorrusso', 'Birmanês', 'Bósnio', 'Búlgaro', 'Cazaque', 'Cebuano', 'Chinês', 'Cingalês', 'Coreano', 'Croata', 'Dinamarquês', 'Eslovaco', 'Esloveno', 'Espanhol', 'Esperanto', 'Estoniano', 'Finlandês', 'Francês', 'Gaélico Escocês', 'Galês', 'Georgiano', 'Grego', 'Guzerate', 'Haitiano', 'Hebraico', 'Híndi', 'Holandês', 'Húngaro', 'Indonésio', 'Inglês', 'Islandês', 'Italiano', 'Japonês', 'Javanês', 'Khmer', 'Kinyarwanda', 'Kirguiz', 'Laosiano', 'Letão', 'Lituano', 'Luxemburguês', 'Macedônio', 'Malaio', 'Malgaxe', 'Maltês', 'Maori', 'Marata', 'Mongol', 'Nepalês', 'Norueguês', 'Pachto', 'Persa', 'Polonês', 'Português', 'Punjabi', 'Quirguiz', 'Romeno', 'Russo', 'Sérvio', 'Suaíli', 'Sueco', 'Tadjique', 'Tailandês', 'Tâmil', 'Tcheco', 'Telugu', 'Tibetano', 'Tigrínia', 'Tonga', 'Turco', 'Turcomano', 'Ucraniano', 'Urdu', 'Uzbeque', 'Vietnamita', 'Xhosa', 'Zulu', 'Outro'];

  const [menuOpen, setMenuOpen] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [candidateId, setCandidateId] = useState(null)
  const [favoriteVacancies, setFavoriteVacancies] = useState([]);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(null);
  const [activeAcademicIndex, setActiveAcademicIndex] = useState(null);
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(null);
  const [aboutCandidate, setAboutCandidate] = useState('');
  const [professionalExperience, setProfessionalExperience] = useState([]);
  const [academicBackground, setAcademicBackground] = useState([]);
  const [skillsAndCompetencies, setSkillsAndCompetencies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactLink, setContactLink] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [languageLevel, setLanguageLevel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [jobVacanciesInArea, setJobVacanciesInArea] = useState('');
  const { dailyApplicationsCount, totalCurriculos } = useInterested();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  const areas = [
    'Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia',
    'Marketing', 'Vendas', 'Recursos Humanos', 'Administração',
    'Jurídico', 'Logística', 'Atendimento ao Cliente',
    'Design', 'Operações', 'Construção Civil'
  ];

  const handleButtonClick = () => {
    setIsCardVisible(true);
  };

  const closeModal = () => {
    setIsCardVisible(false);
  }

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleConfirm = () => {
    try {
      setAreaOfInterest(selectedArea);

      axiosInstance.put(`/api/user/candidate/update-candidate/${candidate._id}`, {
        areaOfInterest: selectedArea
      })
      toast.success("Área de atuação atualizada com sucesso!")
      setIsCardVisible(false);

    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao mudar área de atuação!")
    }
    closeModal();
  };

  useEffect(() => {
    if (areaOfInterest) {
      const fetchJobCount = async () => {
        try {
          const response = await axiosInstance.get(`/api/user/company/vacancy/list-vacancies`);

          const vacancies = response.data || [];
          const filteredVacancies = vacancies.filter(vacancy => vacancy.jobArea === areaOfInterest);

          setJobVacanciesInArea(filteredVacancies.length);
        } catch (error) {
          console.error('Error fetching job count:', error);
          toast.error("Erro ao buscar vagas!");
          setJobVacanciesInArea(0);
        }
      };

      fetchJobCount();
    }
  }, [areaOfInterest]);


  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const addLanguage = () => {
    const languageToAdd = selectedLanguage === 'Outro' ? newLanguage : selectedLanguage;
    const updatedLanguages = [...languages, { name: languageToAdd, level: languageLevel }];
    setLanguages(updatedLanguages);
    setNewLanguage(''); setSelectedLanguage(''); setLanguageLevel('');
  };

  const addExperience = () => setProfessionalExperience([...professionalExperience, { role: 'Nova Experiência', company: 'Empresa', startDate: '2001-01-01', endDate: '2002-02-02', mainActivities: 'Atividades Principais' }]);
  const deleteExperience = (index) => setProfessionalExperience(professionalExperience.filter((_, i) => i !== index));

  const addAcademic = () => setAcademicBackground([...academicBackground, { name: 'Nova Formação', institution: 'Universidade', duration: 'Duração', conclusionYear: '2000' }]);
  const deleteAcademic = (index) => setAcademicBackground(academicBackground.filter((_, i) => i !== index));

  const deleteLanguage = (index) => setLanguages(languages.filter((_, i) => i !== index));
  const addSkill = () => setSkillsAndCompetencies([...skillsAndCompetencies, { description: 'Nova Habilidade' }]);
  const deleteSkill = (index) => setSkillsAndCompetencies(skillsAndCompetencies.filter((_, i) => i !== index));

  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    if (cleaned.length < 10) return cleaned;
    const countryCode = cleaned.substring(0, 2);
    const ddd = cleaned.substring(2, 4);
    const number = cleaned.substring(4);
    return `+${countryCode} ${ddd} ${number.replace(/(\d{5})(\d+)/, '$1-$2')}`;
  };

  const handleExperienceToggle = (index) => setActiveExperienceIndex(activeExperienceIndex === index ? null : index);
  const handleAcademicToggle = (index) => setActiveAcademicIndex(activeAcademicIndex === index ? null : index);
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...professionalExperience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProfessionalExperience(updatedExperience);
  };

  const handleQualificationChange = (e, index) => {
    const updatedSkills = [...skillsAndCompetencies];
    updatedSkills[index].description = e.target.value;
    setSkillsAndCompetencies(updatedSkills);
  };

  const handleAcademicChange = (index, field, value) => {
    const updatedAcademic = [...academicBackground];
    updatedAcademic[index] = { ...updatedAcademic[index], [field]: value };
    setAcademicBackground(updatedAcademic);
  };

  const handleLanguageToggle = (index) => setActiveLanguageIndex(activeLanguageIndex === index ? null : index);
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setLanguages(updatedLanguages);
  };

  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.minHeight = 'auto';
    textarea.style.minHeight = `${textarea.scrollHeight}px`;
    textarea.style.mmaxHeight = '200px';
  };

  const updateCandidateInfo = async () => {
    try {
      for (const experience of professionalExperience) {
        const startDate = new Date(experience.startDate);
        const endDate = new Date(experience.endDate);
        if (startDate > endDate) {
          toast.error('A data de início não pode ser depois da data de término!');
          return;
        }
      }
      await setLanguages(languages);
      await axiosInstance.put(`/api/user/candidate/update-candidate/${candidate._id}`, {
        candidateAbout: aboutCandidate,
        candidateExperience: professionalExperience,
        candidateCourses: academicBackground,
        candidateIdioms: languages,
        candidateQualifications: skillsAndCompetencies,
        candidatePhone: contactPhone,
        candidateLink: contactLink,
      });
      toast.success('Currículo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o currículo:', error);
      toast.error('Erro ao atualizar o currículo!');
    }
  };

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/candidate/list-candidate/');
        if (response.data) {
          const candidateData = response.data;
          setCandidate(candidateData);
          setFavoriteVacancies(candidateData.favoriteVacancies || []);
          setAboutCandidate(candidateData.candidateAbout || '');
          setProfessionalExperience(candidateData.candidateExperience || []);
          setAcademicBackground(candidateData.candidateCourses || []);
          setSkillsAndCompetencies(candidateData.candidateQualifications || []);
          setLanguages(candidateData.candidateIdioms || []);
          setContactPhone(candidateData.candidatePhone || '');
          setContactLink(candidateData.candidateLink || '');
          setAreaOfInterest(candidateData.areaOfInterest || '');
          setCandidateId(candidateData._id || "id não encontrado")
        }
      } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
      }
    };

    fetchCandidateData();
  }, []);

  useEffect(() => {
    const textarea = document.getElementById('aboutCandidate');
    if (textarea) autoResizeTextarea({ target: textarea });
  }, [aboutCandidate]);

  const viewCurriculum = async () => {
    try {
      const response = await axiosInstance.get("/api/user/candidate/generate-pdf", {
        responseType: 'blob'
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);

      // Abre o PDF em uma nova aba
      window.open(url, '_blank');

      toast.success("Currículo gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar currículo");
      console.error(error);
    }
  };

  return (
    <>
      {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
      {windowWidth < 450 && <MenuMobile />}
      <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className="cabecalhoCandidato">
          <div>
            <CandidateName />
            <button className='baixar-curriculo' onClick={viewCurriculum}>Baixar Curriculo</button>
          </div>
        </section>

        <section className='baixar-curriculo-mobile'>
          <div className='baixar-curriculo-mobile-content'>
            <h2>{areaOfInterest}</h2>
            <button className='baixar-curriculo' onClick={viewCurriculum}>Baixar Curriculo</button>
          </div>
        </section>

        <section className="candidateArea">
          <aside className='candidateDashboard'>
            <div className='div-area' id='dashboardAreaC'>
              <div className='dashboardAreaCTittle'>
                <button
                  onClick={handleButtonClick}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <h2>{areaOfInterest}</h2>
                <h2>{jobVacanciesInArea}</h2>
              </div>
              <p>Altere sua área ao clicar no ícone</p>
            </div>
            <div id='dashboardSent'>
              <div className='dashboardAreaCTittle'>
                <h2>Currículos Enviados</h2>
                <Link to='/curriculos-enviados' style={{ transform: 'rotate(-45deg)' }}><i className="fa-solid fa-arrow-right"></i></Link>
              </div>
              <h1>{totalCurriculos}</h1>
              <p>Envie mais currículos para alcançar seus objetivos</p>
            </div>
            <div className='div-limite' id='dashboardLimitC'>
              <div className='dashboardAreaCTittle'>
                <h2 style={{ color: 'white' }}>Currículos por dia</h2>
                <Link to='/vagas-favoritas' style={{ transform: 'rotate(45deg)', color: 'white' }}><i className="fa-solid fa-arrow-right"></i></Link>
              </div>
              <h1><span style={{ color: "#FFF600" }}>{dailyApplicationsCount}</span> / 10</h1>
              <p>O limite ampara spam</p>
            </div>
          </aside>

          {isCardVisible && (
            <>
              <div className='modal-overlay'>
                <div className="modal-carda">
                  <div className='modal-carda-close'>
                    <button onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
                  </div>

                  <h3>Escolha sua área de atuação:</h3>
                  <div className="areas-container">
                    {areas.map((area) => (
                      <button key={area} onClick={() => handleAreaSelect(area)} className={selectedArea === area ? 'botao-selecionado' : 'botao-normal'}   >
                        {area}
                      </button>
                    ))}
                  </div>
                  <button className='confirm-button' onClick={handleConfirm}>Confirmar</button>
                </div>
              </div>
            </>
          )}



          <div className='virtualCV'>
            <div className='virtualCVHeader'>
              <h1>Currículo Virtual</h1>
            </div>
            <div className="virtualCVInfo">
              <div className="CVInfo">
                {/* Campo Sobre Mim */}
                <div>
                  <h2>Sobre Mim <p>*</p></h2>
                  <textarea
                    value={aboutCandidate}
                    id="aboutCandidate"
                    onInput={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= 400) {
                        autoResizeTextarea(e);
                        setAboutCandidate(newValue);
                      } else {
                        setAboutCandidate(newValue.substring(0, 400));
                      }
                    }}
                    maxLength={400}

                  />
                </div>

                {/* Experiência Profissional */}
                <div>
                  <h2>Experiência Profissional <p>*</p></h2>
                  {professionalExperience.map((experience, index) => (
                    <div key={index}>
                      <button className='experiencia' onClick={() => handleExperienceToggle(index)}>
                        {experience.role}
                      </button>
                      {activeExperienceIndex === index && (
                        <div className='expandido'>
                          <h3>Informações</h3>
                          <div>
                            <h5>Cargo / Função</h5>
                            <input
                              type="text"
                              value={experience.role}
                              placeholder="Cargo"
                              onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                            />
                          </div>
                          <div>
                            <h5>Empresa</h5>
                            <input
                              type="text"
                              value={experience.company}
                              placeholder="Empresa"
                              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            />
                          </div>
                          <div>
                            <h5>Data de Início</h5>
                            <input
                              type="date"
                              value={experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const newStartDate = e.target.value;
                                if (
                                  new Date(newStartDate) <= new Date() &&
                                  (!experience.endDate || new Date(newStartDate) <= new Date(experience.endDate))
                                ) {
                                  handleExperienceChange(index, 'startDate', newStartDate);
                                } else {
                                  toast.error('Data de início inválida. Deve ser no passado e anterior à data de término.');
                                }
                              }}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <h5>Data de Término</h5>
                            <input
                              type="date"
                              value={experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const newEndDate = e.target.value;
                                if (
                                  new Date(newEndDate) <= new Date() &&
                                  (!experience.startDate || new Date(newEndDate) >= new Date(experience.startDate))
                                ) {
                                  handleExperienceChange(index, 'endDate', newEndDate);
                                } else {
                                  toast.error('Data de término inválida. Deve ser no passado e posterior à data de início.');
                                }
                              }}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <h5>Principais Atividades</h5>
                            <textarea
                              value={experience.mainActivities}
                              placeholder="Principais atividades"
                              onChange={(e) => handleExperienceChange(index, 'mainActivities', e.target.value)}
                            />
                          </div>
                          <button onClick={() => deleteExperience(index)}>Excluir</button> {/* Botão de exclusão */}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className='addItem'><button onClick={addExperience}><p>+</p></button></div>
                </div>


                {/* Formação Acadêmica */}
                <div>
                  <h2>Formação Acadêmica <p>*</p></h2>
                  {academicBackground.map((course, index) => (
                    <div key={index}>
                      <button onClick={() => handleAcademicToggle(index)}>
                        {course.name}
                      </button>
                      {activeAcademicIndex === index && (
                        <div className='expandido'>
                          <h3>Informações</h3>
                          <div>
                            <h5>Nome</h5>
                            <input
                              type="text"
                              value={course.name}
                              placeholder="Nome"
                              onChange={(e) => handleAcademicChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <h5>Instituição</h5>
                            <input
                              type="text"
                              value={course.institution}
                              placeholder="Instituição"
                              onChange={(e) => handleAcademicChange(index, 'institution', e.target.value)}
                            />
                          </div>
                          <div>
                            <h5>Duração</h5>
                            <input
                              type="text"
                              value={course.duration}
                              placeholder="Duração"
                              onChange={(e) => handleAcademicChange(index, 'duration', e.target.value)}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <h5>Ano de Conclusão</h5>
                            <input
                              type="number"
                              value={course.conclusionYear}
                              placeholder="Ano de Conclusão"
                              onChange={(e) => handleAcademicChange(index, 'conclusionYear', e.target.value)}
                              max={new Date().getFullYear()} // Ano atual
                              min={1} // Ano mínimo válido
                            />

                          </div>

                          <button onClick={() => deleteAcademic(index)}>EXCLUIR</button>

                        </div>
                      )}
                    </div>
                  ))}

                  <div className='addItem'><button onClick={addAcademic}><p>+</p></button></div>
                </div>

                {/* Idiomas */}
                <div>
                  <h2>Idiomas <p>*</p></h2>
                  {languages.map((language, index) => (
                    <div key={index}>
                      <button onClick={() => handleLanguageToggle(index)}>
                        {language.name} - {language.level}
                      </button>
                      {activeLanguageIndex === index && (
                        <div className='expandido'>
                          <h3>Informações</h3>
                          <div>
                            <h5>Idioma</h5>
                            <select
                              value={language.name}
                              onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                            >
                              {languageOptions.map((option, i) => (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            {selectedLanguage === 'Outro' && (
                              <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                placeholder="Digite o nome do idioma"
                              />
                            )}
                          </div>
                          <div>
                            <h5>Nível</h5>
                            <select
                              value={language.level}
                              onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                            >
                              <option value="">Selecione um nivel</option>
                              <option value="Basico">Basico</option>
                              <option value="Intermediario">Intermediario</option>
                              <option value="Avancado">Avancado</option>
                              <option value="Fluente">Fluente</option>
                            </select>
                          </div>
                          <button onClick={() => deleteLanguage(index)}>EXCLUIR</button>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className='addItem'>
                    <button onClick={addLanguage}>
                      <p>+</p>
                    </button>
                  </div>
                </div>

                {/* Habilidades e Competências */}
                <div>
                  <h2>Habilidades e Competências <p>*</p></h2>
                  {skillsAndCompetencies.map((qualification, index) => (
                    <div key={index}>
                      <div className='skillCompetencies'>
                        <input
                          type="text"
                          value={qualification.description}
                          onChange={(e) => handleQualificationChange(e, index)}
                          placeholder="Descrição"
                        />
                        <button className='deleteItem' onClick={() => deleteSkill(index)}>-</button>
                      </div>
                    </div>
                  ))}
                  <div className='addItem'><button onClick={addSkill}><p>+</p></button></div>
                </div>

                {/* Contato */}
                <div className='contato'>
                  <h2>Contato <p>*</p></h2>
                  <InputMask
                    type="text"
                    id="contactPhone"
                    mask="(99) 99999-9999"
                    placeholder="(11) 99999-9999"
                    onChange={(e) => {
                      const formattedPhone = formatPhoneNumber(e.target.value);
                      setContactPhone(formattedPhone);
                    }}
                    value={contactPhone}
                    name="telephone"
                  />
                  <input
                    type="text"
                    value={contactLink}
                    id="contactLink"
                    onChange={(e) => setContactLink(e.target.value)}
                    placeholder="Linkedin"
                  />
                </div>

                {/* Botão para Salvar Alterações */}
                <button onClick={updateCandidateInfo}>Salvar Alterações</button>
              </div>

            </div>
          </div>

        </section>

        <div className='dashboard-candidato-mobile'>

          <div className='dashboard-mobile-button'>

            <div className='dashboard-mobile-content'>
              <button
                onClick={handleButtonClick}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <p>Sua área</p>
            </div>

            <div style={{ borderLeft: "solid 2px #FFF600", borderRight: "solid 2px #FFF600" }} className='dashboard-mobile-content'>

              <Link to='/curriculos-enviados'><i className="fa-solid fa-address-card"></i></Link>

              <p>Curriculos enviados</p>
            </div>

            <div className='dashboard-mobile-content'>
              <Link className='curriculo-dia-mobile' to='/vagas-favoritas'><span style={{ color: "#FFF600" }}>{dailyApplicationsCount}</span> / 10</Link>
              <p>Curriculos por dia</p>
            </div>

          </div>

        </div>

        {/* Seção de Vagas Favoritas */}
        <div className="content-vagas">
          <div className="content-titulo">
            <h2>Vagas favoritas</h2>
            <Link to="/vagas-favoritas">Ver mais</Link>
          </div>
          <div className="container-vagas">
            <BoxVagaFavorita />
          </div>
        </div>

        {/* Seção de Vagas Recomendadas */}
        <div className="content-vagas recomendadas">
          <div className="content-titulo">
            <h2>Vagas recomendadas</h2>
            <Link to="/listar-vagas">Ver mais</Link>
          </div>
          <div className="container-vagas">
            <BoxVagaRecomendada />
          </div>
        </div>
      </main>
    </>
  );
}

export default Candidato;