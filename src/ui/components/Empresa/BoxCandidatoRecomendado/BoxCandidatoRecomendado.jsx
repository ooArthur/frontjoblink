import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../../Context/FavoritesContext';
import '../BoxCandidatos/BoxCandidato.css';

export default function BoxCandidatoRecomendado(){
    const cardRef = useRef(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); 
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);

  useEffect(() => {
    const fetchRecommendedCandidates = async () => {
      try {
        const response = await axiosInstance.get('/api/user/company/recommend-candidates');
        if (Array.isArray(response.data)) {
          setRecommendedCandidates(response.data);
          console.log("Recomendações: " + recommendedCandidates)
        } else {
          setRecommendedCandidates([]); // Reset para array vazio se não for um array
        }
      } catch (error) {
        setRecommendedCandidates([]); // Reset para array vazio em caso de erro
      }
    };

    fetchRecommendedCandidates();
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

  function truncateText(text, maxLength) {
    if (typeof text !== 'string') {
      return ''; // Retorna uma string vazia se o texto não for uma string
    }
    
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const toggleFavorite = async (candidato) => {
    if (isFavorite(candidato._id)) {
      await removeFavorite(candidato._id);
    } else {
      await addFavorite(candidato);
    }
  };

    return (
        <>
          <section className='container-vagas-candidato'>
            {recommendedCandidates && recommendedCandidates.length === 0 ? (
              <p>Nenhum candidato recomendado no momento.</p>
            ) : (
              recommendedCandidates && recommendedCandidates.map((candidato) => (
                <div className='content-curriculos-recomendados' key={candidato._id || candidato.candidateName}>
                  <div className='content-area-curriculos'>
                    <h1>ver mais</h1>
                  </div>
                  <div className='content-infos-curriculos-select'>
    
                    <div className='content-infos-curriculos' onClick={() => setSelectedCandidate(candidato)}>
    
                      <div className='content-infos-curriculos-nome'>
                        <h1>{candidato.candidateName} - {ageCalculator(candidato.candidateBirth)}</h1>
                        <button onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(candidato);
                      }}>
                        <i className={`fa-${isFavorite(candidato._id) ? 'solid' : 'regular'} fa-star`}></i>
                      </button>
                      </div>
                      <h3 className='area-atuacao'>{candidato.areaOfInterest}</h3>
                      <h3>{candidato.candidateTargetSalary}</h3>
                      <p>{candidato.candidateAbout}</p>
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
                    <div className="desc-info-modal desc-info-modal2">
                      <h3>Idade:</h3>
                      <p>{ageCalculator(selectedCandidate.candidateBirth)}</p>
                    </div>
                    <div className="desc-info-modal">
                      <h3>Pretensão salarial:</h3>
                      <p>{selectedCandidate.candidateTargetSalary}</p>
                    </div>
                  </div>
                  <div className="infos-modal">
                    <div className="desc-info-modal">
                      <h3>Endereço:</h3>
                      <p>
                        {selectedCandidate.candidateAddress?.city},{" "}
                        {selectedCandidate.candidateAddress?.state}
                      </p>
                    </div>
                    <div className="desc-info-modal desc-info-modal2">
                      <h3>Telefone:</h3>
                      <p>{selectedCandidate.candidatePhone}</p>
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