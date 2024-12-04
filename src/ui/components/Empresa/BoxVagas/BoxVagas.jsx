import './BoxVagas.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../source/axiosInstance';

export default function BoxVagas({ vacancies }) {
    const [jobVacancies, setJobVacancies] = useState([]);

    useEffect(() => {
        const fetchJobVacancies = async () => {
            try {
                const response = await axiosInstance.get('/api/user/company/vacancy/company-vacancies/');
                setJobVacancies(response.data);
            } catch (error) {
                console.error('Erro ao buscar as vagas:', error);
            }
        };

        if (vacancies && vacancies.length > 0) {
            setJobVacancies(vacancies);
        } else {
            fetchJobVacancies();
        }
    }, [vacancies]);

    const truncateDescription = (description, maxLength = 100) => {
        if (!description) return '';
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + '...';
    };

    return (
        <section className="minhas-vagas cabecalhoCandidato">
            <div className='container-minhas-vagas'>
                {jobVacancies.length === 0 ? (
                    <p className='sem-informacoes'>Nenhuma vaga encontrada.</p>
                ) : (
                    jobVacancies.map((job) => (
                        <div className='content-minhas-vagas' key={job._id}>
                            <div className='content-infos-minhas-vagas'>
                                <div className='content-titulo-minhas-vagas'>
                                    <h1>{job.jobTitle}</h1>
                                    <Link to={`/editar-vaga/${job._id}`}>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                </div>
                                <h3 className='area-atuacao'>{job.jobArea}</h3>
                                <h4>Faixa salarial: {job.salary}</h4>
                                <p>{truncateDescription(job.jobDescription)}</p>
                            </div>
                            <div className='content-area-minhas-vagas'>
                                <Link to={`/editar-vaga/${job._id}`}>Detalhes</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
