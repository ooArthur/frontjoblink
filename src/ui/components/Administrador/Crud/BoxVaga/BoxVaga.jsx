import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BoxVagas.css';
import axiosInstance from '../../../../../source/axiosInstance';
import { useFavorites } from '../../../../../Context/FavoritesContext';
import { toast } from 'sonner';


export function BoxVaga({ searchQuery, selectedFilter }) {
  const [jobVacancies, setJobVacancies] = useState([]);
  const [selectedVacancies, setSelectedVacancies] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);


  const cardRef = useRef(null);
  const fetchJobVacancies = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/vacancy/list-vacancies');
      setJobVacancies(response.data);
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
    }
  };


  useEffect(() => {
    fetchJobVacancies();
  }, []);

  const handleSelectVacancy = (vacancyId) => {
    setSelectedVacancies((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(vacancyId)) {
        updatedSelected.delete(vacancyId);
      } else {
        updatedSelected.add(vacancyId);
      }
      return updatedSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedVacancies.size === jobVacancies.length) {
      setSelectedVacancies(new Set());
    } else {
      setSelectedVacancies(new Set(jobVacancies.map(vacancy => vacancy._id)));
    }
  };


  const handleDeleteSelected = async () => {
    try {
        const idsToDelete = Array.from(selectedVacancies);

        // Itera sobre cada ID e envia uma requisição DELETE
        for (const id of idsToDelete) {
            await axiosInstance.delete(`/api/user/company/vacancy/delete-vacancy/${id}`);
            toast.success("Deletado com Sucesso!")
        }

        // Atualiza o estado para remover as vagas deletadas da lista
        setVacancies(prevVacancies => prevVacancies.filter(vacancy => !selectedVacancies.has(vacancy._id)));
        setSelectedVacancies(new Set());

        fetchJobVacancies();

    } catch (error) {
        console.error('Erro ao deletar as vagas selecionadas:', error);
    }
   
}; 

  // Função para truncar descrição
  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  // Fechar o modal ao clicar fora
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

  return (
    <>

      <div className="actions">
        <button
          className={`action-selecionar ${selectedVacancies.size === jobVacancies.length ? 'selecionado' : 'nao-selecionado'}`}
          onClick={handleSelectAll}
        >
          {selectedVacancies.size === jobVacancies.length ? 'Desselecionar tudo' : 'Selecionar tudo'}
        </button>
        <button
          className='action-deletar'
          onClick={handleDeleteSelected}
          disabled={selectedVacancies.size === 0 || loading}
        >
          {loading ? 'Deletando...' : 'Deletar selecionadas'}
        </button>
      </div>

      <div className="container-box-vagas alinhamento-crud">

        {jobVacancies.length === 0 ? (
          <p className="no-vacancies-message">Nenhuma vaga cadastrada no momento.</p>
        ) : (
          jobVacancies.map((vaga) => (
            <div key={vaga._id} className="box-vaga">

              <div className="select-vacancy-checkbox">
                <input
                  type="checkbox"
                  checked={selectedVacancies.has(vaga._id)}
                  onChange={() => handleSelectVacancy(vaga._id)}
                />
              </div>

              <div onClick={() => setSelectedVacancy(vaga)} className="info-box-vaga">
                <div className="header-box-vaga">
                  <div className="nome-vaga">
                    <h2>{vaga.jobTitle}</h2>
                    <Link>{vaga.companyId?.companyName || 'Empresa não encontrada'}</Link>
                  </div>
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
                <Link to={`/pre-visualizacaoE/${selectedVacancy.companyId?._id}`}>{selectedVacancy.companyId?.companyName || 'Empresa não encontrada'}</Link>
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
                    {selectedVacancy.requiredQualifications.map((qualification, index) => (
                      <li style={{fontSize: '1.2vw', fontWeight: '300'}} key={index}>- {qualification} </li>
                    ))}
                  </ul>
                </div>
                <div className='containerVagaCard'>
                  <h4>Habilidades requisitadas</h4>
                  <span> {selectedVacancy.desiredSkills} </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default BoxVaga;
