import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import Menu from "../Menu/Menu";
import BoxCandidatos from "./BoxCandidatos/BoxCandidatos.jsx";
import BoxVagas from "./BoxVaga/BoxVaga.jsx";
import BoxEmpresa from "./BoxEmpresa/BoxEmpresa.jsx";
import BoxAdmin from "./BoxAdmin/BoxAdmin.jsx";
import AdministradorName from "../AdministradorName/AdministradorName";
import './Crud.css';
import { toast } from 'sonner';

function Crud() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('Candidatos');
  const [showModalCandidate, setShowModalCandidate] = useState(false);
  const [showModalCompany, setShowModalCompany] = useState(false);
  const [showModalVacancy, setShowModalVacancy] = useState(false);
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [candidateData, setCandidateData] = useState({
    candidateName: '',
    candidatePhone: '',
    desiredRole: '',
    candidateTargetSalary: '',
    desiredState: '',
    desiredCity: '',
    candidateCEP: '',
    candidateAddress: {
      publicPlace: '',
      neighborhood: '',
      city: '',
      state: '',
      number: '',
    },
    candidateBirth: '',
    candidateGender: '',
    areaOfInterest: '',
    email: '',
    password: ''
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    password: '',
    address: {
      publicPlace: '',
      neighborhood: '',
      city: '',
      state: '',
      number: '',
    },
    companyCEP: '',
    companyCity: '',
    companyState: '',
    employerCompanyData: {
      cnpj: '',
      socialReason: '',
      fantasyName: '',
    },
    crhCompanyData: {
      cnpj: '',
      socialReason: '',
      fantasyName: '',
    },
    liberalProfessionalData: {
      registrationDocument: '',
      registrationNumber: '',
      cpf: '',
    }
  });

  const [vacancyData, setVacancyData] = useState({
    companyId: '',
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

  const [adminData, setAdminData] = useState({
    email: '',
    password: ''
  })

  const employmentTypes = ['CLT', 'PJ', 'Temporário', 'Jovem Aprendiz', 'Estágio'];
  const jobAreas = [
    'Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia', 'Marketing',
    'Vendas', 'Recursos Humanos', 'Administração', 'Jurídico', 'Logística',
    'Atendimento ao Cliente', 'Design', 'Operações', 'Construção Civil'
  ];
  const workDays = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get('/api/user/company/list-companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Erro ao listar empresas:', error);
      }
    };
    fetchCompanies();
  }, []);

  const areaOptions = [
    'Tecnologia',
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
    'Construção Civil'
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Candidatos':
        return <BoxCandidatos />;
      case 'Vagas':
        return <BoxVagas />;
      case 'Empresas':
        return <BoxEmpresa />;
      case 'Administradores':
        return <BoxAdmin />;
      default:
        return <BoxCandidatos />;
    }
  };

  const handleOpenModal = () => {
    if (activeComponent === 'Empresas') {
      setShowModalCompany(true);
    } else if (activeComponent === 'Vagas') {
      setShowModalVacancy(true);
    } else if(activeComponent === 'Administradores'){
      setShowModalAdmin(true);
    } else {
      setShowModalCandidate(true);
    }
  };

  const handleCloseModal = () => {
    setShowModalCandidate(false);
    setShowModalCompany(false);
    setShowModalVacancy(false);
    setShowModalAdmin(false);
  };

  const handleSubmitVacancy = async (e) => {
    e.preventDefault();

    // Calcula o prazo de inscrição (90 dias a partir de hoje)
    const today = new Date();
    const applicationDeadline = new Date(today.setDate(today.getDate() + 90)).toISOString().split("T")[0];

    // Preparar a estrutura correta para jobLocation e workSchedule
    const formattedVacancyData = {
      ...vacancyData,
      jobLocation: {
        city: vacancyData.jobLocation.city,
        state: vacancyData.jobLocation.state,
      },
      workSchedule: {
        workingHours: vacancyData.workSchedule.workingHours || "", // Garante que workingHours não seja indefinido
        workingDays: selectedDays,  // Usando selectedDays para preencher os dias selecionados
      },
      applicationDeadline // Adiciona a data de prazo ao objeto
    };

    console.log("Enviando vaga:", formattedVacancyData);

    try {
      if (selectedDays.length === 0) {
        toast.warn("Por favor, selecione ao menos um dia da semana.");
        return;
      }

      await axiosInstance.post('/api/user/company/vacancy/create-vacancy', formattedVacancyData);
      toast.success("Vaga criada com sucesso!");
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      toast.error("Erro ao criar vaga.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (activeComponent === 'Administradores') {
      setAdminData((prevData) => ({
        ...prevData,
        [name]: value, // Atualiza o email ou password
      }));
    } else if (activeComponent === 'Empresas') {
      // Atualiza dados da empresa
      if (name.startsWith('address.')) {
        const subfield = name.split('.')[1];
        setCompanyData((prevData) => ({
          ...prevData,
          address: {
            ...prevData.address,
            [subfield]: value,
          },
        }));
      } else {
        setCompanyData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (activeComponent === 'Candidatos') {
      // Atualiza dados do candidato
      if (name.startsWith('candidateAddress.')) {
        const subfield = name.split('.')[1];
        setCandidateData((prevData) => ({
          ...prevData,
          candidateAddress: {
            ...prevData.candidateAddress,
            [subfield]: value,
          },
        }));
      } else {
        setCandidateData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (activeComponent === 'Vagas') {
      // Atualiza dados da vaga
      if (name.startsWith('jobLocation.')) {
        const subfield = name.split('.')[1];
        setJobData((prevData) => ({
          ...prevData,
          jobLocation: {
            ...prevData.jobLocation,
            [subfield]: value,
          },
        }));
      } else if (name.startsWith('workSchedule.')) {
        const subfield = name.split('.')[1];
        setJobData((prevData) => ({
          ...prevData,
          workSchedule: {
            ...prevData.workSchedule,
            [subfield]: value,
          },
        }));
      } else {
        setJobData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = 
      activeComponent === 'Empresas'
        ? '/api/user/company/create-company'
        : activeComponent === 'Administradores'
        ? '/api/user/create-admin'
        : '/api/user/candidate/create-candidate';
  
    // Filtra `companyData` com base no tipo de empresa selecionado
    const filteredCompanyData = { ...companyData };
    if (companyData.type === 'Empresa Empregadora') {
      delete filteredCompanyData.crhCompanyData;
      delete filteredCompanyData.liberalProfessionalData;
    } else if (companyData.type === 'Empresa de CRH') {
      delete filteredCompanyData.employerCompanyData;
      delete filteredCompanyData.liberalProfessionalData;
    } else if (companyData.type === 'Profissional Liberal') {
      delete filteredCompanyData.employerCompanyData;
      delete filteredCompanyData.crhCompanyData;
    }
  
    const dataToSend =
      activeComponent === 'Empresas'
        ? filteredCompanyData
        : activeComponent === 'Administradores'
        ? adminData
        : candidateData;
  
    console.log('Enviando dados:', dataToSend);
  
    try {
      await axiosInstance.post(endpoint, dataToSend);
      toast.success(
        `${activeComponent === 'Empresas' ? 'Empresa' : activeComponent === 'Administradores' ? 'Administrador' : 'Candidato'} criado com sucesso!`
      );
      handleCloseModal();
    } catch (error) {
      console.error(
        `Erro ao criar ${
          activeComponent === 'Empresas'
            ? 'empresa'
            : activeComponent === 'Administradores'
            ? 'administrador'
            : 'candidato'
        }:`,
        error
      );

      console.log("Admin Log: " + adminData.password)
      toast.error(
        `Erro ao criar ${
          activeComponent === 'Empresas'
            ? 'empresa'
            : activeComponent === 'Administradores'
            ? 'administrador'
            : 'candidato'
        }.`
      );
    }
  };
  

  const [selectedDays, setSelectedDays] = useState([]);
  const [qualificationInput, setQualificationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const daysOfWeek = [
    'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'
  ];

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleVacancyInputChange = (e) => {
    const { name, value } = e.target;

    setVacancyData(prevData => {
      if (name.startsWith("jobLocation.")) {
        const field = name.split(".")[1];
        return {
          ...prevData,
          jobLocation: {
            ...prevData.jobLocation,
            [field]: value
          }
        };
      } else if (name.startsWith("workSchedule.")) {
        const field = name.split(".")[1];
        return {
          ...prevData,
          workSchedule: {
            ...prevData.workSchedule,
            [field]: value
          }
        };
      } else {
        return {
          ...prevData,
          [name]: value
        };
      }
    });
  };

  const handleAddQualification = () => {
    if (qualificationInput && !vacancyData.requiredQualifications.includes(qualificationInput)) {
      setVacancyData(prevData => ({
        ...prevData,
        requiredQualifications: [...prevData.requiredQualifications, qualificationInput]
      }));
      setQualificationInput('');
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !vacancyData.desiredSkills.includes(skillInput)) {
      setVacancyData(prevData => ({
        ...prevData,
        desiredSkills: [...prevData.desiredSkills, skillInput]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveQualification = (qualification) => {
    setVacancyData(prevData => ({
      ...prevData,
      requiredQualifications: prevData.requiredQualifications.filter(q => q !== qualification)
    }));
  };

  const handleRemoveSkill = (skill) => {
    setVacancyData(prevData => ({
      ...prevData,
      desiredSkills: prevData.desiredSkills.filter(s => s !== skill)
    }));
  };

  return (
    <>
      <Menu setMenuOpen={setMenuOpen} />
      <main id='mainAdaptation' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className="header-adm mainAdm">
          <AdministradorName />
        </section>

        <section>
          <div className="divCrud">
            <button onClick={handleOpenModal}>+</button>
          </div>
          <div className="navCrud">
  <nav>
    <button 
      className={activeComponent === 'Candidatos' ? 'active-button' : 'normal-button'} 
      onClick={() => setActiveComponent('Candidatos')}
    >
      Candidatos
    </button>
    <button 
      className={activeComponent === 'Empresas' ? 'active-button' : 'normal-button'} 
      onClick={() => setActiveComponent('Empresas')}
    >
      Empresas
    </button>
    <button 
      className={activeComponent === 'Vagas' ? 'active-button' : 'normal-button'} 
      onClick={() => setActiveComponent('Vagas')}
    >
      Vagas
    </button>
    <button 
      className={activeComponent === 'Administradores' ? 'active-button' : 'normal-button'} 
      onClick={() => setActiveComponent('Administradores')}
    >
      Administradores
    </button>
  </nav>
</div>

          <div>
            {renderComponent()}
          </div>
        </section>
      </main>

      {showModalCandidate && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal cardCrud" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Novo Candidato</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input type="email" name="email" placeholder="E-mail" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Senha:</label>
                <input type="password" name="password" placeholder="Senha" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Nome do Candidato:</label>
                <input type="text" name="candidateName" placeholder="Nome do Candidato" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Telefone do Candidato:</label>
                <input type="text" name="candidatePhone" placeholder="Telefone do Candidato" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Cargo Desejado:</label>
                <input type="text" name="desiredRole" placeholder="Cargo Desejado" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Salário Desejado:</label>
                <input type="text" name="candidateTargetSalary" placeholder="Salário Desejado" onChange={handleInputChange} />
              </div>

              <div>
                <label>Estado Desejado:</label>
                <input type="text" name="desiredState" placeholder="Estado Desejado" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Cidade Desejada:</label>
                <input type="text" name="desiredCity" placeholder="Cidade Desejada" onChange={handleInputChange} required />
              </div>

              <div>
                <label>CEP:</label>
                <input type="text" name="candidateCEP" placeholder="CEP" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Logradouro:</label>
                <input type="text" name="candidateAddress.publicPlace" placeholder="Logradouro" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Bairro:</label>
                <input type="text" name="candidateAddress.neighborhood" placeholder="Bairro" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Cidade:</label>
                <input type="text" name="candidateAddress.city" placeholder="Cidade" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Estado:</label>
                <input type="text" name="candidateAddress.state" placeholder="Estado" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Número:</label>
                <input type="text" name="candidateAddress.number" placeholder="Número" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Data de Nascimento:</label>
                <input type="date" name="candidateBirth" placeholder="Data de Nascimento" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Gênero:</label>
                <select name="candidateGender" onChange={handleInputChange} required>
                  <option value="">Selecione o Gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label>Área de Atuação:</label>
                <select name="areaOfInterest" value={candidateData.areaOfInterest} onChange={handleInputChange}>
                  <option value="">Selecione a Área de Atuação</option>
                  {areaOptions.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <button id='buttonCrud' type="submit">Criar Candidato</button>
            </form>
          </div>
        </div>
      )}

      {showModalCompany && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal cardCrud" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Empresa</h2>
            <form onSubmit={handleSubmit}>
              {/* Campos gerais para todas as empresas */}
              <div>
                <label>Email:</label>
                <input type="email" name="email" placeholder="E-mail" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Senha:</label>
                <input type="password" name="password" placeholder="Senha" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Nome da Empresa:</label>
                <input type="text" name="companyName" placeholder="Nome da Empresa" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Cargo na Empresa:</label>
                <input type="text" name="positionInTheCompany" placeholder="Cargo na Empresa" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Ramo de Atividade:</label>
                <input type="text" name="branchOfActivity" placeholder="Ramo de Atividade" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Telefone:</label>
                <input type="text" name="telephone" placeholder="Telefone" onChange={handleInputChange} required />
              </div>

              <div>
                <label>CEP:</label>
                <input type="text" name="address.cep" placeholder="CEP" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Logradouro:</label>
                <input type="text" name="address.publicPlace" placeholder="Logradouro" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Bairro:</label>
                <input type="text" name="address.neighborhood" placeholder="Bairro" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Cidade:</label>
                <input type="text" name="address.city" placeholder="Cidade" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Estado:</label>
                <input type="text" name="address.state" placeholder="Estado" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Número:</label>
                <input type="text" name="address.number" placeholder="Número" onChange={handleInputChange} required />
              </div>

              <div>
                <label>Descrição da Empresa:</label>
                <textarea name="description" placeholder="Descrição da Empresa" onChange={handleInputChange}></textarea>
              </div>

              <div>
                <label>Número de Empregados:</label>
                <input type="number" name="employeerNumber" placeholder="Número de Empregados" onChange={handleInputChange} />
              </div>

              {/* Select para o tipo de empresa */}
              <div>
                <label>Tipo de Empresa:</label>
                <select name="type" value={companyData.type} onChange={handleInputChange} required>
                  <option value="">Selecione o tipo de empresa</option>
                  <option value="Empresa Empregadora">Empresa Empregadora</option>
                  <option value="Empresa de CRH">Empresa de CRH</option>
                  <option value="Profissional Liberal">Profissional Liberal</option>
                </select>
              </div>

              {/* Campos condicionais para 'Empresa Empregadora' */}
              {companyData.type === 'Empresa Empregadora' && (
                <>
                  <div>
                    <label>CNPJ:</label>
                    <input type="text" name="employerCompanyData.cnpj" placeholder="CNPJ" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Razão Social:</label>
                    <input type="text" name="employerCompanyData.socialReason" placeholder="Razão Social" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Nome Fantasia:</label>
                    <input type="text" name="employerCompanyData.fantasyName" placeholder="Nome Fantasia" onChange={handleInputChange} required />
                  </div>
                </>
              )}

              {/* Campos condicionais para 'Empresa de CRH' */}
              {companyData.type === 'Empresa de CRH' && (
                <>
                  <div>
                    <label>CNPJ:</label>
                    <input type="text" name="crhCompanyData.cnpj" placeholder="CNPJ" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Razão Social:</label>
                    <input type="text" name="crhCompanyData.socialReason" placeholder="Razão Social" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Nome Fantasia:</label>
                    <input type="text" name="crhCompanyData.fantasyName" placeholder="Nome Fantasia" onChange={handleInputChange} required />
                  </div>
                </>
              )}

              {/* Campos condicionais para 'Profissional Liberal' */}
              {companyData.type === 'Profissional Liberal' && (
                <>
                  <div>
                    <label>Documento de Registro:</label>
                    <input type="text" name="liberalProfessionalData.registrationDocument" placeholder="Documento de Registro" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Número de Registro:</label>
                    <input type="text" name="liberalProfessionalData.registrationNumber" placeholder="Número de Registro" onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>CPF:</label>
                    <input type="text" name="liberalProfessionalData.cpf" placeholder="CPF" onChange={handleInputChange} required />
                  </div>
                </>
              )}

              <div>
                <label>Site da Empresa:</label>
                <input type="text" name="site" placeholder="Site da Empresa" onChange={handleInputChange} />
              </div>

              <button id='buttonCrud' type="submit">Criar Empresa</button>
              <button id='buttonCrud' type="button" onClick={handleCloseModal}>Cancelar</button>
            </form>

          </div>
        </div>
      )}

      {showModalVacancy && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal cardCrud" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Vaga</h2>
            <form onSubmit={handleSubmitVacancy}>
              {/* Seleção de Empresa */}
              <div>
                <label>Empresa:</label>
                <select name="companyId" onChange={handleVacancyInputChange} required>
                  <option value="">Selecione uma Empresa</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>{company.companyName}</option>
                  ))}
                </select>
              </div>

              {/* Título da Vaga */}
              <div>
                <label>Título da Vaga:</label>
                <input type="text" name="jobTitle" placeholder="Título da Vaga" onChange={handleVacancyInputChange} required />
              </div>

              {/* Descrição da Vaga */}
              <div>
                <label>Descrição da Vaga:</label>
                <textarea name="jobDescription" placeholder="Descrição da Vaga" onChange={handleVacancyInputChange} required></textarea>
              </div>

              {/* Salário */}
              <div>
                <label>Salário:</label>
                <input type="text" name="salary" placeholder="Salário" onChange={handleVacancyInputChange} />
              </div>

              {/* Localização da Vaga */}
              <div>
                <label>Cidade:</label>
                <input type="text" name="jobLocation.city" placeholder="Cidade" onChange={handleVacancyInputChange} required />
              </div>
              <div>
                <label>Estado:</label>
                <input type="text" name="jobLocation.state" placeholder="Estado" onChange={handleVacancyInputChange} required />
              </div>

              {/* Horário de Trabalho */}
              <div>
                <label>Horário de Trabalho:</label>
                <input type="text" name="workSchedule.workingHours" placeholder="Horário de Trabalho" onChange={handleVacancyInputChange} />
              </div>

              {/* Tipo de Contratação */}
              <div>
                <label>Tipo de Contratação:</label>
                <select name="employmentType" onChange={handleVacancyInputChange} required>
                  <option value="">Tipo de Contratação</option>
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Área de Atuação */}
              <div>
                <label>Área de Atuação:</label>
                <select name="jobArea" onChange={handleVacancyInputChange} required>
                  <option value="">Área de Atuação</option>
                  {jobAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Qualificações Requeridas */}
              <h4>Qualificações Requeridas:</h4>
              <div>
                <input
                  type="text"
                  value={qualificationInput}
                  onChange={(e) => setQualificationInput(e.target.value)}
                  placeholder="Adicione qualificação"
                />
                <button id='buttonCrud' type="button" onClick={handleAddQualification}>Adicionar Qualificação</button>
              </div>
              <ul>
                {vacancyData.requiredQualifications.map((qualification, index) => (
                  <li key={index}>
                    {qualification}
                    <button id='buttonCrud' type="button" onClick={() => handleRemoveQualification(qualification)}>Remover</button>
                  </li>
                ))}
              </ul>

              {/* Habilidades Desejadas */}
              <h4>Habilidades Desejadas:</h4>
              <div>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Adicione habilidade"
                />
                <button id='buttonCrud' type="button" onClick={handleAddSkill}>Adicionar Habilidade</button>
              </div>
              <ul>
                {vacancyData.desiredSkills.map((skill, index) => (
                  <li key={index}>
                    {skill}
                    <button id='buttonCrud' type="button" onClick={() => handleRemoveSkill(skill)}>Remover</button>
                  </li>
                ))}
              </ul>

              {/* Seleção de Dias da Semana */}
              <h4>Dias da Semana:</h4>
              <div className="day-selector">
                {daysOfWeek.map((day) => (
                  <button id='buttonDiasSemana'
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={selectedDays.includes(day) ? 'selected' : ''}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Botões de Ação */}
              <button id='buttonCrud' type="submit">Criar Vaga</button>
              <button id='buttonCrud' type="button" onClick={handleCloseModal}>Cancelar</button>
            </form>

          </div>
        </div>
      )}

{showModalAdmin && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal cardCrud" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Novo Admnistrador</h2>
            <form onSubmit={handleSubmit}>
  <div>
    <label>Email:</label>
    <input 
      type="email" 
      name="email" 
      placeholder="E-mail" 
      onChange={handleInputChange} 
      required 
    />
  </div>

  <div>
    <label>Senha:</label>
    <input 
      type="password" 
      name="password" 
      placeholder="Senha" 
      onChange={handleInputChange} 
      required 
    />
  </div>

  <button id='buttonCrud' type="submit">Criar Admnistrador</button>
</form>

          </div>
        </div>
      )}


    </>
  );
}

export default Crud;