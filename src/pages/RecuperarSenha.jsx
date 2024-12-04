import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../source/axiosInstance'; // Importa o axiosInstance
import whitelogo from '/whitelogo.svg';
import logoMobile from './../assets/images/JL (1).svg'
import '../assets/style/recuperarSenha.css';

export default function RecuperarSenha() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token inválido ou ausente.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      await axiosInstance.post(`/api/user/reset-password?token=${token}`, { newPassword });
      toast.success('Senha redefinida com sucesso.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao redefinir a senha.');
    }
  };

  return (
    <section className="login">
      <Link className="voltar" href="/login">
        <i style={{ color: 'white' }} className="fa-solid fa-chevron-left"></i>
      </Link>


      <div className='box-login'>
                <div className='container-login'>
                    <div className='logo-login'>
                        <Link className='logoDesktop' to='/'><img src={whitelogo} alt="Logo" /></Link>
                        <Link className='logoMobile' to='/'><img src={logoMobile} alt="Logo" /></Link>
                    </div>

          <div className="content-login">
            <div className="content-reset-password">
              <div className="titulo-cadastro">
                <h1>Verifique seu e-mail e insira uma nova senha.</h1>
              </div>
              <form className="form-reset" onSubmit={handlePasswordReset}>
                <div className="info-content-reset">
                  <div className="container-input-recovery">
                    <label htmlFor="newPassword">Nova Senha:</label>
                    <input
                      placeholder="Digite sua nova senha"
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="container-input-recovery">
                    <label htmlFor="confirmPassword">Confirmar Senha:</label>
                    <input
                      placeholder="Confirme sua nova senha"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="recuperar-senha-button">
                  <button type="submit">Alterar Senha</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}