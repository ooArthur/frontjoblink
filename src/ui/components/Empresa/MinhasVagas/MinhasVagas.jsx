// Código completo do seu componente MinhasVagas com as modificações sugeridas

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';
import '../BoxVagas/BoxVagas.css';
import BoxVagas from '../BoxVagas/BoxVagas';
import Menu from '../Menu/Menu';
import MenuMobile from '../MenuMobile/MenuMobile';
import CompanyName from '../CompanyName/CompanyName';
import './MinhasVagas.css';
import { toast } from 'sonner';

export default function MinhasVagas() {
  const [salaryValue, setSalaryValue] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('');
  const [company, setCompany] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newVaga, setNewVaga] = useState(false);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [vagaData, setVagaData] = useState({
    jobTitle: '',
    jobDescription: '',
    salary: '',
    jobLocation: { city: '', state: '' },
    workSchedule: { workingHours: '', workingDays: [] },
    requiredQualifications: [],
    desiredSkills: [],
    employmentType: '',
    applicationDeadline: '',
    jobArea: ''
  });

  const [newQualification, setNewQualification] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const fetchCompany = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/list-company/');
      if (response.data) {
        const companyData = response.data;
        setCompany(companyData);
      }
    } catch (error) {
      console.error('Erro ao buscar a empresa:', error);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchJobVacancies();
  }, []);

  const fetchJobVacancies = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/vacancy/company-vacancies/');
      setJobVacancies(response.data);
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
    }
  };

  const adicionarVaga = () => {
    setNewVaga(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVagaData({ ...vagaData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setVagaData({
      ...vagaData,
      jobLocation: { ...vagaData.jobLocation, [name]: value }
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setVagaData({
      ...vagaData,
      workSchedule: { ...vagaData.workSchedule, [name]: value }
    });
  };

  const handleAddQualification = () => {
    if (newQualification.trim() !== '') {
      setVagaData((prev) => ({
        ...prev,
        requiredQualifications: [...prev.requiredQualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setVagaData((prev) => ({
        ...prev,
        desiredSkills: [...prev.desiredSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveQualification = (qual) => {
    setVagaData((prev) => ({
      ...prev,
      requiredQualifications: prev.requiredQualifications.filter((q) => q !== qual)
    }));
  };

  const handleRemoveSkill = (skill) => {
    setVagaData((prev) => ({
      ...prev,
      desiredSkills: prev.desiredSkills.filter((s) => s !== skill)
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setVagaData({
      ...vagaData,
      [name]: value.split(',').map(item => item.trim())
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + 90);

    const combinedSalary = `${salaryCurrency || 'R$'} ${salaryValue}`;

    try {
      const response = await axiosInstance.post('/api/user/company/vacancy/create-vacancy', {
        ...vagaData,
        salary: combinedSalary, // Usando o salário combinado
        companyId: company._id,
        applicationDeadline: deadline.toISOString().split('T')[0],
        workSchedule: {
          ...vagaData.workSchedule,
          workingDays: selectedDays
        }
      });

      // Adiciona a nova vaga ao estado
      setJobVacancies((prevVacancies) => [...prevVacancies, response.data]);

      toast.success("Sua vaga foi criada com sucesso!");
      setNewVaga(false);

      // Limpa os dados do formulário após a criação da vaga
      setVagaData({
        jobTitle: '',
        jobDescription: '',
        salary: '',
        jobLocation: { city: '', state: '' },
        workSchedule: { workingHours: '', workingDays: [] },
        requiredQualifications: [],
        desiredSkills: [],
        employmentType: '',
        applicationDeadline: '',
        jobArea: ''
      });
      setSelectedDays([]);
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      toast.error("Erro ao criar vaga.");
    }
  };

  const daysOfWeek = [
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
    'Domingo'
  ];

  const [selectedDays, setSelectedDays] = useState([]);

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  return (
    <>
      {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
      {windowWidth < 450 && <MenuMobile />}
      <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className="cabecalhoCandidato">
          <div>
            <CompanyName />
            {/* <div className="input-container">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Buscar Vagas" className="search-input" />
                        </div> */}
          </div>

          <div className="filtro">
            <h2>Minhas Vagas</h2>
            <div className='criar-vagas'>
              <button className='button-modal-vagas' onClick={adicionarVaga}>Criar vaga</button>
            </div>
          </div>

          {newVaga && (
            <div className="modal-overlay">
              <div className="create-vaga-modal">
                <div className="create-vaga-card">
                  <div className="modal-header">
                    <h2>Crie uma nova vaga</h2>
                    <button className='button-modal-vagas' onClick={() => setNewVaga(false)}>
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
                        {daysOfWeek.map((day) => (
                          <button
                            type='button'
                            key={day}
                            onClick={() => handleDayToggle(day)}
                            className={selectedDays.includes(day) ? 'selected' : ''}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      <h4>Qualificações Necessárias:</h4>
                      <input
                        type="text"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        placeholder="Adicionar qualificação"
                      />
                      <button className='button-modal-vagas' type="button" onClick={handleAddQualification}>Adicionar Qualificação</button>
                      <ul>
                        {vagaData.requiredQualifications.map((qual, index) => (
                          <li key={index}>
                            {qual}
                            <button className='button-modal-vagas' type="button" onClick={() => handleRemoveQualification(qual)}><i class="fa-solid fa-x"></i></button>
                          </li>
                        ))}
                      </ul>

                      <h4>Habilidades Desejadas:</h4>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Adicionar habilidade"
                      />
                      <button className='button-modal-vagas' type="button" onClick={handleAddSkill}>Adicionar Habilidade</button>
                      <ul>
                        {vagaData.desiredSkills.map((skill, index) => (
                          <li key={index}>
                            {skill}
                            <button className='button-modal-vagas' type="button" onClick={() => handleRemoveSkill(skill)}><i className="fa-solid fa-x"></i></button>
                          </li>
                        ))}
                      </ul>

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
                    <button style={{ marginTop: '1vw' }} className='button-modal-vagas' type="submit">Criar</button>
                  </form>
                </div>
              </div>
            </div>
          )}
          <BoxVagas vacancies={jobVacancies} />
        </section>
      </main>
    </>
  );
}
