import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Pre-Visualizacao.css';
import axiosInstance from '../../../../source/axiosInstance';

export function PreVisualizacao() {
  const [candidate, setCandidate] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/candidate/list-candidate/${id}`);
        setCandidate(response.data);
      } catch (error) {
        console.error('Erro ao buscar os candidato:', error);
      }
    };

    fetchCandidate();
  }, [id]);

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

  function formatDate(date) {
    if (!date) return ''; // Retorna vazio se a data não estiver definida
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }

  return (
    <>
      <section className='pre-visualizacao'>
        <header>
          <div className='header'>
            <div className='class-icon'>
              <button onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i></button>
            </div>

            <div className='perfil-pre-visualizacao'>
              <span className="material-symbols-outlined">person</span>
              <h3>{candidate.candidateName}</h3>
              <h4>{candidate.areaOfInterest || 'Qualquer área'}</h4>
            </div>
          </div>
        </header>

        <div className='infos-pre-visualizacao'>

          <div className='info-perfil info-perfil-borda'>
            <h3>Perfil</h3>
            <div className='info-perfil-visualizacao'>
              <div className='lado-esquerdo-perfil'>
                <p>{candidate.candidateName}</p>
                <p>{candidate.areaOfInterest || 'Qualquer área'}</p>
              </div>
              <div className='lado-direito-perfil'>
                <p>{candidate.candidatePhone}</p>
                <p>{candidate.email}</p>
              </div>
            </div>
          </div>

          <div className='alinhamento-perfil info-perfil-borda'>
            <div className='lado-esquerdo-perfil'>
              <h3>Pretenções</h3>
              <p>Cidade - {candidate.desiredCity}</p>
              <p>Estado - {candidate.desiredState}</p>
              <p>Salário Pretendido - {candidate.candidateTargetSalary}</p>
            </div>
            <div className='lado-direito-perfil'>
              <h3>Contato</h3>
              <p>CEP - {candidate.candidateCEP}</p>
              <p>{candidate.candidateAddress?.neighborhood}</p>
              <p>{candidate.candidateAddress?.publicPlace}</p>
            </div>
          </div>

          <div className='alinhamento-perfil info-perfil-borda'>
            <div className='lado-esquerdo-perfil'>
              <h3>Informações pessoais</h3>
              <p>{candidate.candidateCivilStatus}</p>
              <p>{candidate.candidateGender}</p>
              <p>{ageCalculator(candidate.candidateBirth)} Anos</p>
            </div>
            <div className='lado-direito-perfil'>
              <h3>Histórico</h3>
              <p>{candidate.candidateLastJob}</p>
              <p>{candidate.candidateHierarchicalArea}</p>
            </div>
          </div>

          <div className='alinhamento-perfil info-perfil-borda'>
            <div className='lado-esquerdo-perfil'>
              <h3>Idiomas</h3>
              {Array.isArray(candidate.candidateIdioms) && candidate.candidateIdioms.map((idiom, index) => (
                <p key={index}>- {idiom.name}  {idiom.level}</p>
              ))}
            </div>
            <div className='lado-direito-perfil'>
              <h3>Cursos</h3>
              {Array.isArray(candidate.candidateCourses) && candidate.candidateCourses.map((course, index) => (
                <p key={index}> {course.name}  {course.institution}  {course.duration} {course.conclusionYear}</p>
              ))}
            </div>
          </div>

          <div className='alinhamento-perfil-dois info-perfil-borda'>
            <h3>Experiência Profissional</h3>
            {Array.isArray(candidate.candidateExperience) && candidate.candidateExperience.map((experience, index) => (
              <p key={index}>
                {experience.role}  {experience.company}  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}  {experience.salary} {experience.mainActivities}
              </p>
            ))}
          </div>

          <div className='alinhamento-perfil-dois info-perfil-borda'>
            <h3>Qualificação</h3>
            {Array.isArray(candidate.candidateQualifications) && candidate.candidateQualifications.map((qualification, index) => (
              <p key={index}> {qualification.description}</p>
            ))}
          </div>

          <div className='alinhamento-perfil-dois info-perfil-borda'>
            <h3>Sobre o {candidate.candidateName}</h3>
            <p>{candidate.candidateAbout}</p>
          </div>

        </div>
      </section>
    </>
  );
}

export default PreVisualizacao;
