import axios from "axios";
import { server } from "./api";

const axiosInstance = axios.create({
    baseURL: server,
    withCredentials: true, // Permite que cookies sejam enviados com solicitações
});

// Variáveis para controlar o estado de renovação do token e a fila de requisições
let isRefreshing = false;
let failedRequestsQueue = [];

// Rotas que não necessitam de autenticação
const nonAuthRoutes = [
    '/auth/login',
    '/user/request-password-reset', // Adicionando rota de solicitação de redefinição de senha
    '/user/reset-password',        // Adicionando rota de redefinição de senha
];

// Interceptador de requisições para adicionar o token de acesso
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');

        // Não adiciona o token de autenticação se a rota estiver em `nonAuthRoutes`
        const isNonAuthRoute = nonAuthRoutes.some((route) => config.url.includes(route));
        if (token && !isNonAuthRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptador de respostas para tratar erros e renovar o token se necessário
axiosInstance.interceptors.response.use(
    (response) => response, // Caso a resposta seja bem-sucedida, retorna diretamente
    async (error) => {
        const { status, config } = error.response || {};

        // Verifica se é um erro de 401 ou 403
        const isLoginRequest = config?.url?.includes('/auth/login');
        if ((status === 401 || status === 403) && !isLoginRequest && !config._retry) {
            if (isRefreshing) {
                // Caso o token esteja sendo renovado, adiciona a requisição na fila
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                .then((token) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(config); // Reenvia a requisição com o novo token
                })
                .catch((err) => Promise.reject(err));
            }

            config._retry = true; // Marca que a requisição está tentando renovar o token
            isRefreshing = true;

            try {
                // Faz a requisição para renovar o token, permitindo que o refreshToken seja passado via cookie
                const response = await axios.post(`${server}/api/auth/refresh-token`, {}, { withCredentials: true });
                const { accessToken } = response.data;

                // Armazena o novo token de acesso
                sessionStorage.setItem('accessToken', accessToken);

                // Processa a fila de requisições com o novo token
                failedRequestsQueue.forEach((req) => req.resolve(accessToken));
                failedRequestsQueue = []; // Limpa a fila

                // Atualiza o token de acesso na requisição original e a reenvia
                config.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(config);
            } catch (err) {
                // Limpa a fila de requisições com falha
                failedRequestsQueue.forEach((req) => req.reject(err));
                failedRequestsQueue = [];

                console.error('Erro ao renovar o token', err);

                // Remove o accessToken do sessionStorage, já que o refreshToken está no cookie
                sessionStorage.removeItem('accessToken');

                // Redireciona para a página de login
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false; // Finaliza o processo de renovação
            }
        }

        return Promise.reject(error); // Retorna o erro caso não seja um erro 401 ou 403 ou não precise renovar
    }
);

export default axiosInstance;