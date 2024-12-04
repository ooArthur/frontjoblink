import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { toast } from 'sonner';
import whitelogo from '/whitelogo.svg';
import logoMobile from './../assets/images/JL (1).svg'
import '../assets/style/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useUser();

  useEffect(() => {
    if (user) {
      const path = {
        'Candidate': '/area-candidato',
        'Admin': '/area-administrador',
        'Company': '/area-empresa'
      }[user.role] || '/';
      navigate(path);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      // Exibe a mensagem de erro recebida da API
      toast.error(error.message || 'Erro ao fazer login'); // Usa message do erro
    } finally {
      setIsLoading(false);
    }
  };

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


          <div className='content-login'>
            <div className='titulo-cadastro'>
              <h1>Olá! Faça seu login.</h1>
            </div>
            <form className='form-login' onSubmit={handleLogin}>
              <div className='info-content-login'>
                <div className='container-input-login'>
                  <label htmlFor="email">E-mail:</label>
                  <input
                    placeholder='Digite seu e-mail'
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='container-input-login'>
                  <div className='senha-login'>
                    <label htmlFor="password">Senha:</label>
                    <Link to="/forgot-password">Esqueceu sua senha?</Link>
                  </div>
                  <div className="senha-container">
                    <input
                      placeholder='Digite sua senha'
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? <i className="fa-solid fa-eye"></i>
                        : <i className="fa-solid fa-eye-slash"></i>
                      }
                    </button>
                  </div>
                </div>

                <div className='container-input-login'>
                  <div className="container-rememberMe">
                    <input type="checkbox" id='rememberMe' />
                    <label htmlFor="rememberMe"> Lembre-se de mim.</label>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className='cadastro-login'>
              <p>Ainda não possui uma conta? </p>
              <Link to="/cadastro">Cadastre-se</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}