
const API_URL = 'http://localhost:3000';

async function requisicaoAPI(endpoint, opcoes = {}) {
    const token = localStorage.getItem('token');

    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            ...opcoes.headers,
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || dados.message || 'Erro na comunicação com o servidor.'
        );
    }

    return dados;
}

export { requisicaoAPI };
