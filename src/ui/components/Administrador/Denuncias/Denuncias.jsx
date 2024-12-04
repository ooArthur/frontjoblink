import Menu from "../Menu/Menu";
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../source/axiosInstance';
import { toast } from "sonner";
import './Denuncias.css';

function Denuncias() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/api/report/list-reports');
        setReports(response.data);
      } catch (error) {
        console.error("Erro ao carregar as denúncias: ", error);
      }
    };

    fetchReports();
  }, []);

  const handleDivClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // Função para deletar um report
  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    try {
      const response = await axiosInstance.delete(`/api/report/delete-report/${selectedReport._id}`);
      toast.success(response.data.message); // Usa a mensagem da resposta da API

      // Atualizar a lista de denúncias após a exclusão
      setReports((prevReports) => prevReports.filter((report) => report.id !== selectedReport._id));
      handleCloseModal(); // Fechar o modal após a ação
    } catch (error) {
      console.error("Erro ao excluir a denúncia: ", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao excluir a denúncia. Tente novamente mais tarde.';
      toast.error(errorMessage);
    }
  };

  // Função para banir ou deletar uma vaga
  const handleDeleteOrBan = async () => {
    if (!selectedReport) return;

    try {
      let response;
      if (selectedReport.type === 'vacancy') {
        // Excluir vaga
        response = await axiosInstance.delete(`/api/report/deletevacancy-report/${selectedReport.target._id}`);
      } else {
        // Banir candidato ou empresa
        response = await axiosInstance.post(`/api/report/ban-user/${selectedReport.target._id}/report/${selectedReport.id}`);
      }

      toast.success(response.data.message); // Usa a mensagem da resposta da API

      // Atualizar a lista de denúncias após a ação
      setReports((prevReports) => prevReports.filter((report) => report.id !== selectedReport.id));
      handleCloseModal(); // Fechar o modal após a ação

    } catch (error) {
      console.error("Erro ao realizar a ação: ", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao realizar a ação. Tente novamente mais tarde.';
      toast.error(errorMessage);
    }
  };

  // Função para avisar o usuário
  const handleGiveWarning = async () => {
    if (!selectedReport || !selectedReport.target || !selectedReport.target._id) {
      console.error("Erro: A denúncia ou o alvo não está definido corretamente.");
      toast.error("Informações da denúncia ou do alvo estão incompletas. Tente novamente.");
      return;
    }

    try {
      const { type, target } = selectedReport;

      const response = await axiosInstance.post('/api/report/warn-user', {
        type,
        targetId: target._id,
      });

      toast.success(response.data.message); // Exibir a mensagem de sucesso da API

      // Atualizar a lista de denúncias após enviar o aviso
      setReports((prevReports) => prevReports.filter((report) => report.id !== selectedReport.id));
      handleCloseModal(); // Fechar o modal após a ação

    } catch (error) {
      console.error("Erro ao avisar o usuário: ", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao enviar o aviso. Tente novamente mais tarde.';
      toast.error(errorMessage);
    }
  };

  // Ajuste para exibir os detalhes do relatório de forma segura
  const renderReportDetails = (report) => {
    if (!report || !report.target) {
      return <p>Informações não disponíveis.</p>;
    }

    switch (report.type) {
      case 'candidate':
        return (
          <>
            <p><span>Último emprego:</span> {report.target.candidateLastJob || "Não informado"}</p>
            <p><span>Gênero:</span> {report.target.candidateGender || "Não informado"}</p>
            <p><span>Objetivo de Salário:</span> {report.target.candidateTargetSalary || "Não informado"}</p>
            <p><span>Cidade Desejada:</span> {report.target.desiredCity || "Não informado"}</p>
            <p><span>Estado:</span> {report.target.desiredState || "Não informado"}</p>
          </>
        );

      case 'company':
        return (
          <>
            <p><span>Área de Atuação:</span> {report.target.branchOfActivity || "Não informado"}</p>
            <p><span>Funcionários:</span> {report.target.employeerNumber || "Não informado"}</p>
            <p><span>Telefone:</span> {report.target.telephone || "Não informado"}</p>
          </>
        );

      case 'vacancy':
        return (
          <>
            <p><span>Área:</span> {report.target.jobArea || "Não informado"}</p>
            <p><span>Local:</span> {report.target.jobLocation?.city || "Não informado"}, {report.target.jobLocation?.state || ""}</p>
            <p><span>Salário:</span> {report.target.salary || "Não informado"}</p>
            <p><span>Descrição:</span> {report.target.jobDescription || "Não informado"}</p>
            <p><span>Qualificações Necessárias:</span> {report.target.requiredQualifications?.join(', ') || "Não informado"}</p>
            <p><span>Prazo de Inscrição:</span> {report.target.applicationDeadline ? new Date(report.target.applicationDeadline).toLocaleDateString('pt-BR') : "Não informado"}</p>
          </>
        );

      default:
        return <p>Informações não disponíveis.</p>;
    }
  };

  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }


  return (
    <>
      <Menu setMenuOpen={setMenuOpen} />

      <main id='mainAdaptation' className={`blurMain ${menuOpen ? 'blurred' : ''}`}>
        <section className='header-adm mainAdm'>
          <h1>Olá, Administrador</h1>
          <div className='dashboard-titulo logh1'>
            <p className="Date">{dataFormatada}</p>
          </div>
        </section>

        <section className='denunciasArea'>
          <div className="denunciasH1">
            <h1>Denúncias</h1>
          </div>
          <div className="containerDenuncias">
            {reports.length === 0 ? (
              <p className="no-reports">Nenhuma denúncia encontrada.</p>
            ) : (
              reports.map((report, index) => (
                <div className="cardDenuncia" key={report.id || index} onClick={() => handleDivClick(report)}>
                  <div className="cardDenunciaEmpresa">
                    <h4>{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</h4>
                  </div>
                  <div className="cardDenunciaInfo">
                    <div className="cardDenunciaTitulo">
                      <h4>
                        {truncateText(
                          report.target?.companyName ||
                          report.target?.candidateName ||
                          report.target?.jobTitle ||
                          "Entidade sem nome",
                          20 // Aqui você define o tamanho máximo que quer para o texto
                        )}
                      </h4>
                      <button onClick={(e) => {
                        e.stopPropagation(); // Evitar a abertura do modal ao clicar no botão de exclusão
                        setSelectedReport(report); // Atualiza o selectedReport com o relatório atual
                        handleDeleteReport(); // Chamar a função para deletar o report
                      }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div className="cardDenunciaMotivo">
                      <h5>{report.reportReason}</h5>
                      <p>{truncateText(report.description, 70)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal com os detalhes da denúncia selecionada */}
      {isModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cardDenunciaEmpresa entidadeDenuncia">
              <h4>{selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}</h4>
            </div>
            <div className="infoDenuncia">
              <div className="infoDenunciaTitulo">
                <h2>
                  {selectedReport.target?.companyName || selectedReport.target?.candidateName || selectedReport.target?.jobTitle || "Entidade sem nome"}
                </h2>
                <h5>
                  {selectedReport.target?.banned
                    ? (selectedReport.type === 'vacancy' ? "Vaga Banida" : "Conta Banida")
                    : (selectedReport.type === 'vacancy' ? "Vaga Ativa" : "Conta Ativa")}
                </h5>
              </div>
              <p className="description-denuncia">{selectedReport.description}</p>
              {renderReportDetails(selectedReport)}
              <div className="infoDenunciasData">
                <h4>
                  Reportado Por: <span>{selectedReport?.reportedBy?.email || "Email não disponível"}</span>
                </h4>
                <h4>Data de Report: {new Date(selectedReport.createdAt).toLocaleDateString('pt-BR')}</h4>
              </div>
              <div className="buttonsDenuncia">
                <button className="buttonExcluirDenuncia" onClick={handleDeleteReport}>
                  {selectedReport.type === 'vacancy' ? "Excluir Denúncia" : "Excluir Denúncia"}
                </button>
                <button className="buttonAvisar" onClick={handleGiveWarning}>
                  Avisar
                </button>
                <button className="buttonDeletarEntidade" onClick={handleDeleteOrBan}>
                  {selectedReport.type === 'vacancy' ? "Deletar Vaga" : "Banir Conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Denuncias;