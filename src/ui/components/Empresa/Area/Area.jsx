import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../../source/axiosInstance';
import CompanyName from '../CompanyName/CompanyName';
import Menu from '../Menu/Menu';
import { Link } from 'react-router-dom';
import BoxVagas from '../BoxVagas/BoxVagas';
import CurriculosRecomendados from '../CurriculosRecomendados/CurriculosRecomendados';
import Loading from '../../Loading/Loading';

import './areaEmpresa.css';

export default function Empresa() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [jobVacancies, setJobVacancies] = useState(0);
  const [applicationStatusCount, setApplicationStatusCount] = useState({
    approved: 0,
    inReview: 0,
    dismissed: 0
  });
  const [jobVacanciesInArea, setJobVacanciesInArea] = useState(0);

  const fetchCompany = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/list-company/');
      if (response.data) {
        const companyData = response.data;
        setCompany(companyData);
        fetchJobCount(companyData.branchOfActivity);

        const response2 = await axiosInstance.get('/api/user/candidate/list-candidates');
        setTotalCandidates(response2.data.length);
      }
    } catch (error) {
      console.error('Erro ao buscar a empresa:', error);
      toast.error('Erro ao buscar a empresa.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationStatusCount = async () => {
    try {
      const response = await axiosInstance.get('/api/user/company/vacancy/candidate-status-counts');
      if (response.status === 200) {
        setApplicationStatusCount({
          approved: response.data['Aprovado'] || 0,
          inReview: response.data['Em Análise'] || 0,
          dismissed: response.data['Dispensado'] || 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar a contagem de status das candidaturas:', error);
      toast.error('Erro ao buscar a contagem de status das candidaturas.');
    }
  };
  const fetchJobCount = async (branchOfActivity) => {
    try {
      const response = await axiosInstance.get(`/api/user/company/vacancy/list-vacancies`);
      const vacancies = response.data || [];
      const filteredVacancies = vacancies.filter(vacancy => vacancy.jobArea === branchOfActivity);
      setJobVacanciesInArea(filteredVacancies.length);
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
      toast.error("Erro ao buscar vagas!");
      setJobVacanciesInArea(0);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchApplicationStatusCount();
  }, []);

  if (loading) {
    return <Loading />;
  }

  let performanceClass = 'performance-bad'; // padrão para ruim
  let performanceText = 'Desempenho ruim';
  let performanceMood = 'Tente melhorar!'

  if (totalCandidates > jobVacancies) {
    performanceClass = 'performance-good'; // bom
    performanceText = 'Desempenho ótimo';
    performanceMood = 'Continue assim!'

  } else if (totalCandidates === jobVacancies) {
    performanceClass = 'performance-medium'; // médio
    performanceText = 'Desempenho médio';
    performanceMood = 'Continue assim!'
  }

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  return (
    <>
      <Menu setMenuOpen={setMenuOpen} />
      <main id='mainAdaptationCompany' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className='header-company'>
          <div className='company-name'>
            <CompanyName />
          </div>
          <div className='visualizacao'>
            <Link to="#">Pré-visualização</Link>
          </div>
        </section>

        <section className='dashboard-company'>
          <div className='container-dashboard-company'>
            <div className='left-box-company'>
              <div className='dashboard-company-geral' style={{marginBottom: '2vw'}}>
                <div className='dashboard-geral-title'>
                  <h1>Dashboard Geral</h1>
                  <Link to="/minhas-vagas" style={{ transform: 'rotate(45deg)' }}><i className="fa-solid fa-arrow-right"></i></Link>
                </div>

                <div className='candidate-vacancy-company'>
                  <div className='box-candidate-vacancy-company'>
                    <div className='company-number-geral'>
                      <h1>{jobVacancies}</h1>
                      <Link to="/minhas-vagas"><i className="fa-solid fa-plus"></i></Link>
                    </div>
                    <p>Número de vagas criadas</p>
                  </div>

                  <div className='box-candidate-vacancy-company'>
                    <div className='company-number-geral'>
                      <h1>{totalCandidates}</h1>
                      <Link to="/listar-candidatos">ver mais</Link>
                    </div>
                    <p>Candidaturas Totais</p>
                  </div>
                </div>

                <div className={`${performanceClass} performance`}>
                  <div className='company-performance-situation'>
                    <p>{performanceText}, há {totalCandidates} Candidaturas e {jobVacancies} vagas cadastradas.</p>
                    <p>{performanceMood}</p>
                  </div>
                  <i className="fa-solid fa-arrow-up"></i>
                </div>
              </div>

              <div className='dashboard-company-geral'>
                <div className='dashboard-geral-title'>
                  <h1>Sobre a Corporação</h1>
                  <Link to="/conta-empresa"><i className="fa-solid fa-pen"></i></Link>
                </div>
                <p style={{ color: '#c3c3c3', fontSize: '1vw' }}> {truncateText(company.description, 100)}</p>
              </div>
            </div>

            <div className='right-box-company'>
              <div className='vacancys-create-company'>
                <div className='area-employ-company'>
                  <div style={{ borderLeft: '1.3vw solid  #160E37' }} className='area-employ-company-title'>
                    <div className='dashboard-geral-title'>
                      <h2 style={{fontSize: '1.2vw', fontWeight: '500'}}>{company.branchOfActivity}</h2>
                      <p>{jobVacanciesInArea}</p>
                    </div>
                    <p style={{fontSize: '0.8vw', marginTop: '1vw', color: 'gray', fontWeight: '300'}}>Área de tecnologia está em alta</p>
                  </div>

                  <div style={{ borderLeft: '1.3vw solid #D0C900' }} className='area-employ-company-title'>
                    <div className='dashboard-geral-title'>
                      <h2 style={{fontSize: '1.2vw', fontWeight: '500'}}>Empregados</h2>
                      <p>{company.employeerNumber}</p>
                    </div>
                    <p style={{fontSize: '0.8vw', marginTop: '1vw', color: 'gray', fontWeight: '300'}}>Total de pessoas na sua empresa</p>
                  </div>
                </div>
              </div>

              <div className='analistic-vacancy-company'>
                <div className='analistic-vacancy'>
                  <div className='dashboard-geral-title'>
                    <h2 style={{fontSize: '1.6vw'}}>Análise de candidaturas</h2>
                    <Link to="/listar-candidatos"><i style={{ transform: 'rotate(310deg)' }} className="fa-solid fa-arrow-right"></i></Link>
                  </div>
                  <div className='analistic-situation-container'>
                    <div style={{ backgroundColor: '#160E37' }} className='analistic-situation'>
                      <p>Aprovado</p>
                      <div className='analistic-situation-number'>
                        <h2>{applicationStatusCount.approved}</h2>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#D0C900' }} className='analistic-situation'>
                      <p>Análise</p>
                      <div className='analistic-situation-number'>
                        <h2>{applicationStatusCount.inReview}</h2>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#720D0D' }} className='analistic-situation'>
                      <p>Dispensado</p>
                      <div className='analistic-situation-number'>
                        <h2>{applicationStatusCount.dismissed}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='company-name'>
                <div className='container-company-name'>
                  <div className='dashboard-geral-title'>
                    <h2>{company.companyName}</h2>
                    <Link to="/conta-empresa"><i className="fa-solid fa-pen"></i></Link>
                  </div>
                  <p>{company.crhCompanyData?.cnpj || company.employerCompanyData?.cnpj || company.liberalProfessionalData?.registrationDocument}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='area-empresa-content'>
          <div className='content-titulo-empresa'>
            <h2>Minhas Vagas</h2>
            <Link to="/minhas-vagas">Ver mais</Link>
          </div>
          <BoxVagas />
        </section>

        <section className='area-empresa-content'>
          <div className='content-titulo-empresa'>
            <h1>Currículos Recomendados</h1>
            <Link to='/listar-candidatos'>Ver mais</Link>
          </div>
          <CurriculosRecomendados />
        </section>
      </main>
    </>
  );
}
