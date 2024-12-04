import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../../../Context/FavoritesContext';
import { toast } from 'sonner';
import './BoxCandidato.css';

export default function BoxCandidatos({ filteredCandidates }) {
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const cardRef = useRef(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());


  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axiosInstance.get('/api/user/candidate/list-candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Erro ao buscar os candidatos:', error);
      }
    };

    fetchCandidates();
  }, []);

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

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(candidateId)) {
        updatedSelected.delete(candidateId);
      } else {
        updatedSelected.add(candidateId);
      }
      return updatedSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map(candidate => candidate._id)));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Array.from(selectedCandidates);

      // Itera sobre cada ID e envia uma requisição DELETE
      for (const id of idsToDelete) {
        await axiosInstance.delete(`/api/user/delete-user/${id}`);
        toast.success("Deletado com Sucesso!")
      }

      // Atualiza o estado para remover as candidatos deletados da lista
      setCompanies(prevCandidates => prevCandidates.filter(candidate => !selectedCandidates.has(candidate._id)));
      setSelectedCandidates(new Set());

    } catch (error) {
      console.error('Erro ao deletar os candidatos selecionadas:', error);
    }

  };


  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }


  return (
    <>

      <div className='actions'>
        <button
          className={`action-selecionar ${selectedCandidates.size === candidates.length ? 'selecionado' : ''}`}
          onClick={handleSelectAll}
        >
          {selectedCandidates.size === candidates.length ? 'Desselecionar tudo' : 'Selecionar tudo'}
        </button>
        <button className='action-deletar' onClick={handleDeleteSelected} disabled={selectedCandidates.size === 0}>
          Deletar selecionados
        </button>
      </div>
      <section className='container-vagas'>

        {candidates && candidates.length === 0 ? (
          <p>Nenhum candidato encontrado no momento.</p>
        ) : (
          candidates && candidates.map((candidato) => (
            <div className='content-curriculos-recomendados' key={candidato._id || candidato.candidateName}>
              <div className='content-area-curriculos'>
                <h1>ver mais</h1>
              </div>
              <div className='content-infos-curriculos-select'>

                <div className='content-infos-curriculos' onClick={() => setSelectedCandidate(candidato)}>

                  <div className='content-infos-curriculos-nome'>
                    <h1>{candidato.candidateName} - {ageCalculator(candidato.candidateBirth)}</h1>
                  </div>
                  <h3 className='area-atuacao'>{candidato.areaOfInterest}</h3>
                  <h3>{candidato.candidateTargetSalary}</h3>
                  <p>{candidato.candidateAbout}</p>
                </div>

                <div className='select-candidate-checkbox'>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.has(candidato._id)}
                    onChange={(e) => { e.stopPropagation(); handleSelectCandidate(candidato._id) }}

                  />
                </div>
              </div>

            </div>
          ))
        )}
      </section>

      {selectedCandidate && (
        <>
          <div className="modal-overlay">
            <div className="candidate-card" ref={cardRef}>
              <div className="modal-header">
                <h2>{selectedCandidate.candidateName}</h2>
                <button onClick={() => setSelectedCandidate(null)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="area-atuacao-modal">
                <h2>{selectedCandidate.areaOfInterest}</h2>
              </div>
              <div className="infos-modal">
                <div className="desc-info-modal">
                  <h3>{ageCalculator(selectedCandidate.candidateBirth)} Anos</h3>
                </div>
                <div className="desc-info-modal desc-info-modal2">
                  <h3>Pretensão salarial - </h3>
                  <p>{selectedCandidate.candidateTargetSalary}</p>
                </div>
              </div>
              <div className="infos-modal">
                <div className="desc-info-modal">
                  <h3>
                    {selectedCandidate.candidateAddress?.city},{" "}
                    {selectedCandidate.candidateAddress?.state}
                  </h3>
                </div>
                <div className="desc-info-modal desc-info-modal2">
                  <h3>{selectedCandidate.candidatePhone}</h3>
                </div>
              </div>
              <div className="desc-candidato-modal">
                <p>{truncateText(selectedCandidate.candidateAbout, 100)}</p>
              </div>
              <div className="acessar-perfil-button">
                <Link to={`/pre-visualizacao/${selectedCandidate?._id}`}>{'Acessar Perfil' || 'Candidato não encontrado'}</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}