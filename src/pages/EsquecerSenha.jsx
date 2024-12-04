import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../source/axiosInstance'; // Importa o axiosInstance
import whitelogo from '/whitelogo.svg';
import logoMobile from './../assets/images/JL (1).svg'
import '../assets/style/esquecerSenha.css';

export default function EsquecerSenha() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/user/forgot-password', { email });
      toast.success('Instruções para redefinição de senha enviadas para o seu e-mail.');
      navigate('/'); // Redireciona após sucesso
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao solicitar redefinição de senha.');
    }
  };

  /* return (
    <section className="login">
      <div className="voltar" onClick={() => navigate(-1)}>
        <i style={{ color: 'white' }} className="fa-solid fa-chevron-left"></i>
      </div> */

  return (
    <section className='login'>
      <div className='voltar' onClick={() => navigate(-1)}>
        <i style={{ color: 'white' }} className="fa-solid fa-chevron-left"></i>
      </div>

      <div className='box-login'>
        <div className='container-login'>
          <div className='logo-login'>
            <Link className='logoDesktop' to='/'><img src={whitelogo} alt="Logo" /></Link>
            <Link className='logoMobile' to='/'><img src={logoMobile} alt="Logo" /></Link>
          </div>

          <div className="content-login">
            <div className="content-reset-password">
              <div className="titulo-cadastro">
                <h1>Insira seu e-mail para redefinir a senha.</h1>
              </div>
              <p className="p-reset-password">Informe o acesso que deseja recuperar a senha.</p>
              <form className="form-reset" onSubmit={handlePasswordResetRequest}>
                <div className="info-content-reset">
                  <div className="container-input-reset">
                    <label htmlFor="email">E-mail:</label>
                    <input
                      placeholder="Digite seu e-mail"
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <p className="p-reset-password p-reset-color">
                  Ao continuar, afirmo que concordo com os <Link to="/" style={{ color: '#999' }}>Termos de Uso</Link> da JobLink.
                </p>
                <button type="submit">Continuar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}