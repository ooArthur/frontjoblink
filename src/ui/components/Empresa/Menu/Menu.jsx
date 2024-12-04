import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '../../../../Context/UserContext';

import './Menu.css';

export default function Menu({ setMenuOpen }) {
    const { handleLogout } = useUser(); // Pega handleLogout do contexto
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case '/area-empresa':
                setActiveIndex(0);
                break;
            case '/conta-empresa':
                setActiveIndex(1);
                break;
            case '/curriculos-favoritos':
                setActiveIndex(2);
                break;
            case '/listar-candidatos':
                setActiveIndex(3);
                break;
            case '/minhas-vagas':
                setActiveIndex(4);
                break;
            default:
                setActiveIndex(0);
                break;
        }
    }, [location.pathname]);

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
                    <Link to="/area-empresa">
                        <span className="icon"><i className="fa-solid fa-earth-americas"></i></span>
                        <span className="txt-link">Minha Área</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 1 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(1)}
                >
                    <Link to="/conta-empresa">
                        <span className="icon"><i className="fa-solid fa-circle-user"></i></span>
                        <span className="txt-link">Conta</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 2 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(2)}
                >
                    <Link to="/curriculos-favoritos">
                        <span className="icon"><i className="fa-regular fa-star"></i></span>
                        <span className="txt-link">Favoritos</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 3 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(3)}
                >
                    <Link to="/listar-candidatos">
                        <span className="icon"><i className="fa-solid fa-address-book"></i></span>
                        <span className="txt-link">Listar Candidatos</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 4 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(4)}
                >
                    <Link to="/minhas-vagas">
                        <span className="icon"><i className="fa-solid fa-rectangle-list"></i></span>
                        <span className="txt-link">Minhas Vagas</span>
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