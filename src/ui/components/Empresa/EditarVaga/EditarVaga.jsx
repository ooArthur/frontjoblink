import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';
import './EditarVaga.css';
import { toast } from 'sonner';

export default function EditarVaga() {
  const [candidates, setCandidates] = useState([]);
  const [jobVacancy, setJobVacancy] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [comments, setComments] = useState(null);
  const [salaryValue, setSalaryValue] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('');
  const [applicationStatusCount, setApplicationStatusCount] = useState({
    approved: 0,
    inReview: 0,
    dismissed: 0
  });

  useEffect(() => {
    setStatuses(candidates.reduce((acc, candidate) => {
      acc[candidate._id] = 'normal';
      return acc;
    }, {}));
  }, [candidates]);


  const [vagaData, setVagaData] = useState({
    jobTitle: '',
    jobDescription: '',
    salary: '',
    jobLocation: { city: '', state: '' },
    workSchedule: { workingHours: '', workingDays: [] },
    requiredQualifications: [],
    desiredSkills: [],
    employmentType: '',
    jobArea: ''
  });
  const { id } = useParams();

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fetchJobVacancy = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/list-vacancy/${id}`);
      setJobVacancy(response.data);
      setVagaData(response.data); // Inicializa o estado do formulário com os dados da vaga
    } catch (error) {
      console.error('Erro ao buscar a vaga:', error);
    }
  };

  const fetchStatsCount = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/${id}/status-count`);

      if (response.status === 200) {
        const statusData = response.data;

        // Mapeia os dados de status retornados para os valores esperados
        const statusCounts = {
          approved: 0,
          inReview: 0,
          dismissed: 0
        };

        statusData.forEach(({ status, count }) => {
          if (status === 'Aprovado') {
            statusCounts.approved = count;
          } else if (status === 'Em Análise') {
            statusCounts.inReview = count;
          } else if (status === 'Dispensado') {
            statusCounts.dismissed = count;
          }
        });

        setApplicationStatusCount(statusCounts);
      }
    } catch (error) {
      console.error('Erro ao buscar status das candidaturas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVagaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setVagaData(prevState => ({
      ...prevState,
      jobLocation: { ...prevState.jobLocation, [name]: value }
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setVagaData(prevState => ({
      ...prevState,
      workSchedule: { ...prevState.workSchedule, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedSalary = `${salaryCurrency || 'R$'} ${salaryValue}`;
    try {
      const response = await axiosInstance.put(`/api/user/company/vacancy/update-vacancy/${id}`, {
        ...vagaData,
        salary: combinedSalary
      })

      toast.success("Sua vaga foi atualizada com sucesso!");
      setModalVisible(false);
      fetchJobVacancy()
    } catch (error) {
      console.error('Erro ao atualizar a vaga:', error);
      toast.error("Erro ao atualizar vaga.");
    }
  };

  const calcularDiasRestantes = () => {
    if (!jobVacancy.applicationDeadline) return null;

    const deadlineDate = new Date(jobVacancy.applicationDeadline);
    const diffTime = deadlineDate - dataAtual;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // Retorna 0 se o prazo já passou
  };

  const diasRestantes = calcularDiasRestantes();

  const corTextoDiasRestantes = () => {
    if (diasRestantes < 10) return 'red';
    if (diasRestantes < 30) return 'yellow';
    return 'white';
  };

  const navigate = useNavigate();

  const handleDelete = async () => {

    if (window.confirm("Tem certeza que deseja excluir esta vaga?")) {
      try {
        await axiosInstance.delete(`/api/user/company/vacancy/delete-vacancy/${id}`);
        toast.success("Vaga excluída com sucesso!");
        navigate('/area-empresa'); // Redireciona após a exclusão
      } catch (error) {
        console.error('Erro ao excluir a vaga:', error);
        toast.error("Erro ao excluir vaga.");
      }
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/list-interested/${id}`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
    }
  };

  // Chame a função fetchCandidates após a vaga ser carregada
  useEffect(() => {
    fetchJobVacancy();
    fetchCandidates(); // Adicione esta linha
    fetchStatsCount()
  }, [id]);

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

  const [statuses, setStatuses] = useState(
    candidates.reduce((acc, candidato) => {
      acc[candidato._id] = 'normal'; // Status inicial
      return acc;
    }, {})
  );

  const fetchCandidateDetails = async (candidateId) => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/candidate-details/${id}/${candidateId}`);
      if (response.status === 200) {
        setSelectedCandidate(response.data.candidate);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do candidato:', error);
      toast.error('Erro ao carregar detalhes do candidato.');
    }
  };

  const handleStatusChange = async (candidateId, newStatus, comments) => {
    try {
      const payload = { candidateId, jobVacancyId: id, status: newStatus, comments };
      const response = await axiosInstance.post('/api/user/company/vacancy/vacancy-status/update', payload);

      if (response.status === 200) {
        toast.success(`Status atualizado para ${newStatus}.`);
        await fetchStatsCount();
        setCandidateModalVisible(false); // Fecha o modal após a atualização
      } else {
        toast.error('Erro ao atualizar o status.');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar o status.');
    }
  };


  return (
    <>
      <div className='header-editar-vaga'>
        <div className='content-header-editar-vaga'>
          <Link className='voltar' to='/area-empresa'> <i className="fa-solid fa-chevron-left"></i> </Link>
          <div className='empresa-data'>
            <h1>{jobVacancy.companyId?.companyName}</h1>
            <p style={{ color: "#c3c3c3" }}>{dataFormatada}</p>
          </div>
        </div>
      </div>

      <div className='vaga-titulo'>
        <div className='content-vaga-titulo'>
          <div className='vaga-titulo-nome'>
            <h1>{jobVacancy.jobTitle}</h1>
            <p>{jobVacancy.jobArea}</p>
          </div>
          <div className='buttons-vaga-titulo'>
            <button
              className="button-edit"
              onClick={() => setEditModalVisible(true)}
            >
              Editar vaga
            </button>

            <button className='button-delet' onClick={handleDelete}>
              Excluir vaga
            </button>
          </div>

        </div>
      </div>

      <section className='dados-vaga'>
        <div className='container-dados-vaga'>
          <div className='content-dados-vaga'>
            <div className='principal-dados-vaga'>
              <div className='local-dados-vaga'>
                <h1>Salário: {jobVacancy.salary}</h1>
              </div>
              <div className='tempo-dados-vaga'>
                <h1>Temporário</h1>
                <h1 style={{ color: corTextoDiasRestantes() }}>
                  {diasRestantes} dias <i className="fa-regular fa-clock"></i>
                </h1>
              </div>
            </div>
            <div className='description-dados-vaga'>
              <p>{jobVacancy.jobDescription}</p>
            </div>
            <div className='description-dados-vaga'>
              <p style={{ fontWeight: 700 }}>
                Expediente:
              </p>
              <ul className='mapItens'>
                {(jobVacancy.workSchedule?.workingDays || []).map((day, index) => (
                  <li key={index}>- {day}</li>
                ))}
              </ul>
              <p>Horário: {jobVacancy.workSchedule?.workingHours}</p>

            </div>
            <div className='list-dados-vaga'>
              <h1>Qualificações necessárias</h1>
              <ul className='mapItens'>
                {(jobVacancy.requiredQualifications && jobVacancy.requiredQualifications.length > 0) ? (
                  jobVacancy.requiredQualifications.map((qualification, index) => (
                    <li key={index}>- {qualification}</li>
                  ))
                ) : (
                  <li>- Não informado</li>
                )}
              </ul>
            </div>
            <div className='list-dados-vaga'>
              <h1>Habilidades requisitadas</h1>
              <ul className='mapItens'>
                {(jobVacancy.desiredSkills && jobVacancy.desiredSkills.length > 0) ? (
                  jobVacancy.desiredSkills.map((skill, index) => (
                    <li key={index}>- {skill}</li>
                  ))
                ) : (
                  <li>- Não informado</li>
                )}
              </ul>
            </div>
          </div>
          <div className='balanco-dados-vaga'>
            <h1>Balanço Geral</h1>
            <div className='box-balanco-dados-vaga'>
              <div className='analise-dados-vaga'>
                <p>Análise das candidaturas</p>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <div className='analise-numeros-dados-vaga'>
                <div style={{ background: 'white', color: '#c3c3c3' }} className='box-analise-dados-vaga'>
                  <p>Aprovados</p>
                  <h1>{applicationStatusCount.approved}</h1>
                </div>
                <div style={{ background: '#ACA721' }} className='box-analise-dados-vaga'>
                  <p>Análise</p>
                  <h1>{applicationStatusCount.inReview}</h1>
                </div>
                <div style={{ background: '#720D0D' }} className='box-analise-dados-vaga'>
                  <p>Dispensados</p>
                  <h1>{applicationStatusCount.dismissed}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {editModalVisible && (
        <div className="modal-overlay">
          <div className="create-vaga-modal">
            <div className="create-vaga-card">
              <div className="modal-header">
                <h2>Editar Vaga</h2>
                <button onClick={() => setEditModalVisible(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form className='form-criar-vaga' onSubmit={handleSubmit}>
                <div className='container-inputs-vagas'>
                  <h4>Título da Vaga:</h4>
                  <input
                    type="text"
                    name="jobTitle"
                    value={vagaData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="Digite o título da vaga"
                  />

                  <h4>Descrição da Vaga:</h4>
                  <input
                    type="text"
                    name="jobDescription"
                    value={vagaData.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Digite a descrição da vaga"
                  />

                  <h4>Salário:</h4>
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
                  <input
                    type="number"
                    value={salaryValue}
                    onChange={(e) => setSalaryValue(e.target.value)}
                    placeholder="Digite o valor"
                  />
                  <h4>Cidade:</h4>
                  <input
                    type="text"
                    name="city"
                    value={vagaData.jobLocation.city}
                    onChange={handleLocationChange}
                    placeholder="Digite a cidade"
                  />

                  <h4>Estado:</h4>
                  <input
                    type="text"
                    name="state"
                    value={vagaData.jobLocation.state}
                    onChange={handleLocationChange}
                    placeholder="Digite o estado"
                  />

                  <h4>Carga Horária:</h4>
                  <input
                    type="text"
                    name="workingHours"
                    value={vagaData.workSchedule.workingHours}
                    onChange={handleScheduleChange}
                    placeholder="Digite a carga horária"
                  />

                  <h4>Dias da Semana:</h4>
                  <div className="day-selector">
                    {/* Mapeamento para dias da semana, caso necessário */}
                  </div>

                  <h4>Qualificações Necessárias:</h4>
{vagaData.requiredQualifications.map((qualification, index) => (
  <div key={index} className="qualification-input">
    <input
      type="text"
      value={qualification}
      onChange={(e) => {
        const updatedQualifications = [...vagaData.requiredQualifications];
        updatedQualifications[index] = e.target.value;
        setVagaData({ ...vagaData, requiredQualifications: updatedQualifications });
      }}
      placeholder="Adicionar qualificação"
    />
    {/* Botão para remover a qualificação */}
    <button
      type="button"
      onClick={() => {
        const updatedQualifications = vagaData.requiredQualifications.filter((_, i) => i !== index);
        setVagaData({ ...vagaData, requiredQualifications: updatedQualifications });
      }}
    >
      Remover
    </button>
  </div>
))}

{/* Botão para adicionar uma nova qualificação */}
<button
  type="button"
  onClick={() => {
    setVagaData({
      ...vagaData,
      requiredQualifications: [...vagaData.requiredQualifications, '']
    });
  }}
>
  Adicionar Qualificação
</button>

<h4>Habilidades Desejadas:</h4>
{vagaData.desiredSkills.map((skill, index) => (
  <div key={index} className="skill-input">
    <input
      type="text"
      value={skill}
      onChange={(e) => {
        const updatedSkills = [...vagaData.desiredSkills];
        updatedSkills[index] = e.target.value;
        setVagaData({ ...vagaData, desiredSkills: updatedSkills });
      }}
      placeholder="Adicionar habilidade"
    />
    {/* Botão para remover a habilidade */}
    <button
      type="button"
      onClick={() => {
        const updatedSkills = vagaData.desiredSkills.filter((_, i) => i !== index);
        setVagaData({ ...vagaData, desiredSkills: updatedSkills });
      }}
    >
      Remover
    </button>
  </div>
))}
                  <h4>Tipo de Emprego:</h4>
                  <select
                    name="employmentType"
                    value={vagaData.employmentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o tipo de emprego</option>
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Jovem Aprendiz">Jovem Aprendiz</option>
                    <option value="Estágio">Estágio</option>
                  </select>

                  <h4>Área da Vaga:</h4>
                  <select
                    name="jobArea"
                    value={vagaData.jobArea}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione a área da vaga</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Finanças">Finanças</option>
                    <option value="Engenharia">Engenharia</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Administração">Administração</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Logística">Logística</option>
                    <option value="Atendimento ao Cliente">Atendimento ao Cliente</option>
                    <option value="Design">Design</option>
                    <option value="Operações">Operações</option>
                    <option value="Construção Civil">Construção Civil</option>
                  </select>
                </div>
                <button style={{ marginTop: '1vw' }} className='button-modal-vagas' type="submit">Salvar Alterações</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <section className="candidatos-interessados">
        <div className="titulo-candidatos-interessados">
          <h1>Candidatos Interessados</h1>
        </div>

        <div className="candidatos-container">
          {candidates.map((candidato) => (
            <div
              className="content-curriculos-interessados"
              key={candidato._id}
              onClick={() => {
                fetchCandidateDetails(candidato._id);
                setCandidateModalVisible(true);
              }}
            >
              <button> <p>Ver Mais</p> </button>
              <div className="content-box-infos-curriculos">
                <h1>{candidato.candidateName}</h1>
                <p>{candidato.candidateAddress?.city} - {candidato.candidateAddress?.state}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {candidateModalVisible && selectedCandidate && (
        <div className="modal-overlay">
          <div className="candidate-modal">
            <div className="modal-header">
              <h2>Detalhes do Candidato</h2>
              <button onClick={() => setCandidateModalVisible(false)}>X</button>
            </div>
            <div className="modal-content">
              <p><strong>Nome:</strong> {selectedCandidate.candidateName}</p>
              <p><strong>Idade:</strong> {new Date().getFullYear() - new Date(selectedCandidate.candidateBirth).getFullYear()} anos</p>
              <p><strong>Telefone:</strong> {selectedCandidate.candidatePhone}</p>
              <p><strong>Endereço:</strong> {`${selectedCandidate.candidateAddress?.publicPlace}, ${selectedCandidate.candidateAddress?.neighborhood}, ${selectedCandidate.candidateAddress?.city} - ${selectedCandidate.candidateAddress?.state}`}</p>
              <p><strong>Sobre:</strong> {selectedCandidate.candidateAbout}</p>
              <p><strong>Idiomas:</strong> {selectedCandidate.candidateIdioms.map((i) => `${i.name} (${i.level})`).join(', ')}</p>
              <p><strong>Experiências:</strong></p>
              <ul>
                {selectedCandidate.candidateExperience.map((exp) => (
                  <li key={exp.company}>
                    <p><strong>Cargo:</strong> {exp.role}</p>
                    <p><strong>Empresa:</strong> {exp.company}</p>
                    <p><strong>Período:</strong> {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Atualmente'}</p>
                  </li>
                ))}
              </ul>
              <p><strong>Qualificações:</strong> {selectedCandidate.candidateQualifications.map((q) => q.description).join(', ')}</p>
            </div>
            <div className="modal-actions">
              <textarea
                placeholder="Adicione um comentário (opcional)"
                rows="3"
                style={{ width: '100%', marginBottom: '10px' }}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
              <button onClick={() => handleStatusChange(selectedCandidate._id, 'Aprovado', comments)}>
                Aprovar
              </button>
              <button onClick={() => handleStatusChange(selectedCandidate._id, 'Dispensado', comments)}>
                Dispensar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}