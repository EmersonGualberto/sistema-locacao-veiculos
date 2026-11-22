
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requisicaoAPI } from '../services/api';

function Login() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        email: '',
        senha: ''
    });

    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

    function atualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function realizarLogin(evento) {
        evento.preventDefault();

        setMensagem('');
        setCarregando(true);

        try {
            const dados = await requisicaoAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formulario)
            });

            localStorage.setItem('token', dados.token);

            localStorage.setItem(
                'usuario',
                JSON.stringify(dados.usuario)
            );

            navigate('/dashboard');

        } catch (erro) {
            setMensagem(erro.message);

        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="auth-container">
            <section className="auth-card">
                <h1>Locadora Veículos</h1>
                <p>Acesse sua conta para continuar.</p>

                <form onSubmit={realizarLogin}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                            value={formulario.email}
                            onChange={atualizarCampo}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Digite sua senha"
                            value={formulario.senha}
                            onChange={atualizarCampo}
                            required
                        />
                    </div>

                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {mensagem && (
                    <p className="erro" role="alert">
                        {mensagem}
                    </p>
                )}

                <p className="auth-link">
                    Ainda não possui conta?{' '}
                    <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;
