import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Importa useLocation para obter a URL atual
import { useUser } from '../../../../Context/UserContext';

import './Menu.css';

export default function Menu({ setMenuOpen }) {
    const { handleLogout } = useUser();
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation(); // Obtém a localização atual

    useEffect(() => {
        // Define o item ativo com base na URL
        switch (location.pathname) {
            case '/area-administrador':
                setActiveIndex(0);
                break;
            case '/conta-administrador':
                setActiveIndex(1);
                break;
            case '/relatorio-administrador':
                setActiveIndex(2);
                break;
            case '/denuncias-administrador':
                setActiveIndex(3);
                break;
            case '/crud-administrador':
                setActiveIndex(4);
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
                    <Link to="/area-administrador">
                        <span className="icon"><i className="fa-solid fa-earth-americas"></i></span>
                        <span className="txt-link">Minha Área</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 1 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(1)}
                >
                    <Link to="/conta-administrador">
                        <span className="icon"><i className="fa-solid fa-circle-user"></i></span>
                        <span className="txt-link">Conta</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 2 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(2)}
                >
                    <Link to="/relatorio-administrador">
                        <span className="icon"><i className="fa-solid fa-clipboard-list"></i></span>
                        <span className="txt-link">Relatório</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 3 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(3)}
                >
                    <Link to="/denuncias-administrador">
                        <span className="icon"><i className="fa-solid fa-circle-exclamation"></i></span>
                        <span className="txt-link">Denúncias</span>
                    </Link>
                </li>
                <li
                    className={`item-menu ${activeIndex === 4 ? 'ativo' : ''}`}
                    onClick={() => handleMenuItemClick(4)}
                >
                    <Link to="/crud-administrador">
                        <span className="icon"><span className="material-symbols-outlined">group_add</span></span>
                        <span className="txt-link">CRUD</span>
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