import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsquecerSenha from './pages/EsquecerSenha.jsx'
import RecuperarSenha from './pages/RecuperarSenha.jsx'
import Termos from './pages/Termos';
import Faq from './pages/Faq';
import PrivateRoute from './PrivateRoutes';
import Candidato from './ui/components/Candidato/Area/Candidato';
import TodasVagas from './ui/components/Candidato/TodasVagas/TodasVagas';
import ListarEmpresas from './ui/components/Candidato/ListarEmpresas/ListarEmpresas.jsx'
import VagasFavoritas from './ui/components/Candidato/VagasFavoritas/VagasFavoritas';
import CurriculosEnviados from './ui/components/Candidato/CurriculosEnviados/CurriculosEnviados';
import ContaCandidato from './ui/components/Candidato/ContaCandidato/ContaCandidato';
import Admin from './ui/components/Administrador/Area/Admin';
import ContaAdministrador from './ui/components/Administrador/Conta/ContaAdministrador';
import Empresa from './ui/components/Empresa/Area/Area';
import EditarVaga from './ui/components/Empresa/EditarVaga/EditarVaga';
import ListarCandidatos from './ui/components/Empresa/ListarCandidatos/ListarCandidatos';
import PreVisualizacaoE from './ui/components/Empresa/Pre-vizualizacao/PrevisualizacaoE';
import PreVisualizacao from './ui/components/Candidato/Pre-Visualizacao/Pre-Visualizacao';
import Denuncias from './ui/components/Administrador/Denuncias/Denuncias';
import Crud from './ui/components/Administrador/Crud/Crud';
import Relatorio from './ui/components/Administrador/Relatorio/Relatorio';
import MinhasVagas from './ui/components/Empresa/MinhasVagas/MinhasVagas';
import ContaEmpresa from './ui/components/Empresa/ContaEmpresa/ContaEmpresa';
import CandidatosFavoritos from './ui/components/Empresa/CandidatosFavoritos/CandidatosFavoritos'

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/forgot-password" element={<EsquecerSenha/>} />
                <Route path="/reset-password" element={<RecuperarSenha/>} />
                <Route path="/termos-de-privacidade" element={<Termos />} />
                <Route path="/perguntas-frequentes" element={<Faq />} />

                {/* Rotas protegidas */}
                <Route path="/pre-visualizacaoE/:id" element={<PrivateRoute element={PreVisualizacaoE} allowedRoles={['Candidate', 'Admin']} />} /> {/* PV da Empresa */}
                <Route path="/pre-visualizacao/:id" element={<PrivateRoute element={PreVisualizacao} allowedRoles={['Company', 'Admin']} />} /> {/* PV do Candidato */}

                {/* Rotas Candidato */}
                <Route path="/area-candidato" element={<PrivateRoute element={Candidato} allowedRoles={['Candidate', 'Admin']} />} />
                <Route path="/listar-vagas" element={<PrivateRoute element={TodasVagas} allowedRoles={['Candidate', 'Admin']} />} />
                <Route path="/vagas-favoritas" element={<PrivateRoute element={VagasFavoritas} allowedRoles={['Candidate', 'Admin']} />} />
                <Route path="/curriculos-enviados" element={<PrivateRoute element={CurriculosEnviados} allowedRoles={['Candidate', 'Admin']} />} />
                <Route path="/conta-candidato" element={<PrivateRoute element={ContaCandidato} allowedRoles={['Candidate', 'Admin']} />} />
                <Route path="/listar-empresas" element={<PrivateRoute element={ListarEmpresas} allowedRoles={['Candidate', 'Admin']} />}/>

                {/* Rotas ADM */}
                <Route path="/area-administrador" element={<PrivateRoute element={Admin} allowedRoles={['Admin']} />} />
                <Route path="/conta-administrador" element={<PrivateRoute element={ContaAdministrador} allowedRoles={['Admin']} />} />
                <Route path="/relatorio-administrador" element={<PrivateRoute element={Relatorio} allowedRoles={['Admin']} />} />
                <Route path="/denuncias-administrador" element={<PrivateRoute element={Denuncias} allowedRoles={['Admin']} />} />
                <Route path="/crud-administrador" element={<PrivateRoute element={Crud} allowedRoles={['Admin']} />} />

                {/* Rotas da Empresa */}
                <Route path="/area-empresa" element={<PrivateRoute element={Empresa} allowedRoles={['Company', 'Admin']} />} />
                <Route path="/editar-vaga/:id" element={<PrivateRoute element={EditarVaga} allowedRoles={['Company', 'Admin']} />} />
                <Route path="/listar-candidatos" element={<PrivateRoute element={ListarCandidatos} allowedRoles={['Company', 'Admin']} />} />
                <Route path="/minhas-vagas" element={<PrivateRoute element={MinhasVagas} allowedRoles={['Company', 'Admin']} />} />
                <Route path='/conta-empresa' element={<PrivateRoute element={ContaEmpresa} allowedRoles={['Company', 'Admin']} />} />
                <Route path='/curriculos-favoritos' element={<PrivateRoute element={CandidatosFavoritos} allowedRoles={['Company', 'Admin']} />} />
                

            </Routes>
        </Router>
    );
}

export default AppRouter;