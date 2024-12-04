import { Link } from 'react-router-dom';
import './Footer.css'

export function Footer() {
    return (
        <>
            <footer>

                <div className='content-footer'>
                    <div className='logo-footer'>
                        <h1>JL</h1>
                        <p>Conectando talentos e oportunidades com simplicidade e eficiência.</p>
                        <p>JobLink, 2024</p>
                    </div>
                    <div className='termos'>
                        <h3>Termos</h3>
                        <Link to='/termos-de-privacidade'>Política de privacidade</Link>
                        <Link className='termosMobile' to='/termos-de-privacidade'>Termos de Serviço</Link>
                        <Link to='/termos-de-privacidade'>Documentação</Link>
                    </div>
                </div>

                <div className='icons-footer'>
                    <Link to="">@ 2024 JobLink - Todos os direitos reservados</Link>
                    <div className='icons-content-footer'>
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-whatsapp"></i>
                    </div>
                </div>

            </footer>

        </>
    )
}

export default Footer;