import React, { useEffect, useState } from 'react';

export default function AdministradorName() {
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

    return (
        <h1>
            Olá, Administrador <br />
            <p className="Date">{dataFormatada}</p>
        </h1>
    );
}