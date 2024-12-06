
import React, { useState, useEffect, useRef } from 'react';
import Menu from "../Menu/Menu";
import MenuMobile from '../MenuMobile/MenuMobile';
import CompanyName from '../CompanyName/CompanyName';
import { useFavorites } from '../../../../Context/FavoritesContext';
import { Link } from 'react-router-dom';

export function VagasFavoritas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); // Pega as funções do contexto de favoritos
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const cardRef = useRef(null);

  // Filtra os favoritos para mostrar apenas candidatos
  const favoriteCandidates = favorites.filter(item => item.role === 'Candidate');
  console.log(favoriteCandidates)

  const handleRemoveFavorite = async (vaga) => {
    await removeFavorite(vaga._id); // Chamando a função do contexto
  };

  const toggleFavorite = async (candidato) => {
    if (isFavorite(candidato._id)) {
      await removeFavorite(candidato._id);
    } else {
      await addFavorite(candidato);
    }
  };

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

  return (
    <>
      {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
      {windowWidth < 450 && <MenuMobile />}
      <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className="cabecalhoCandidato">
          <div>
            <CompanyName />
            <div className="input-container">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Buscar Vagas" className="search-input" />
            </div>
          </div>

          <div className="filtro">
            <h2>Candidatos Favoritos</h2>
          </div>

        </section>

        <section className="container-box-vagas">
          {favoriteCandidates.length === 0 ? (
            <p>Nenhum candidato favoritado no momento.</p>
          ) : (
            favoriteCandidates.map((candidato) => (
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

      </main>
    </>
  );
}

export default VagasFavoritas;
