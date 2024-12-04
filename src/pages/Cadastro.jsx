import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCadastro from '../assets/images/imageCadastro.svg';
import whitelogo from '/whitelogo.svg';
import logoMobile from './../assets/images/JL (1).svg'
import axiosInstance from '../source/axiosInstance';
import debounce from 'lodash.debounce';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import { frontserver } from "../source/api";

import '../assets/style/Cadastro.css';  

export default function Cadastro() {
  const [tipo, setTipo] = useState('');
  const [tipoEmpresa, setTipoEmpresa] = useState('');
  const [formData, setFormData] = useState({});
  const [cep, setCep] = useState('');
  const [emailInUse, setEmailInUse] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [salaryValue, setSalaryValue] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('');
  const navigate = useNavigate();

  const areas = [
    'Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Engenharia',
    'Marketing', 'Vendas', 'Recursos Humanos', 'Administração',
    'Jurídico', 'Logística', 'Atendimento ao Cliente',
    'Design', 'Operações', 'Construção Civil'
  ];

  function formatTelephone(value) {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  const handleEmailChange = (e) => {
    handleInputChange(e);
    const { value } = e.target;
  };

  const handleChangeTipo = (event) => {
    setTipo(event.target.value);
    setTipoEmpresa('');
    setFormData({});
  };

  const handleChangeTipoEmpresa = (event) => {
    setTipoEmpresa(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo: ${name}, Valor: ${value}`);
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setFormData((prevState) => ({
        ...prevState,
        [outerKey]: {
          ...prevState[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data && !response.data.erro) {
        const { logradouro, bairro, localidade, uf } = response.data;
        if (tipo === 'Candidato') {
          setFormData((prevData) => ({
            ...prevData,
            candidateAddress: {
              publicPlace: logradouro,
              neighborhood: bairro,
              city: localidade,
              state: uf,
              cep: cep,
              number: prevData.candidateAddress?.number || ''
            },
          }));
        } else if (tipo === 'Empresa') {
          setFormData((prevData) => ({
            ...prevData,
            address: {
              publicPlace: logradouro,
              neighborhood: bairro,
              city: localidade,
              state: uf,
              cep: cep,
              number: prevData.address?.number || ''
            },
          }));
        }
      } else {
        console.log("Endereço não encontrado.");
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
    }
  };

  const onChangeCep = async (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setCep(value);
    if (value.length === 8) {
      await buscarEndereco(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailInUse) {
      alert('O e-mail já está em uso.');
      return;
    }

/*     const formattedCep = cep.replace(/(\d{5})(\d{3})/, "$1-$2"); */
    const formattedTelephone = formData.candidatePhone?.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") || '';

    const combinedSalary = `${salaryCurrency || 'R$'} ${salaryValue}`;

    const formattedDataC = {
      ...formData,
      candidateTargetSalary: combinedSalary,
      candidateCEP: /* formattedCep */cep,
      candidatePhone: formattedTelephone,
      candidateAddress: {
        ...formData.candidateAddress
      }
    };

    const formattedDataE = {
      ...formData,
      type: tipoEmpresa
    };

    const url = tipo === 'Candidato' ? '/api/user/candidate/create-candidate' : '/api/user/company/create-company';

    if (tipo === "Candidato") {
      try {
        const response = await axiosInstance.post(url, formattedDataC);
        if (response.status >= 200 && response.status < 300) {
          window.location.href = `${frontserver}/login`;
        } else {
          toast.error("Erro:" + response.data.error)
          throw new Error(response.data.message); 
        }
      } catch (error) {
        toast.error("Erro: " + error?.response?.data?.error)
        console.error("Erro no cadastro:", error);
        console.log(formattedDataC);
      }
    }
    if (tipo === "Empresa") {
      try {
        const response = await axiosInstance.post(url, formattedDataE);
        if (response.status >= 200 && response.status < 300) {
          window.location.href = `${frontserver}/login`;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        toast.error("Erro: " + error?.response?.data?.error)
        console.error("Erro no cadastro:", error);
        console.log(formattedDataE);
      }
    }
  };

  return (
    <>

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

              <div className="infos-cadastro">
                <div className="escolha-cadastro">
                  {!tipo && (
                    <div className='titulo-cadastro'>
                      <h1>Olá! Faça seu cadastro.</h1>
                      <p>É novo por aqui? Faça seu cadastro agora mesmo como empresa ou candidato.</p>
                    </div>
                  )}
                  <div className='escolha-select'>

                    <select defaultValue="" onChange={handleChangeTipo}>
                      <option disabled value="">Escolha</option>
                      {['Empresa', 'Candidato'].map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>

                  </div>

                  <div className="form-container">
                    <form onSubmit={handleSubmit}>
                      {tipo === 'Empresa' && (
                        <div className="form-cadastro">
                          <div className="form-titulo">
                            <h3>Cadastro Empresa</h3>
                          </div>

                          <div className='container-inputs'>
                            <label>
                              <p>E-mail:</p>
                              <input type="text" placeholder="E-mail da empresa" onChange={handleInputChange} name="email" />
                            </label>
                            <label>
                              <p>Nome da Empresa:</p>
                              <input type="text" placeholder="Digite o nome da empresa" onChange={handleInputChange} name="companyName" />
                            </label>

                          </div>

                          <div className='container-inputs'>
                            <label>
                              <p>Defina uma senha:</p>
                              <div className="senha-container">
                                <input type={showPassword ? "text" : "password"} placeholder="Digite sua senha" onChange={handleInputChange} name="password" />
                                <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                </button>
                              </div>
                            </label>
                            <label>
                              <p>Repita a senha:</p>
                              <div className="senha-container">
                                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" onChange={handleInputChange} name="confirmPassword" />
                                <button type="button" className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {showConfirmPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                </button>
                              </div>
                            </label>
                          </div>

                          <label className='input-type selectMobile'>
                            <p>Ramo:</p>
                            <select name="branchOfActivity" onChange={handleInputChange}>
                              <option value="">Selecione o ramo de atuação</option>
                              {areas.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                              ))}
                            </select>
                          </label>

                          <label className='input-type selectMobile'>
                            <p>Tipo:</p>
                            <select defaultValue="" onChange={handleChangeTipoEmpresa} name="type">
                              <option disabled value="">Tipo da empresa</option>
                              {['Profissional Liberal', 'Empresa de CRH', 'Empresa Empregadora'].map((area) => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                          </label>

                          {tipoEmpresa === 'Profissional Liberal' && (
                            <div className="form-cadastrar">
                              <div className="container-inputs">
                                <label>
                                  <p>Documento de Registro:</p>
                                  <InputMask
                                    type="text"
                                    mask="99.999.999-9"
                                    placeholder="Selecione uma opção"
                                    onChange={handleInputChange}
                                    name="liberalProfessionalData.registrationDocument"
                                  />
                                </label>
                                <label>
                                  <p>Posição na Empresa:</p>
                                  <input
                                    type="text"
                                    placeholder="Sua posição na Empresa"
                                    onChange={handleInputChange}
                                    name="positionInTheCompany"
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>Número de Registro:</p>
                                  <InputMask
                                    type="text"
                                    mask="99999/9999"
                                    placeholder="Digite o Número"
                                    onChange={handleInputChange}
                                    name="liberalProfessionalData.registrationNumber"
                                  />
                                </label>
                                <label>
                                  <p>CPF:</p>
                                  <InputMask
                                    type="text"
                                    mask="999.999.999-99"
                                    placeholder="Digite o CPF"
                                    onChange={handleInputChange}
                                    name="liberalProfessionalData.cpf"
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>CEP:</p>
                                  <InputMask
                                    type="text"
                                    mask="99999-999"
                                    name="address.cep"
                                    onChange={onChangeCep}
                                    placeholder="Digite seu CEP"
                                    value={cep}
                                  />
                                </label>
                                <label>
                                  <p>Número:</p>
                                  <input
                                    type="text"
                                    placeholder="Número"
                                    onChange={handleInputChange}
                                    name="address.number"
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>Logradouro:</p>
                                  <input
                                    type="text"
                                    placeholder="Logradouro"
                                    name="address.publicPlace"
                                    value={formData.address?.publicPlace || ''}
                                    readOnly
                                    disabled
                                  />
                                </label>
                                <label>
                                  <p>Cidade:</p>
                                  <input
                                    type="text"
                                    placeholder="Cidade"
                                    name="address.city"
                                    value={formData.address?.city || ''}
                                    readOnly
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>Estado:</p>
                                  <input
                                    type="text"
                                    placeholder="Estado"
                                    name="address.state"
                                    value={formData.address?.state || ''}
                                    readOnly
                                  />
                                </label>
                                <label>
                                  <p>Telefone (DDD + Número):</p>
                                  <InputMask
                                    type="text"
                                    mask="(99) 99999-9999"
                                    placeholder="(11) 99999-9999"
                                    onChange={handleInputChange}
                                    name="telephone"
                                  />
                                </label>
                              </div>

                              <label>
                                <p>Descrição da Empresa:</p>
                                <input
                                  type="text"
                                  placeholder="A descrição ficará visível para os candidatos"
                                  onChange={handleInputChange}
                                  name="description"
                                />
                              </label>

                              <div className="enviar-cadastro">
                                <button type="submit">Cadastrar</button>
                              </div>
                            </div>
                          )}

                          {tipoEmpresa === 'Empresa de CRH' && (
                            <div>

                              <div className="container-inputs">

                                <label>
                                  <p>CNPJ:</p>
                                  <InputMask
                                    type="text"
                                    mask="99.999.999/9999-99"
                                    placeholder="99.999.999/9999-99"
                                    onChange={handleInputChange}
                                    name="crhCompanyData.cnpj"
                                  />
                                </label>
                                <label>
                                  <p>Razão Social:</p>
                                  <input
                                    type="text"
                                    placeholder="Digite a razão social"
                                    onChange={handleInputChange}
                                    name="crhCompanyData.socialReason"
                                  />
                                </label>

                              </div>

                              <div className="container-inputs">

                                <label>
                                  <p>Nome Fantasia:</p>
                                  <input
                                    type="text"
                                    placeholder="Digite o nome fantasia"
                                    onChange={handleInputChange}
                                    name="crhCompanyData.fantasyName"
                                  />
                                </label>
                                <label>
                                  <p>Posição na Empresa:</p>
                                  <input
                                    type="text"
                                    placeholder="Sua posição na Empresa"
                                    onChange={handleInputChange}
                                    name="positionInTheCompany"
                                  />
                                </label>

                              </div>

                              <div className="container-inputs">

                                <label>
                                  <p>CEP:</p>
                                  <InputMask
                                    type="text"
                                    mask="99999-999"
                                    placeholder="Digite seu CEP"
                                    onChange={onChangeCep}
                                    value={cep}
                                    name="address.cep"
                                  />
                                </label>
                                <label>
                                  <p>Cidade:</p>
                                  <input
                                    type="text"
                                    placeholder="Cidade"
                                    name="address.city"
                                    value={formData.address?.city || ''}
                                    readOnly
                                  />
                                </label>
                                <label>
                                  <p>Estado:</p>
                                  <input
                                    type="text"
                                    placeholder="Estado"
                                    name="address.state"
                                    value={formData.address?.state || ''}
                                    readOnly
                                  />
                                </label>

                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>Logradouro:</p>
                                  <input
                                    type="text"
                                    placeholder="Logradouro"
                                    name="address.publicPlace"
                                    value={formData.address?.publicPlace || ''}
                                    readOnly
                                    disabled
                                  />
                                </label>
                                <label>
                                  <p>Número:</p>
                                  <input
                                    type="text"
                                    placeholder="Número"
                                    onChange={handleInputChange}
                                    name="address.number"
                                  />
                                </label>
                              </div>

                              <label>
                                <p>Telefone (DDD + Número):</p>
                                <InputMask
                                  type="text"
                                  mask="(99) 99999-9999"
                                  placeholder="(11) 99999-9999"
                                  onChange={handleInputChange}
                                  name="telephone"
                                />
                              </label>
                              <label>
                                <p>Descrição da Empresa:</p>
                                <input
                                  type="text"
                                  placeholder="A descrição ficará visível para os candidatos"
                                  onChange={handleInputChange}
                                  name="description"
                                />
                              </label>

                              <div className="enviar-cadastro">
                                <button type="submit">Cadastrar</button>
                              </div>
                            </div>
                          )}

                          {tipoEmpresa === 'Empresa Empregadora' && (
                            <div>

                              <div className="container-inputs">

                                <label>
                                  <p>Nome Fantasia:</p>
                                  <input
                                    type="text"
                                    placeholder="Digite o nome fantasia"
                                    onChange={handleInputChange}
                                    name="employerCompanyData.fantasyName"
                                  />
                                </label>
                                <label>
                                  <p>Posição na Empresa:</p>
                                  <input
                                    type="text"
                                    placeholder="Sua posição na Empresa"
                                    onChange={handleInputChange}
                                    name="positionInTheCompany"
                                  />
                                </label>

                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>CEP:</p>
                                  <InputMask
                                    type="text"
                                    mask="99999-999"
                                    placeholder="Digite seu CEP"
                                    onChange={onChangeCep}
                                    value={cep}
                                    name="address.cep"
                                  />
                                </label>
                                <label>
                                  <p>Cidade:</p>
                                  <input
                                    type="text"
                                    placeholder="Cidade"
                                    name="address.city"
                                    value={formData.address?.city || ''}
                                    readOnly
                                  />
                                </label>
                                <label>
                                  <p>Estado:</p>
                                  <input
                                    type="text"
                                    placeholder="Estado"
                                    name="address.state"
                                    value={formData.address?.state || ''}
                                    readOnly
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">
                                <label>
                                  <p>Logradouro:</p>
                                  <input
                                    type="text"
                                    placeholder="Logradouro"
                                    name="address.publicPlace"
                                    value={formData.address?.publicPlace || ''}
                                    readOnly
                                    disabled
                                  />
                                </label>
                                <label>
                                  <p>Número:</p>
                                  <input
                                    type="text"
                                    placeholder="Número"
                                    onChange={handleInputChange}
                                    name="address.number"
                                  />
                                </label>
                              </div>

                              <div className="container-inputs">

                                <label>
                                  <p>CNPJ:</p>
                                  <InputMask
                                    type="text"
                                    mask="99.999.999/9999-99"
                                    placeholder="99.999.999/9999-99"
                                    onChange={handleInputChange}
                                    name="employerCompanyData.cnpj"
                                  />
                                </label>
                                <label>
                                  <p>Razão Social:</p>
                                  <input
                                    type="text"
                                    placeholder="Digite a razão social"
                                    onChange={handleInputChange}
                                    name="employerCompanyData.socialReason"
                                  />
                                </label>

                              </div>

                              <label>
                                <p>Telefone (DDD + Número):</p>
                                <InputMask
                                  type="text"
                                  mask="(99) 99999-9999"
                                  placeholder="(11) 99999-9999"
                                  onChange={handleInputChange}
                                  name="telephone"
                                />
                              </label>
                              <label>
                                <p>Descrição da Empresa:</p>
                                <input
                                  type="text"
                                  placeholder="A descrição ficará visível para os candidatos"
                                  onChange={handleInputChange}
                                  name="description"
                                />
                              </label>

                              <div className="enviar-cadastro">
                                <button type="submit">Cadastrar</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                      {tipo === 'Candidato' && (
                        <div className="form-cadastro">
                          <div className="form-titulo">
                            <h3>Cadastro Candidato</h3>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>Nome:</p>
                              <input type="text" placeholder="Nome completo" onChange={handleInputChange} name="candidateName" />
                            </label>
                            <label>
                              <p>E-mail:</p>
                              <input type="email" placeholder="E-mail pessoal" onChange={handleEmailChange} name="email" />
                              {emailInUse && <p className="error-text">O e-mail já está sendo utilizado.</p>}
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>Senha:</p>
                              <div className="senha-container">
                                <input type={showPassword ? "text" : "password"} placeholder="Defina sua senha" onChange={handleInputChange} name="password" />
                                <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                </button>
                              </div>
                            </label>
                            <label>
                              <p>Confirme sua senha:</p>
                              <div className="senha-container">
                                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" onChange={handleInputChange} name="confirmPassword" />
                                <button type="button" className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {showConfirmPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                </button>
                              </div>
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>Data de nascimento:</p>
                              <input
                                type="date"
                                onChange={handleInputChange}
                                name="candidateBirth"
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 14))
                                  .toISOString()
                                  .split('T')[0]}
                              />
                            </label>
                            <label>
                              <p>Telefone (DDD + Número):</p>
                              <InputMask
                                type="text"
                                mask="(99) 99999-9999"
                                placeholder="(11) 99999-9999"
                                onChange={handleInputChange}
                                name="candidatePhone"
                                value={formData.candidatePhone || ""}
                              />
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>CEP:</p>
                              <InputMask
                                type="text"
                                mask="99999-999"
                                placeholder="Digite seu CEP"
                                onChange={onChangeCep}
                                name="candidateCEP"
                                value={cep || ""}
                              />
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>Endereço:</p>
                              <input
                                type="text"
                                placeholder="Ex: Rua Exemplo"
                                onChange={handleInputChange}
                                name="candidateAddress.publicPlace"
                                value={formData.candidateAddress?.publicPlace || ''}
                                disabled
                              />
                            </label>
                            <label>
                              <p>Número:</p>
                              <input
                                type="text"
                                placeholder="Número do endereço"
                                onChange={handleInputChange}
                                name="candidateAddress.number"
                                value={formData.candidateAddress?.number || ''}
                              />
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label className='selectMobile'>
                              <p>Nível de escolaridade:</p>
                              <select onChange={handleInputChange} name="candidateEducationLevel" value={formData.candidateEducationLevel || ''}>
                                <option value="">Selecione</option>
                                <option value="Ensino Fundamental">Ensino Fundamental</option>
                                <option value="Ensino Médio">Ensino Médio</option>
                                <option value="Ensino Superior">Ensino Superior</option>
                                <option value="Pós-Graduação">Pós-Graduação</option>
                                <option value="Mestrado">Mestrado</option>
                                <option value="Doutorado">Doutorado</option>
                              </select>
                            </label>
                            <label>
                              <p>Estado civil:</p>
                              <input type="text" placeholder="Ex: Casado" onChange={handleInputChange} name="candidateCivilStatus" />
                            </label>
                          </div>

                          <label>
                            <p>Último cargo:</p>
                            <input type="text" placeholder="Último cargo que exerceu" onChange={handleInputChange} name="candidateLastJob" />
                          </label>

                          <div className="container-inputs">
                            <label>
                              <p>Cargo desejado:</p>
                              <input type="text" placeholder="Cargo / Emprego desejado" onChange={handleInputChange} name="desiredRole" />
                            </label>
                            <label className='selectMobile'>
                              <p>Pretenção salarial:</p>
                              <select value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value)}>
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
                                onChange={(e) => setSalaryValue(e.target.value)}
                                placeholder="Digite o valor"
                              />
                            </label>
                          </div>

                          <div className="container-inputs">
                            <label>
                              <p>Cidade de trabalho desejada:</p>
                              <input type="text" placeholder="Cidade" onChange={handleInputChange} name="desiredCity" />
                            </label>
                            <label>
                              <p>Estado de trabalho desejado:</p>
                              <input type="text" placeholder="Estado" onChange={handleInputChange} name="desiredState" />
                            </label>
                          </div>

                          <label className="input-type selectMobile">
                            <p>Gênero:</p>
                            <select
                              value={formData.candidateGender || ''}
                              onChange={handleInputChange}
                              name="candidateGender"
                            >
                              <option value="">Selecione</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                              <option value="Prefiro não dizer">Prefiro não dizer</option>
                            </select>
                          </label>

                          <div className="enviar-cadastro">
                            <button type="submit">Cadastrar</button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                <div className='cadastro-login'>
                  <p>Já possui uma conta?</p>
                  <Link to="/login">Faça seu login.</Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}