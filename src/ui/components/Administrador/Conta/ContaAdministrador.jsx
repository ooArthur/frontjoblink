import Menu from "../Menu/Menu";
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import './ContaAdministrador.css';

function ContaAdministrador() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);


  // Obtém a data atual e formata
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAlterarSenha = () => {
    setShowPasswordInfo(!showPasswordInfo);
  };

  return (
    <>
      <Menu setMenuOpen={setMenuOpen} />

      <main id='mainAdaptation' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className='header-adm'>
          <h1>Olá, Administrador</h1>
          <div className='dashboard-titulo'>
            <p className="Date">{dataFormatada}</p>
            <h1>Conta</h1>
          </div>
        </section>

        <section className='container-conta-adm'>
          <div className="content-conta-adm">
            <div className="label-conta-adm">
              <label>E-mail:</label>
              <input type="text" placeholder='E-mail do ADM' />
            </div>
            <div className="label-conta-adm">

              <div className={`senha-adm ${showPasswordInfo ? 'expanded' : ''}`}>
                <button onClick={handleAlterarSenha}>Alterar senha <i className="fa-solid fa-chevron-right"></i></button>

                {showPasswordInfo && (
                  <div className={`password-info ${showPasswordInfo ? 'enter' : 'exit'}`}>
                    <p>Nova senha:</p>
                    <input type="password" placeholder="Nova Senha" />
                    <p>Confirmar senha:</p>
                    <input type="password" placeholder="Confirme a nova Senha" />
                  </div>
                )}
              </div>

            </div>

            <div className="button-conta-adm">
              <button>Salvar</button>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}

export default ContaAdministrador;