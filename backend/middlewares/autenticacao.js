import 'dotenv/config';
import jwt from 'jsonwebtoken';

function verificarToken(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
        return res.status(401).json({
            mensagem: 'Token de autenticação não informado.'
        });
    }

    const [tipo, token] = cabecalho.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensagem: 'Formato de token inválido.'
        });
    }

    try {
        const dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = Number(dadosToken.sub);

        return next();
    } catch (erro) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado.'
        });
    }
}

export { verificarToken };