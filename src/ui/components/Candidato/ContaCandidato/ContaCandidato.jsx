import React, { useState, useEffect } from 'react';
import Menu from "../Menu/Menu";
import MenuMobile from "../MenuMobile/MenuMobile"
import CandidateName from '../CandidateName/CandidateName';
import axiosInstance from '../../../../source/axiosInstance';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import { useUser } from '../../../../Context/UserContext';
import './ContaCandidato.css';

export function ContaCandidato() {
    const { handleLogout } = useUser();
    const [salaryValue, setSalaryValue] = useState('');
    const [salaryCurrency, setSalaryCurrency] = useState('');
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        candidateAddress: {
            publicPlace: '',
            number: '',
            city: '',
            state: ''
        },
        candidateTargetSalary: '',
    });
    const [candidate, setCandidate] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleSalaryChange = (e) => {
        setSalaryValue(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setSalaryCurrency(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Lida com a data de nascimento
        if (name === 'candidateBirth') {
            setFormData(prevData => ({
                ...prevData,
                candidateBirth: new Date(value)  // Atualizando a data corretamente
            }));
        } else if (['publicPlace', 'number', 'city', 'state'].includes(name)) {
            // Atualiza os dados do candidato
            setFormData(prevData => ({
                ...prevData,
                candidateAddress: {
                    ...prevData.candidateAddress,
                    [name]: value
                }
            }));
        } else {
            // Para outros campos
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Combina a moeda e o valor do salário
            const combinedSalary = `${salaryCurrency} ${salaryValue}`;

            // Atualiza o formData com a pretenção salarial antes de enviar para a API
            const updatedFormData = {
                ...formData,
                candidateTargetSalary: combinedSalary,  // Atualiza a pretenção salarial no formData
            };

            // Faz a requisição PUT para atualizar os dados do candidato
            const response = await axiosInstance.put(`/api/user/candidate/update-candidate/${candidate._id}`, updatedFormData);

            // Atualiza o estado com a resposta da API
            setFormData(response.data);
            toast.success('Conta atualizada com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar conta!');
        }
    };
    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await axiosInstance.get('api/user/candidate/list-candidate/');
                setFormData(response.data);
                setCandidate(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Erro ao buscar dados do candidato:', error);
            }
        };

        fetchCandidateData();
    }, []);

    const handleAlterarSenha = () => {
        setShowPasswordInfo(!showPasswordInfo);
    };

    useEffect(() => {
        // Função que atualiza a largura da tela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Adiciona o event listener para mudanças no tamanho da tela
        window.addEventListener('resize', handleResize);

        // Limpeza do event listener ao desmontar o componente
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Função que atualiza a largura da tela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Adiciona o event listener para mudanças no tamanho da tela
        window.addEventListener('resize', handleResize);

        // Limpeza do event listener ao desmontar o componente
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
            {windowWidth < 450 && <MenuMobile />}
            <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className="cabecalhoCandidato">
                    <div>
                        <CandidateName />
                    </div>
                </section>

                <section>
                    <div className='contaCandidato'>
                        <h2>Minha Conta</h2>
                    </div>
                </section>
                <section className='sectionCandidato'>
                    <form className='camposCandidato' onSubmit={handleSubmit}>

                        <div>
                            <label>Nome</label>
                            <input
                                type="text"
                                name="candidateName"
                                value={formData.candidateName || ''}
                                onChange={handleChange}
                                placeholder="Nome"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label>Telefone</label>
                            <InputMask
                                type="text"
                                name="candidatePhone"
                                value={formData.candidatePhone || ''}
                                onChange={handleChange}
                                mask="(99) 99999-9999"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div className="targetSalaryAccount">
                            <label>Pretenção Salarial ({formData.candidateTargetSalary})</label>
                            <div>
                                <select value={salaryCurrency} onChange={handleCurrencyChange} name="salaryCurrency">
                                    <option value="R$">R$ - Real Brasileiro</option>
                                    <option value="US$">US$ - Dólar Americano</option>
                                    <option value="€">€ - Euro</option>
                                    <option value="£">£ - Libra Esterlina</option>
                                    <option value="¥">¥ - Iene Japonês</option>
                                    <option value="₩">₩ - Won Sul-Coreano</option>
                                    <option value="A$">A$ - Dólar Australiano</option>
                                    <option value="C$">C$ - Dólar Canadense</option>
                                    <option value="₹">₹ - Rúpia Indiana</option>
                                    <option value="₽">₽ - Rublo Russo</option>
                                </select>
                                <input
                                    type="number"
                                    value={salaryValue}
                                    onChange={handleSalaryChange}
                                    placeholder="Digite o valor"
                                />
                            </div>
                        </div>
                        <div>
                            <label>CEP</label>
                            <InputMask
                                type="text"
                                name="candidateCEP"
                                value={formData.candidateCEP || ''}
                                onChange={handleChange}
                                mask="99999-999"
                                placeholder="88888-888"
                            />
                        </div>
                        <div>
                            <label>Endereço</label>
                            <input
                                type="text"
                                name="publicPlace"
                                value={formData.candidateAddress?.publicPlace || ''}
                                onChange={handleChange}
                                placeholder='Rua Direita'
                            />

                        </div>
                        <div>
                            <label>Cidade</label>
                            <input
                                type="text"
                                name="city" // O nome agora é "city"
                                value={formData.candidateAddress?.city || ''}
                                onChange={handleChange}
                                placeholder='Cidade'
                            />
                        </div>
                        <div>
                            <label>Estado</label>
                            <input
                                type="text"
                                name="state" // O nome agora é "state"
                                value={formData.candidateAddress?.state || ''}
                                onChange={handleChange}
                                placeholder='Estado'
                            />
                        </div>
                        <div>
                            <label>Número</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.candidateAddress?.number || ''}
                                onChange={handleChange}
                                placeholder='Número da residência'
                            />
                        </div>
                        <div>
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                onChange={handleChange}
                                value={formatDate(formData.candidateBirth) || ''}
                                name="candidateBirth"
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 14))
                                    .toISOString()
                                    .split('T')[0]}
                            />
                        </div>
                        <div>
                            <label>Gênero</label>
                            <input
                                type="text"
                                name="candidateGender"
                                value={formData.candidateGender || ''}
                                onChange={handleChange}
                                placeholder='Gênero'
                            />
                        </div>
                        <div>
                            <label>Estado Civil</label>
                            <input
                                type="text"
                                name="candidateCivilStatus"
                                value={formData.candidateCivilStatus || ''}
                                onChange={handleChange}
                                placeholder='Casado'
                            />
                        </div>
                        <div>
                            <label>Último Cargo</label>
                            <input
                                type="text"
                                name="candidateLastJob"
                                value={formData.candidateLastJob || ''}
                                onChange={handleChange}
                                placeholder='Último Cargo'
                            />
                        </div>
                        <div>
                            <label>Cargo Desejado</label>
                            <input
                                type="text"
                                name="desiredRole"
                                value={formData.desiredRole || ''}
                                onChange={handleChange}
                                placeholder='Cargo Desejado'
                            />
                        </div>
                        <div>
                            <label>Cidade Desejada</label>
                            <input
                                type="text"
                                name="desiredCity"
                                value={formData.desiredCity || ''}
                                onChange={handleChange}
                                placeholder='Cidade Desejada'
                            />
                        </div>
                        <div>
                            <label>Estado Desejado</label>
                            <input
                                type="text"
                                name="desiredState"
                                value={formData.desiredState || ''}
                                onChange={handleChange}
                                placeholder='Estado Desejado'
                            />
                        </div>
                        <div>
                            <div className='salvar-conta'>
                                <label>Área Hierárquica</label>
                                <input
                                    type="text"
                                    name="candidateHierarchicalArea"
                                    value={formData.candidateHierarchicalArea || ''}
                                    onChange={handleChange}
                                    placeholder='Área Hierárquica'
                                />
                                <div className='buttonsConta'>
                                    <button type='submit'>
                                        Salvar
                                    </button>

                                    <button id='buttonContaSair' onClick={handleLogout}>
                                        Sair da Conta
                                    </button>
                                </div>

                            </div>

                        </div>

                        <div className='senha-salvar'>
                            <div className={`senha-candidato ${showPasswordInfo ? 'expanded' : ''}`}>
                                <button type='button' onClick={handleAlterarSenha}>Alterar senha <i className="fa-solid fa-chevron-right"></i></button>

                                {showPasswordInfo && (
                                    <div className={`password-info-candidato ${showPasswordInfo ? 'enter' : 'exit'}`}>
                                        <div className='content-password-info-candidato'>
                                            <p>Nova senha:</p>
                                            <input type="password" placeholder="Nova Senha" />
                                        </div>

                                        <div className='content-password-info-candidato'>
                                            <p>Confirmar senha:</p>
                                            <input type="password" placeholder="Confirme a nova Senha" />
                                        </div>

                                    </div>
                                )}
                            </div>

                        </div>

                    </form>
                </section>
            </main>
        </>
    );
}

export default ContaCandidato;