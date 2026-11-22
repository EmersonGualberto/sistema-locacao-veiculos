
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requisicaoAPI } from '../services/api';

function Cadastro() {
    const [formulario, setFormulario] = useState({
        nome: '',
        email: '',
        senha: ''
    });

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

    function atualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function cadastrarUsuario(evento) {
        evento.preventDefault();

        setMensagem('');
        setTipoMensagem('');
        setCarregando(true);

        try {
            const dados = await requisicaoAPI('/usuarios', {
                method: 'POST',
                body: JSON.stringify(formulario)
            });

            setMensagem(dados.mensagem);
            setTipoMensagem('sucesso');

            setFormulario({
                nome: '',
                email: '',
                senha: ''
            });

        } catch (erro) {
            setMensagem(erro.message);
            setTipoMensagem('erro');

        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="auth-container">
            <section className="auth-card">
                <h1>Criar conta</h1>
                <p>Preencha os dados para se cadastrar.</p>

                <form onSubmit={cadastrarUsuario}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            placeholder="Seu nome completo"
                            value={formulario.nome}
                            onChange={atualizarCampo}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Seu e-mail"
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
                            placeholder="Mínimo de 8 caracteres"
                            value={formulario.senha}
                            onChange={atualizarCampo}
                            minLength={8}
                            required
                        />
                    </div>

                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                {mensagem && (
                    <p className={tipoMensagem} role="status">
                        {mensagem}
                    </p>
                )}

                <p className="auth-link">
                    Já possui conta? <Link to="/">Faça login</Link>
                </p>
            </section>
        </main>
    );
}

export default Cadastro;

