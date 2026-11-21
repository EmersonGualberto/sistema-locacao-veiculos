
import * as locacaoService from '../services/locacaoService.js';

async function registrarLocacao(req, res) {
    const { veiculoId, dataInicio, dataPrevistaDevolucao } = req.body;

    if (
        !Number.isInteger(Number(veiculoId)) ||
        Number(veiculoId) <= 0 ||
        typeof dataInicio !== 'string' ||
        !dataInicio.trim() ||
        typeof dataPrevistaDevolucao !== 'string' ||
        !dataPrevistaDevolucao.trim()
    ) {
        return res.status(400).json({
            mensagem: 'Informe o veículo e as datas da locação.'
        });
    }

    try {
        const locacao = await locacaoService.registrarLocacaoService(
            req.usuarioId,
            {
                veiculoId: Number(veiculoId),
                dataInicio,
                dataPrevistaDevolucao
            }
        );

        return res.status(201).json({
            mensagem: 'Locação registrada com sucesso!',
            locacao
        });
    } catch (erro) {
        if (erro.statusCode) {
            return res.status(erro.statusCode).json({
                mensagem: erro.message
            });
        }

        console.error(erro);

        return res.status(500).json({
            mensagem: 'Erro ao registrar locação.'
        });
    }
}

async function listarLocacoes(req, res) {
    try {
        const locacoes = await locacaoService.listarLocacoesService(
            req.usuarioId
        );

        return res.status(200).json(locacoes);
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: 'Erro ao consultar locações.'
        });
    }
}

async function finalizarLocacao(req, res) {
    const locacaoId = Number(req.params.id);

    if (!Number.isInteger(locacaoId) || locacaoId <= 0) {
        return res.status(400).json({
            mensagem: 'Informe um identificador de locação válido.'
        });
    }

    try {
        const locacao = await locacaoService.finalizarLocacaoService(
            locacaoId,
            req.usuarioId
        );

        return res.status(200).json({
            mensagem: 'Locação finalizada com sucesso!',
            locacao
        });
    } catch (erro) {
        if (erro.statusCode) {
            return res.status(erro.statusCode).json({
                mensagem: erro.message
            });
        }

        console.error(erro);

        return res.status(500).json({
            mensagem: 'Erro ao finalizar locação.'
        });
    }
}

export {
    registrarLocacao,
    listarLocacoes,
    finalizarLocacao
};
