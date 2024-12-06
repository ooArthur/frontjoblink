import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import Footer from '../ui/components/Footer/Footer';
//importanto imagens utilizadas ao longo da home
import logo from '/logo (1).svg';
import logoMobile from '../assets/images/JL (1).svg';
import celularHome from '../assets/images/celularHome.svg';
import faq from '../assets/images/FAQ.svg';
// Importando as imagens do carrossel
import carrossel1 from '../assets/images/Carrossel1.svg';
import carrossel2 from '../assets/images/Carrossel6.svg';
import carrossel3 from '../assets/images/Carrossel3.svg';
import carrossel4 from '../assets/images/Carrossel4.svg';
import carrossel5 from '../assets/images/Carrossel6.svg';
import carrossel6 from '../assets/images/Carrossel5.svg';

//importando css
import '../assets/style/home.css';

export function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const elementsToAnimate = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Faq

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Como funciona o JobLink?",
      answer: "Nosso sistema é feito para aproximar as empresas dos usuários, o sistema permite que as organizações enviem e anunciem suas vagas permitindo que as pessoas que buscam novas oportunidades mandem seus currículos para serem possivelmente contratados."
    },
    {
      question: "Como Faço para criar minha vaga como empresa?",
      answer: "Na home da página empresarial haverá um botão intitulado 'anuncie sua vaga', ao selecionar esse botão, você deverá preencher alguns campos para a criação da vaga, logo após isso ela aparecerá para os usuários se candidatarem."
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
      question: "Como funciona o sistema de busca de vagas?",
      answer: "Na aba de vagas, haverá um campo de busca, nele basta digitar a vaga em específica que você procura."
    }
  ];

  const images = [
    [carrossel1, carrossel2],
    [carrossel3, carrossel4],
    [carrossel5, carrossel6]
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const intervalId = setInterval(nextSlide, 3000); // 3000 ms = 3 segundos

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  const borderBottomTitulo = {
    borderBottom: '0.18vw solid black'
  };
  const borderRightService = {
    borderRight: '0.4vw solid rgb(255, 217, 0)'
  }


  /* Função para abrir tópicos do faq */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Função para abrir o modal e definir o conteúdo
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);

    // Adiciona ou remove a classe que desativa a rolagem
    if (!menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  // Garante a remoção da classe ao desmontar o componente
  useEffect(() => {
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    const intervalId = setInterval(nextSlide, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    });

    elementsToAnimate.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      if (elementsToAnimate.current) {
        elementsToAnimate.current.forEach(el => {
          if (el) observer.unobserve(el);
        });
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <>
      <header>

        <div className={`header-itens ${isScrolled ? 'rolagem' : ''}`}>
          <div className='logo-header'>
            <Link id='logoDesktop' className='logoDesktop' to="/"><img src={logo} alt="Logo" /></Link>
            <img className='logoMobile' src={logoMobile} alt="Logo" onClick={scrollToTop} />
          </div>
          <div className='options-header'>
            <Link to="/cadastro" id='option-header-cadastro'>CADASTRO</Link>
            <Link to="/login" >LOGIN</Link>
          </div>
          <div className="menu-container">
            {/* Ícone do menu hambúrguer */}
            <div className="hamburger-menu" onClick={toggleMenu}>
              <span className="material-symbols-outlined">menu</span>
            </div>

            {/* Conteúdo do menu */}
            {menuOpen && (
              <div className="menu-content">
                <span onClick={toggleMenu} className="material-symbols-outlined">close</span>
                <a href="/login" className="menu-item">
                  Login
                </a>
                <a href="/cadastro" className="menu-item">
                  Cadastro
                </a>
              </div>
            )}
          </div>
        </div>

      </header>

      <main className="main-home">

        <section className='encontre-vagas'>

          <div className='topicos-encontre-vagas'>
            <div className='titulo-topicos' style={borderBottomTitulo}>
              <h1><span>+13 milhões</span> de currículos na JobLink</h1>
            </div>
            <div className='titulo-topicos' style={borderBottomTitulo}>
              <h1><span>+700 mil</span> pessoas online</h1>
            </div>
            <div className='titulo-topicos'>
              <h1> <span>+10 mil</span> empresas de todo o país</h1>
            </div>
          </div>

          <div className='titulo-encontre-vagas'>
            <div className='titulo-encontre-vagas-content'>
              <h1>Encontre vagas de emprego ou anuncie suas vagas:</h1>
              <p>Na JobLink facilitamos o recrutamentopara postar vagas e alcançar candidatos qualificados. Cadastre suas oportunidades e encontre o talento idela para sua empresa com o nosso suporte especializado</p>
            </div>
          </div>

          <div className='imagem-encontre-vagas'>
            <img src={celularHome} alt="Celular" />
          </div>

        </section>

        <section className='services hidden' ref={el => elementsToAnimate.current.push(el)}>

          <div className='detalhes-services'>
            <div className='titulo-detalhes-services servicesMobile'>
              <h1>As <span style={{ color: 'rgb(255, 217, 0)' }}>Empresas</span> que consomem nossos serviços</h1>
            </div>
            <div className='desc-detalhes-services'>
              <p>Para sua empresa, a JobLink oferece as melhores ferramentas para achar o talento ideal de forma rápida.</p>
              <Link to="/login">Ler mais</Link>
            </div>
          </div>

          <div className='campos-services hidden' ref={el => elementsToAnimate.current.push(el)}>
            <div className='campo-especifico-services' style={borderRightService}>
              <h1>DIVULGAÇÃO <i className="fa-solid fa-bullhorn"></i></h1>
              <p>Anuncie suas vagas para atrair melhores talentos.</p>
            </div>
            <div className='campo-especifico-services' style={borderRightService}>
              <h1>RECRUTAMENTO <i className="fa-solid fa-users"></i></h1>
              <p>Capte diversos curriculos de forma mais rápida e eficiente.</p>
            </div>
            <div className='campo-especifico-services' style={{ border: 'none' }}>
              <h1>SELEÇÃO <i className="fa-solid fa-file-signature"></i></h1>
              <p>Vizualize rapidamente os candidatos que mais se adequam ao perfil desejado.</p>
            </div>
          </div>

        </section>

        <section className='duvidas hidden' ref={el => elementsToAnimate.current.push(el)}>

          <div className='titulo-duvidas'>
            <h1>Dúvidas?</h1>
          </div>

          <div className='container-duvidas'>
            <div className='image-duvidas'>
              <img src={faq} />
            </div>

            <div className="faqH">
              {faqItems.map((item, index) => (
                <div className="faq-itemH" key={index}>
                  <button className="faq-questionH" onClick={() => handleToggle(index)}>
                    <div>{item.question}</div>
                    <div className={`arrow ${activeIndex === index ? 'rotate' : ''}`}>
                      <img src="../src/assets/images/return-arrow.svg" alt="" />
                    </div>
                  </button>
                  <div className={`faq-answerH ${activeIndex === index ? 'show' : ''}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>



        <section className='sectionFeedback'>

          <div className='detalhes-services hidden' ref={el => elementsToAnimate.current.push(el)}>
            <div className='titulo-detalhes-services'>
              <h1><span style={{ color: 'rgb(255, 217, 0)' }}>Sucesso</span> é nossa palavra: O que os usuários acham?</h1>
            </div>
            <div className='desc-detalhes-services'>
              <p>Veja como nossos usuários avaliam a experiência com nosso sistema e como ele tem ajudado na conquista de seus objetivos profissionais.</p>
            </div>
          </div>

          <section className='carrossel-section hidden' ref={el => elementsToAnimate.current.push(el)}>
            <div className="carrossel-container">
              <button className="carrossel-button left" onClick={prevSlide}><i className="fa-solid fa-chevron-left"></i></button>

              <div className="carrossel-slide">
                <img src={images[currentIndex][0]} alt="Imagem do carrossel 1" />
                <img src={images[currentIndex][1]} alt="Imagem do carrossel 2" />
              </div>

              <button className="carrossel-button right" onClick={nextSlide}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </section>

        </section>

      </main>

      <Footer />
    </>
  )

};

export default Home;