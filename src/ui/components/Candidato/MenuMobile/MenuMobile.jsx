import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MenuMobile.css';

export default function MenuMobile() {
    const location = useLocation();

    // Função para verificar se a rota está ativa
    const isActive = (path) => location.pathname === path;

    /* LEMBRAR DE FAZER UMA VERIFICAÇÃO DO TIPO DE USUÁRIO PARA MUDAR OS ITENS DO MENU */
    return (
        <div className="menu-mobile">
            <Link
                to="/area-candidato"
                className={`menu-item-mobile ${isActive('/area-candidato') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-earth-americas"></i>
            </Link>
            <Link
                to="/conta-candidato"
                className={`menu-item-mobile ${isActive('/conta-candidato') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-circle-user"></i>
            </Link>
            <Link
                to="/vagas-favoritas"
                className={`menu-item-mobile ${isActive('/vagas-favoritas') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-regular fa-star"></i>
            </Link>
            <Link
                to="/curriculos-enviados"
                className={`menu-item-mobile ${isActive('/curriculos-enviados') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-address-book"></i>
            </Link>
            <Link
                to="/listar-vagas"
                className={`menu-item-mobile ${isActive('/listar-vagas') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-rectangle-list"></i>
            </Link>
            <Link
                to="/listar-empresas"
                className={`menu-item-mobile ${isActive('/listar-empresas') ? 'menu-item-mobile-selected' : ''}`}
            >
                <i className="fa-solid fa-location-dot"></i>
            </Link>
        </div>
    );
}
