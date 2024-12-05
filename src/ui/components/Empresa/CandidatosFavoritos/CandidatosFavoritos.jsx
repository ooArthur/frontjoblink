
import React, { useState, useEffect } from 'react';
import Menu from "../Menu/Menu";
import MenuMobile from '../MenuMobile/MenuMobile';
import CompanyName from '../CompanyName/CompanyName';
import { useFavorites } from '../../../../Context/FavoritesContext';

export function VagasFavoritas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); // Pega as funções do contexto de favoritos
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

      </main>
    </>
  );
}

export default VagasFavoritas;
