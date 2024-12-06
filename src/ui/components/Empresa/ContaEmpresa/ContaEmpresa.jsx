import React, { useState, useEffect } from 'react';
import Menu from "../Menu/Menu";
import MenuMobile from '../MenuMobile/MenuMobile';
import CompanyName from '../CompanyName/CompanyName';
import axiosInstance from '../../../../source/axiosInstance';
import { toast } from 'sonner';
import axios from 'axios';
import Loading from '../../Loading/Loading'
import InputMask from 'react-input-mask';
import bcrypt from 'bcryptjs';

export default function ContaEmpresa() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [company, setCompany] = useState(null);
    const [typeCompany, setTypeCompany] = useState(null);
    const [typeCompanyHelper, setTypeCompanyHelper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [iconeAtivo, setIconeAtivo] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { handleLogout } = useUser();

    const areas = [
        'Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia',
        'Marketing', 'Vendas', 'Recursos Humanos', 'Administração',
        'Jurídico', 'Logística', 'Atendimento ao Cliente',
        'Design', 'Operações', 'Construção Civil'
    ];

    const buscarEndereco = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                const { logradouro, localidade, uf } = response.data;
                setFormData(prevData => ({
                    ...prevData,
                    address: {
                        ...prevData.address,
                        publicPlace: logradouro,
                        city: localidade,
                        state: uf,
                        cep: cep
                    }
                }));
            } else {
                console.log("Endereço não encontrado.");
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('address.')) {
            // Para campos dentro de 'address'
            const addressKey = name.split('.')[1];
            setFormData(prevData => ({
                ...prevData,
                address: {
                    ...prevData.address,
                    [addressKey]: value
                }
            }));
        } else if (typeCompany === 'Empresa de CRH' || typeCompany === 'Empresa Empregadora') {
            const specificDataKey = typeCompany === 'Empresa de CRH' ? 'crhCompanyData' : 'employerCompanyData';
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
                [specificDataKey]: {
                    ...prevData[specificDataKey],
                    [name]: value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        if (name === 'cep') {
            buscarEndereco(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepara os dados para atualização da empresa
        let updatedFormData = { ...formData };

        // Verifica se a senha foi alterada
        const isPasswordChanged = newPassword && currentPassword;

        // Se a senha foi alterada, primeiro valida a senha atual e a nova senha

        if (isPasswordChanged) {
            // Verifica se a senha atual está correta
            const isPasswordValid = await bcrypt.compare(currentPassword, company.password);

            console.log("Senhas são iguais?", isPasswordValid); // True ou False

            if (!isPasswordValid) {
                toast.error('A senha atual está incorreta.');
                return;
            }

            // Verifica se a nova senha tem pelo menos 8 caracteres
            if (newPassword.length < 8) {
                toast.error('A nova senha deve ter pelo menos 8 caracteres.');
                return;
            }

            // Verifica se a nova senha e a confirmação coincidem
            if (newPassword !== newPasswordConfirmation) {
                toast.error('A nova senha e a confirmação não coincidem.');
                return;
            }

            // Criptografa a nova senha antes de enviá-la ao backend
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updatedFormData.password = hashedPassword;
            toast.success('Senha atualizada com sucesso!');

        }

        try {
            const response = await axiosInstance.put(
                `/api/user/company/update-company/${company._id}`,
                updatedFormData
            );

            setFormData(response.data);
            setCompany(response.data);
            toast.success('Conta atualizada com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar conta!');
            console.error('Erro ao atualizar:', error);
        }
    };



    const fetchCompany = async () => {
        try {
            const response = await axiosInstance.get('/api/user/company/list-company/');
            if (response.data) {
                const companyData = response.data;
                setCompany(companyData);
                setTypeCompany(companyData.type);
                setFormData({
                    ...companyData,
                    ...companyData[typeCompany],
                    address: companyData.address || {}
                });

                switch (companyData.type) {
                    case 'Profissional Liberal':
                        setTypeCompanyHelper(companyData.liberalProfessionalData);
                        break;
                    case 'Empresa de CRH':
                        setTypeCompanyHelper(companyData.crhCompanyData);
                        break;
                    case 'Empresa Empregadora':
                        setTypeCompanyHelper(companyData.employerCompanyData);
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error('Erro ao buscar a empresa:', error);
            toast.error('Erro ao buscar a empresa.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const handleAlterarSenha = () => {
        setShowPasswordInfo(!showPasswordInfo);
        setIconeAtivo(!iconeAtivo);

    };



    return (
        <>
            {windowWidth > 450 && <Menu setMenuOpen={setMenuOpen} />}
            {windowWidth < 450 && <MenuMobile />}
            <main className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
                <section className="cabecalhoCandidato">
                    <div>
                        <CompanyName />
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
                            <label>Nome da Empresa:</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder={company.companyName || 'Nome da empresa'}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={company.email || 'Email'}
                            />
                        </div>
                        <div>
                            <label>Telefone:</label>
                            <InputMask
                                type="text"
                                mask="(99) 99999-9999"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                placeholder={company.telephone || '(11) 99999-9999'}
                            />
                        </div>
                        <div>
                            <label>Número de empregados:</label>
                            <input
                                type="text"
                                name="employeerNumber"
                                value={formData.employeerNumber || ''}
                                onChange={handleChange}
                                placeholder={company.employeerNumber || ''}
                            />
                        </div>
                        {typeCompany === 'Profissional Liberal' && (
                            <>
                                <div>
                                    <label>CPF:</label>
                                    <InputMask
                                        type="text"
                                        mask="999.999.999-99"
                                        name="cpf"
                                        value={formData.liberalProfessionalData.cpf || ''}
                                        onChange={handleChange}
                                        placeholder='CPF da empresa'
                                    />
                                </div>
                                <div>
                                    <label>Documento de Registro:</label>
                                    <InputMask
                                        type="text"
                                        mask="99.999.999-9"
                                        name="registrationDocument"
                                        value={formData.liberalProfessionalData.registrationDocument || ''}
                                        onChange={handleChange}
                                        placeholder='Documento de Registro'
                                    />
                                </div>
                                <div>
                                    <label>Número de Registro:</label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.liberalProfessionalData.registrationNumber || ''} // Use apenas formData
                                        onChange={handleChange}
                                        placeholder='Número de Registro'
                                    />
                                </div>
                            </>
                        )}
                        {typeCompany === 'Empresa de CRH' && (
                            <>
                                <div>
                                    <label>CNPJ:</label>
                                    <InputMask
                                        type="text"
                                        mask="99.999.999/9999-99"
                                        placeholder='CNPJ da empresa'
                                        onChange={handleChange}
                                        value={formData.crhCompanyData?.cnpj || ''}
                                        name="cnpj"
                                    />
                                </div>
                                <div>
                                    <label>Razão Social:</label>
                                    <input
                                        type="text"
                                        name="socialReason"
                                        value={formData.crhCompanyData?.socialReason || ''} // Use o operador de encadeamento opcional
                                        onChange={handleChange}
                                        placeholder='Razão Social'
                                    />
                                </div>
                                <div>
                                    <label>Nome Fantasia:</label>
                                    <input
                                        type="text"
                                        name="fantasyName"
                                        value={formData.crhCompanyData?.fantasyName || ''} // Use o operador de encadeamento opcional
                                        onChange={handleChange}
                                        placeholder='Nome Fantasia'
                                    />
                                </div>
                            </>
                        )}

                        {typeCompany === 'Empresa Empregadora' && (
                            <>
                                <div>
                                    <label>CNPJ:</label>
                                    <InputMask
                                        type="text"
                                        mask="99.999.999/9999-99"
                                        name="cnpj"
                                        value={formData.crhCompanyData?.cnpj || ''}
                                        onChange={handleChange}
                                        placeholder='CNPJ da empresa'
                                    />
                                </div>
                                <div>
                                    <label>Razão Social:</label>
                                    <input
                                        type="text"
                                        name="socialReason"
                                        value={formData.crhCompanyData?.socialReason || ''} // Use o operador de encadeamento opcional
                                        onChange={handleChange}
                                        placeholder='Razão Social'
                                    />
                                </div>
                                <div>
                                    <label>Nome Fantasia:</label>
                                    <input
                                        type="text"
                                        name="fantasyName"
                                        value={formData.crhCompanyData?.fantasyName || ''} // Use o operador de encadeamento opcional
                                        onChange={handleChange}
                                        placeholder='Nome Fantasia'
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label>CEP:</label>
                            <InputMask
                                type="text"
                                mask="99999-999"
                                placeholder={company?.address.cep || '88888-888'}
                                value={formData.address?.cep || ''}
                                onChange={handleChange}
                                name="address.cep"
                            />
                        </div>
                        <div>
                            <label>Endereço:</label>
                            <input
                                type="text"
                                name="address.publicPlace"
                                value={formData.address?.publicPlace || ''}
                                onChange={handleChange}
                                placeholder={company?.address.publicPlace || 'Rua Direita'}
                            />
                        </div>
                        <div>
                            <label>Número:</label>
                            <input
                                type="text"
                                name="address.number"
                                value={formData.address?.number || ''}
                                onChange={handleChange}
                                placeholder={company?.address.number || 'Número da residência'}
                            />
                        </div>
                        <div>
                            <label>Cidade:</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address?.city || ''}
                                onChange={handleChange}
                                placeholder={company?.address.city || 'Cidade'}
                            />
                        </div>
                        <div>
                            <label>Estado:</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address?.state || ''}
                                onChange={handleChange}
                                placeholder={company?.address.state || 'Estado'}
                            />
                        </div>
                        <div>
                            <label>Complemento:</label>
                            <input
                                type="text"
                                name="address.complement"
                                value={formData.address?.complement || ''}
                                onChange={handleChange}
                                placeholder={company?.address.complement || 'Complemento do endereço'}
                            />
                        </div>
                        <div className="branchOfAct">
                            <label>Ramo de atividade:</label>
                            <select name="branchOfActivity" onChange={handleChange} >
                                <option value="">{formData.branchOfActivity || company.branchOfActivity}</option>
                                {areas.map((area, index) => (
                                    <option key={index} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Site:</label>
                            <input
                                type="text"
                                name="site"
                                value={formData.site || company.site} // Use formData para edição
                                onChange={handleChange}
                                placeholder={company.site || 'Site'}
                            />
                        </div>
                        <div>

                            <label>Posição:</label>
                            <input
                                type="text"
                                name="positionInTheCompany"
                                value={formData.positionInTheCompany || company.positionInTheCompany} // Use formData para edição
                                onChange={handleChange}
                                placeholder={company.positionInTheCompany || 'Seu cargo na empresa'}
                            />

                        </div>

                        <div className='alinhamento-salvar'>

                            <div className='senha-salvar'>
                                <div className={`senha-candidato ${showPasswordInfo ? 'expanded' : ''}`}>
                                    <button type='button' onClick={handleAlterarSenha}>Alterar senha <i className="fa-solid fa-chevron-right"></i></button>

                                    {showPasswordInfo && (
                                        <div className={`password-info-candidato ${showPasswordInfo ? 'enter' : 'exit'}`}>
                                            <div className='content-password-info-candidato'>
                                                <p>Senha atual:</p>
                                                <input
                                                    type="password"
                                                    placeholder="Senha atual"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className='content-password-info-candidato'>
                                                <p>Nova senha:</p>
                                                <input
                                                    type="password"
                                                    placeholder="Nova senha"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className='content-password-info-candidato'>
                                                <p>Confirmar nova senha:</p>
                                                <input
                                                    type="password"
                                                    placeholder="Confirmar nova senha"
                                                    value={newPasswordConfirmation}
                                                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                                />
                                            </div>

                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className='descricaoEmpresaMobile'>

                                <label>Descrição:</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description || company.description}
                                    onChange={handleChange}
                                    placeholder={company.description || 'Sobre a empresa'}
                                />

                            </div>

                            <div className='salvar-empresa'>
                                <button id="buttonSalvarEmpresa" type="submit">Salvar Alterações</button>
                                <button id="buttonSairEmpresa" onClick={handleLogout}>Sair da Conta</button>
                            </div>
                        </div>

                    </form>
                </section>
            </main>
        </>
    );
}
