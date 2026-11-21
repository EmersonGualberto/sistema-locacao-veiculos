import * as usuarioService from '../services/usuarioService.js';

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    if (
        typeof nome !== 'string' ||
        !nome.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof senha !== 'string' ||
        senha.length < 8
    ) {
        return res.status(400).json({
            mensagem: 'Informe nome, e-mail válido e senha com pelo menos 8 caracteres.'
        });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
        return res.status(400).json({
            mensagem: 'Informe um e-mail válido.'
        });
    }

    try {
        const novoUsuario = await usuarioService.cadastrarUsuarioService({
            nome,
            email,
            senha
        });

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: novoUsuario
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === 'P2002') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.'
        });
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body;

    if (
        typeof email !== 'string' ||
        !email.trim() ||
        typeof senha !== 'string' ||
        !senha
    ) {
        return res.status(400).json({
            mensagem: 'Informe o e-mail e a senha.'
        });
    }

    try {
        const resultado = await usuarioService.loginUsuarioService(
            email,
            senha
        );

        if (!resultado) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            ...resultado
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: 'Erro ao realizar login.'
        });
    }
}

export {
    cadastrarUsuario,
    loginUsuario
};