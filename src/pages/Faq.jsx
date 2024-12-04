import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../assets/style/faq.css';

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(null);

    const navigate = useNavigate();

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqItems = [
        {
            question: "Como funciona o JobLink?",
            answer: "Nosso sistema é feito para aproximar as empresas dos usuários, o sistema permite que as organizações enviem e anunciem suas vagas permitindo que as pessoas que buscam novas oportunidades mandem seus currículos para serem possivelmente contratados."
        },
        {
            question: "Como faço para enviar o meu currículo para uma vaga?",
            answer: "É muito fácil, ao selecionar a sua vaga desejada clique da opção de 'ver mais' ao clicar, aparecerá o campo de 'enviar seu currículo', então basta enviá-lo e pronto."
        },
        {
            question: "Como Faço para criar minha vaga como empresa?",
            answer: "Na home da página empresarial haverá um botão intitulado 'anuncie sua vaga', ao selecionar esse botão, você deverá preencher alguns campos para a criação da vaga, logo após isso ela aparecerá para os usuários se candidatarem."
        },
        {
            question: "É necessário pagar para utilizar o nosso sistema?",
            answer: "Não, nosso sistema é totalmente gratuito, tanto para as organizações, quanto para os usuários."
        },
        {
            question: "Como posso excluir meu currículo e minha conta?",
            answer: "Ambas as opções estão na aba do meu perfil."
        },
        {
            question: "Como funciona o sistema de busca de vagas?",
            answer: "Na aba de vagas, haverá um campo de busca, nele basta digitar a vaga em específica que você procura."
        },
        {
            question: "Existe algum limite de vagas que posso me candidatar?",
            answer: "Sim, por dia você só poderá se candidatar em no máximo dez vagas."
        },
        {
            question: "Como faço para adicionar ou modificar minhas informações pessoais e profissionais?",
            answer: "Na aba do 'Meu Perfil' você poderá visualizar todas as suas informações previamente inseridas e modificá-las da forma que você quiser."
        },
        {
            question: "Como posso acessar os currículos enviados para minha vaga?",
            answer: "Na área empresarial ao visualizar a vaga previamente anunciada a empresa poderá editá-la, excluí-la e consequentemente ver só currículos enviados."
        },
        {
            question: "Como posso entrar em contato com um candidato de interesse?",
            answer: "Na área empresarial, sua organização poderá utilizar a busca para procurar uma pessoa específica, assim podendo obter seu e-mail ou seu número."
        },
        {
            question: "Como posso editar ou excluir uma vaga anunciada?",
            answer: "Nosso sistema possui uma exclusão automática de 90 dias, entretanto se você deseja apagar ou excluir antes desse limite, você pode fazer isso pela área empresarial, indo na opção de 'visualizar currículos'."
        },
        {
            question: "O que posso fazer se eu inserir uma informação errada no meu perfil?",
            answer: "Por meio da área do usuário você pode acessar todas as suas informações na opção 'Meu Perfil' lá você conseguirá editar ou excluir qualquer informação previamente inserida."
        },
        {
            question: "O sistema armazena meu currículo por quanto tempo?",
            answer: "O sistema guarda o currículo pelo mesmo tempo de duração da vaga."
        },
        {
            question: "Quantas vagas uma empresa pode criar e manter no ar ao mesmo tempo?",
            answer: "Uma empresa pode criar e manter até 15 vagas."
        },
        {
            question: "Meus dados pessoais são exibidos para os outros?",
            answer: "Não, seus dados pessoais e sensíveis não são exibidos para os demais usuários."
        },
        {
            question: "Como posso denunciar algo que inflija as políticas de privacidade ou algo sensível?",
            answer: "Quando você abrir a tela de visualização de vaga ou de currículo haverá uma opção para denunciar."
        },
        {
            question: "Eu posso ver o histórico de vagas que me candidatei?",
            answer: "Não, não é possível, só se pode ver as vagas que estão ativas, na qual você enviou o currículo."
        },
        {
            question: "Posso linkar meu currículo do site com meu perfil do linkedin?",
            answer: "Sim, ao acessar o Meu Perfil na Área do Candidato haverá uma região para contato, podendo adicionar links."
        },
        {
            question: "Como reportar um problema técnico ou um bug no site?",
            answer: "Caso encontre um problema, basta entrar em contato com nossa equipe de Admins pelo e-mail: devjoblink@gmail.com."
        },
        {
            question: "Como posso exportar meus dados e informações?",
            answer: "Na aba de meu perfil, você pode exportar tanto seu linkedin, quanto insta e WhatsApp."
        }
    ];

    return (
        <section className="mainFaq">
            <section className="Topo-faq">
                <div>
                    <div className="voltar" onClick={() => navigate(-1)}>
                            <i style={{ color: 'rgb(255, 217, 0)' }} className="fa-solid fa-chevron-left"></i>
                    </div>
                    <div className="titulo-faq">
                        <div id="t1">
                            <h1>JL</h1>
                        </div>
                        <div id="t2">
                            <h2>Perguntas Frequentes</h2>
                        </div>
                    </div>
                </div>
            </section>

            <div className="faq">
                {faqItems.map((item, index) => (
                    <div className="faq-item" key={index}>
                        <button className="faq-question" onClick={() => handleToggle(index)}>
                            <div>{item.question}</div>
                            <div className={`arrow ${activeIndex === index ? 'rotate' : ''}`}>
                                <img src="../src/assets/images/return-arrow.svg" alt="" />
                            </div>
                        </button>
                        <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                            <p>{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
