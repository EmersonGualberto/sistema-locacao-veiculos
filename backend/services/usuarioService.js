import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function cadastrarUsuarioService(dadosUsuario) {
    const { nome, email, senha } = dadosUsuario;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    return await prisma.usuario.create({
        data: {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senhaCriptografada
        },
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true
        }
    });
}

async function loginUsuarioService(email, senha) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            email: email.trim().toLowerCase()
        }
    });

    if (!usuario) {
        return null;
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        return null;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não configurado.');
    }

    const token = jwt.sign(
        { sub: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        },
        token
    };
}

export {
    cadastrarUsuarioService,
    loginUsuarioService
};