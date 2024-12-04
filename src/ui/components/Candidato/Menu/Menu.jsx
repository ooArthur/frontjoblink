import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '../../../../Context/UserContext';
import './Menu.css';

export default function Menu({ setMenuOpen }) {
    const { handleLogout } = useUser();
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // Define o item ativo com base na URL
        switch (location.pathname) {
            case '/area-candidato':
                setActiveIndex(0);
                break;
            case '/conta-candidato':
                setActiveIndex(1);
                break;
            case '/vagas-favoritas':
                setActiveIndex(2);
                break;
            case '/curriculos-enviados':
                setActiveIndex(3);
                break;
            case '/listar-vagas':
                setActiveIndex(4);
                break;
            case '/listar-empresas':
                setActiveIndex(5);
                break;
            default:
                setActiveIndex(0); // Define um padrão caso a URL não corresponda a nenhum item
                break;
        }
    }, [location.pathname]); // Executa o efeito sempre que a URL mudar

    const handleMenuItemClick = (index) => {
        setActiveIndex(index);
    };

    const handleMenuHover = (isOpen) => {
        setMenuOpen(isOpen);
    };

    return (
        <nav
            className="menu-lateral"
            onMouseEnter={() => handleMenuHover(true)}
            onMouseLeave={() => handleMenuHover(false)}
        >
            <ul className='ulMenu'>
                <li
                    className={`item-menu ${activeIndex === 0 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(0)}
                >
                    <Link to="/area-candidato">
                        <span className="icon"><i className="fa-solid fa-earth-americas"></i></span>
                        <span className="txt-link">Minha Área</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 1 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(1)}
                >
                    <Link to="/conta-candidato">
                        <span className="icon"><i className="fa-solid fa-circle-user"></i></span>
                        <span className="txt-link">Conta</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 2 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(2)}
                >
                    <Link to="/vagas-favoritas">
                        <span className="icon"><i className="fa-regular fa-star"></i></span>
                        <span className="txt-link">Favoritos</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 3 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(3)}
                >
                    <Link to="/curriculos-enviados">
                        <span className="icon"><i className="fa-solid fa-address-book"></i></span>
                        <span className="txt-link">Currículos Enviados</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 4 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(4)}
                >
                    <Link to="/listar-vagas">
                        <span className="icon"><i className="fa-solid fa-rectangle-list"></i></span>
                        <span className="txt-link">Listar Vagas</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 5 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(4)}
                >
                    <Link to="/listar-empresas">
                        <span className="icon"><i className="fa-solid fa-location-dot"></i></span>
                        <span className="txt-link">Listar Empresas</span>
                    </Link>
                </li>
            </ul>
            <div className="btn-expandir" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </div>
        </nav>
    );
}