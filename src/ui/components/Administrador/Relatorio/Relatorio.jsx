import Menu from "../Menu/Menu";
import React, { useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import './Relatorio.css';

function Relatorio() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [message, setMessage] = useState('');

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const fetchLogs = async (date) => {
        try {
            const response = await axiosInstance.post('/api/user/logs', { date });
            if (response.data.logs.length === 0) {
                setMessage('Sem log nessa data');
                setLogs([]);
            } else {
                setMessage('');
                setLogs(response.data.logs.split('\n'));
            }
        } catch (error) {
            console.error("Erro ao buscar logs:", error.response ? error.response.data.error : error.message);
            setMessage('Erro ao buscar logs: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedDate) {
            fetchLogs(selectedDate);
        }
    };

    const formatLog = (log, index) => {
        const regex = /^(.*?)(\s\[(INFO|WARN|ERROR)\])?\s*:\s*(IP:\s[\d.]+)\s*-\s*(.*)$/;
        const match = log.match(regex);

        console.log('Log:', log); // Para verificar o log original
        console.log('Match:', match); // Para verificar a correspondência do regex

        if (match) {
            const datePart = match[1];
            const levelPart = match[2] || '';
            const ipPart = match[4];
            const messagePart = match[5];

            let levelClass = '';
            if (match[3]) {
                switch (match[3]) {
                    case 'INFO':
                        levelClass = 'log-info';
                        break;
                    case 'WARN':
                        levelClass = 'log-warn';
                        break;
                    case 'ERROR':
                        levelClass = 'log-error';
                        break;
                    default:
                        levelClass = '';
                }
            }

            console.log('Level Class:', levelClass);

            return (
                <p key={`${log}-${index}`} className="log-test"> {/* Classe de teste */}
                    <span>
                        {datePart}{levelPart}: {ipPart} - 
                    </span>
                    <span className="log-bold">{messagePart}</span>
                </p>
            );
        }
        return <p key={`${log}-${index}`}>{log}</p>;
    };

    return (
        <>
            <Menu setMenuOpen={setMenuOpen} />

            <main id='mainAdaptation' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className='header-adm mainAdm'>
                    <h1>Olá, Administrador</h1>
                    <div className='dashboard-titulo logh1'>
                        <p className="Date">{dataFormatada}</p>
                        <h1>Relatório</h1>
                    </div>
                </section>

                <section className='candidateArea sectionLog'>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="date"
                            style={{fontSize: "1.2vw"}}
                            value={selectedDate}
                            onChange={handleDateChange}
                            required
                        />
                        <button type="submit">Buscar Logs</button>
                    </form>

                    <div className="divLog">
                        {message && <p>{message}</p>}
                        {logs.map(formatLog)}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Relatorio;
