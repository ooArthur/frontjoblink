import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MenuMobile.css';

export default function MenuMobile() {
    const location = useLocation();

    // Função para verificar se a rota está ativa
    const isActive = (path) => location.pathname === path;

    return (
        <div className="menu-mobile">
            <Link
                to="/area-empresa"
                className={`menu-item-mobile ${isActive('/area-empresa') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-earth-americas"></i>
            </Link>
            <Link
                to="/conta-empresa"
                className={`menu-item-mobile ${isActive('/conta-empresa') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-circle-user"></i>
            </Link>
            <Link
                to="/curriculos-favoritos"
                className={`menu-item-mobile ${isActive('/curriculos-favoritos') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-regular fa-star"></i>
            </Link>
            <Link
                to="/listar-candidatos"
                className={`menu-item-mobile ${isActive('/listar-candidatos') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-address-book"></i>
            </Link>
            <Link
                to="/minhas-vagas"
                className={`menu-item-mobile ${isActive('/minhas-vagas') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-rectangle-list"></i>
            </Link>
        </div>
    );
}
