import Menu from "../Menu/Menu";
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import { Link } from 'react-router-dom';

import './AreaAdmin.css';

function Admin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalVacancies, setTotalVacancies] = useState(0);
  const [totalReports, setTotalReports] = useState(0);  // Denúncias
  const [totalApplications, setTotalApplications] = useState(0);

  const [approvedApplications, setApprovedApplications] = useState(0);
  const [dismissedApplications, setDismissedApplications] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  const [totalWarnings, setTotalWarnings] = useState(0);  // Avisos
  const [totalBanned, setTotalBanned] = useState(0);      // Banimentos

  // Obtém a data atual e formata
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // Função para obter os dados do backend
    const fetchData = async () => {
      try {
        // Fazendo as requisições de denúncias separadamente
        const [usersRes, companiesRes, candidatesRes, vacanciesRes, reportsRes, statusCountsRes] = await Promise.all([
          axiosInstance.get('/api/user/list-users'),
          axiosInstance.get('/api/user/company/list-companies'),
          axiosInstance.get('/api/user/candidate/list-candidates'),
          axiosInstance.get('/api/user/company/vacancy/list-vacancies'),
          axiosInstance.get('/api/report/list-reports'),
          axiosInstance.get('/api/user/company/vacancy/admin/candidate-status-counts')
        ]);

        // Atualiza os estados com os dados recebidos
        setTotalUsers(usersRes.data.length);
        setTotalCompanies(companiesRes.data.length);
        setTotalCandidates(candidatesRes.data.length);
        setTotalVacancies(vacanciesRes.data.length);
        setTotalReports(reportsRes.data.length); // Mantenho a funcionalidade de denúncias

        // Atualiza as contagens de candidaturas por status
        setApprovedApplications(statusCountsRes.data.approved);
        setPendingApplications(statusCountsRes.data.inAnalysis);
        setDismissedApplications(statusCountsRes.data.dismissed);

      } catch (error) {
        console.error("Erro ao carregar os dados do dashboard: ", error);
      }
    };

    // Função separada para puxar avisos e banimentos
    const fetchWarningsAndBanned = async () => {
      try {
        const warningsAndBannedRes = await axiosInstance.get('/api/report/warn-overview');
        console.log(warningsAndBannedRes.data.totalWarnings)
        // Atualiza os estados com os dados de avisos e banimentos
        setTotalWarnings(warningsAndBannedRes.data.totalWarnings);
        setTotalBanned(warningsAndBannedRes.data.totalBanned);
      } catch (error) {
        console.error("Erro ao carregar avisos e banimentos: ", error);
      }
    };

    // Executa ambas as funções
    fetchData();
    fetchWarningsAndBanned();
  }, []);

  return (
    <>
      <Menu setMenuOpen={setMenuOpen} />

      <main id='mainAdaptation' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className='header-adm'>
          <h1>Olá, Administrador</h1>
          <div className='dashboard-titulo'>
            <p className="Date">{dataFormatada}</p>
            <h1>Dashboard</h1>
          </div>
        </section>

        <section className='dashboard-adm'>
          <div className='container-dashboard'>
            <div className='left-content-dashboard'>
              <div className='creat-users'>
                <div className='titulo-link-dashboard'>
                  <h1>Usuários criados</h1>
                  <Link to="/crud-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                </div>

                <div className='dados-titulo'>
                  <h1>{totalUsers}</h1>
                </div>
                <p>Verificar informações dos usuários</p>
              </div>
              <div className='empresas-candidatos'>
                <div className='titulo-link-dashboard'>
                  <h1>Empresas</h1>
                  <Link to="/crud-administrador">Ver mais</Link>
                </div>
                <div className='dados-titulo'>
                  <h1>{totalCompanies}</h1>
                </div>
                <p>Empresas cadastradas na plataforma</p>
              </div>
              <div className='empresas-candidatos'>
                <div className='titulo-link-dashboard'>
                  <h1>Candidatos</h1>
                  <Link to="/crud-administrador">Ver mais</Link>
                </div>
                <div className='dados-titulo'>
                  <h1>{totalCandidates}</h1>
                </div>

                <p>Candidatos cadastrados na plataforma</p>
              </div>
            </div>
            <div className='center-content-dashboard'>

              <div className='analise-candidaturas'>
                <div className='header-analise-candidaturas'>
                  <div className='titulo-link-dashboard'>
                    <h1>Analise das candidaturas</h1>
                    <Link to="/crud-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                  </div>
                  <p>Todas as candidaturas da plataforma</p>
                </div>

                <div className='situacao-candidaturas'>
                  <div className='content-situacao-candidaturas aprovados'>
                    <p>Aprovados</p>
                    <h1>{approvedApplications}</h1>
                  </div>
                  <div className='content-situacao-candidaturas analise'>
                    <p>Em análise</p>
                    <h1>{pendingApplications}</h1>
                  </div>
                  <div className='content-situacao-candidaturas dispensados'>
                    <p>Dispensados</p>
                    <h1>{dismissedApplications}</h1>
                  </div>
                </div>
              </div>

              <div className='analise-candidaturas'>
                <div className='header-analise-candidaturas'>
                  <div className='titulo-link-dashboard'>
                    <h1>Balanço geral</h1>
                    <Link to="/relatorio-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                  </div>
                  <p>Balanço entre candidatos, vagas e currículos enviados</p>
                </div>

                <div className='balanco-geral'>
                  <div className='candidaturas-vagas'>
                    <h1>Candidaturas por vagas</h1>
                    <h2 style={{fontSize: '1.8vw'}}>{totalApplications} <span style={{ color: 'forestgreen'}}> / {totalVacancies}</span></h2>
                  </div>

                  <div className='vagas-curriculos'>
                    <h1>Vagas criadas e curriculos enviados</h1>

                    <div className='vagas-curriculos-box'>
                      <div className='vagas-curriculos-content'>
                        <div className='titulo-link-dashboard'>
                          <p>Vagas criadas</p>
                          <Link to="/relatorio-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                        <h2>{totalVacancies}</h2>
                      </div>
                      <div className='vagas-curriculos-content'>
                        <div className='titulo-link-dashboard'>
                          <p>Curriculos enviados</p>
                          <Link to="/relatorio-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                        </div>
                        <h2>{totalApplications}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='right-content-dashboard'>
              <div className='box-denuncias'>
                <div className='denuncias'>
                  <div className='titulo-link-dashboard'>
                    <h2>Denúncias</h2>
                    <Link to="/denuncias-administrador"><i className="fa-solid fa-arrow-right"></i></Link>
                  </div>
                  <h1>{totalReports}</h1> {/* Denúncias */}
                  <p>Averiguar denúncias</p>
                </div>

                <div className='avisos'>
                  <h2>Avisos</h2>
                  <div className='ver-mais-avisos'>
                    <h1>{totalWarnings}</h1> {/* Exibe o número de avisos */}
                    <Link to="/denuncias-administrador">Ver mais</Link>
                  </div>
                </div>

                <div className='avisos'>
                  <h2>Banimentos</h2>
                  <div className='ver-mais-avisos'>
                    <h1>{totalBanned}</h1> {/* Exibe o número de banimentos */}
                    <Link to="/denuncias-administrador">Ver mais</Link>
                  </div>
                </div>
              </div>

              <div className='adicionar-ver-mais'>
                <div className='botao-criar-ver-mais'>
                  <Link to="/crud-administrador">+</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Admin;