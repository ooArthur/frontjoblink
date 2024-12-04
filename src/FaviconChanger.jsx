import React, { useEffect } from "react";

const FaviconChanger = () => {
  useEffect(() => {
    const changeFavicon = (theme) => {
      const favicon = document.getElementById("favicon");
      if (favicon) {
        // Adiciona um parâmetro de tempo ao href para forçar a atualização
        const timestamp = new Date().getTime();
        favicon.href = theme === "dark"
          ? `/favicon-dark.svg?v=${timestamp}`
          : `/favicon-light.svg?v=${timestamp}`;
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Define o favicon inicialmente de acordo com o tema do sistema
    changeFavicon(mediaQuery.matches ? "dark" : "light");

    const handleChange = (event) => {
      changeFavicon(event.matches ? "dark" : "light");
    };

    // Adiciona o listener para mudanças no esquema de cores
    mediaQuery.addEventListener("change", handleChange);

    // Limpar o listener ao desmontar o componente
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
};

export default FaviconChanger;