import '../assets/style/termos.css';
import { useNavigate } from 'react-router-dom';

export default function Termos() {

    const navigate = useNavigate();

    return (
        <>
            <section className="mainTermos">
                <section className="topo-termos">
                    <div>
                        <div className='voltar' onClick={() => navigate(-1)}>
                            <i style={{ color: 'rgb(255, 217, 0)' }} className="fa-solid fa-chevron-left"></i>
                        </div>
                        <div className="titulo-termos">
                            <div id="t1">
                                <h1>JL</h1>
                            </div>
                            <div id="t2">
                                <h2>Termos de Privacidade</h2>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="privacy-policy">
                    <section>
                        <h2>1. Introdução</h2>
                        <p>Bem-vindo a JobLink. Este documento de Termos de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços. Ao acessar ou usar a JobLink, você concorda com a coleta e o uso das suas informações de acordo com esta política.</p>
                    </section>

                    <section>
                        <h2>2. Informações Coletadas</h2>
                        <p>Coletamos informações de diferentes formas:</p>
                        <ul>
                            <li><strong>Informações Pessoais:</strong> Quando você se cadastra em nosso site, envia um currículo ou uma proposta de emprego, podemos coletar informações pessoais como nome, e-mail, telefone, endereço, histórico profissional e acadêmico, e outros dados relacionados a sua carreira.</li>
                            <li><strong>Informações de Uso:</strong> Coletamos dados sobre como você interage com nosso site, incluindo endereços IP, tipo de navegador, páginas visitadas e duração das visitas.</li>
                        </ul>

                    </section>

                    <section>
                        <h2>3. Uso das Informações</h2>
                        <p>Utilizamos suas informações para:</p>
                        <ul>
                            <li><strong>Fornecer e Melhorar nossos Serviços:</strong> Processar currículos e propostas de emprego, enviar notificações sobre oportunidades e melhorar a experiência do usuário.</li>
                            <li><strong>Comunicação:</strong> Enviar e-mails ou outras comunicações relacionadas ao serviço, como atualizações sobre novas oportunidades de emprego e alterações na política de privacidade.</li>
                            <li><strong>Análise e Pesquisa:</strong> Analisar dados para entender como nossos usuários utilizam o site e melhorar nossos serviços.</li>
                        </ul>

                    </section>

                    <section>
                        <h2>4. Compartilhamento de Informações</h2>
                        <p>Podemos compartilhar suas informações com:</p>
                        <ul>
                            <li><strong>Empresas Parceiras:</strong> Com as empresas cadastradas na JobLink que estão oferecendo oportunidades de emprego e que podem estar interessadas em seu perfil profissional.</li>
                            <li><strong>Prestadores de Serviços:</strong> Com terceiros que realizam serviços em nosso nome, como processamento de pagamentos, hospedagem de dados e suporte técnico.</li>
                            <li><strong>Exigências Legais:</strong> Quando exigido por lei ou em resposta a processos legais, ou para proteger os direitos, propriedade ou segurança da JobLink, nossos usuários ou outros.</li>
                        </ul>

                    </section>

                    <section>
                        <h2>5. Segurança das Informações</h2>
                        <p>Adotamos medidas de segurança técnicas e administrativas para proteger suas informações pessoais contra acesso não autorizado, uso indevido, alteração e destruição. No entanto, nenhum método de transmissão pela internet ou de armazenamento eletrônico é completamente seguro, e não podemos garantir segurança absoluta.</p>

                    </section>

                    <section>
                        <h2>6. Seus Direitos</h2>
                        <p>Você tem o direito de:</p>
                        <ul>
                            <li><strong>Acessar e Atualizar:</strong> Solicitar acesso às suas informações pessoais que temos e atualizar ou corrigir informações imprecisas.</li>
                            <li><strong>Excluir Dados:</strong> Solicitar a exclusão de suas informações pessoais, sujeito às nossas obrigações legais e requisitos de retenção.</li>
                            <li><strong>Optar por Não Receber Comunicações:</strong> Optar por não receber e-mails de marketing, seguindo as instruções de cancelamento inclusas em cada e-mail.</li>
                        </ul>

                    </section>

                    <section>
                        <h2>7. Alterações na Política</h2>
                        <p>Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através do site ou por e-mail. É sua responsabilidade revisar esta política periodicamente para estar ciente de quaisquer modificações.</p>

                    </section>

                    <section style={{border: 'none'}}>
                        <h2>8. Contato</h2>
                        <p>Se você tiver dúvidas sobre esta política ou sobre o tratamento de suas informações pessoais, entre em contato conosco:</p>
                        <p><strong>E-mail:</strong> joblink@gmail.com</p>

                    </section>
                </div>
            </section>
        </>
    )
}