
import * as veiculoService from '../services/veiculoService.js';

async function listarVeiculos(req, res) {
    try {
        const resultado = await veiculoService.listarVeiculosService();

        res.status(200).json(resultado);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar veículos.'
        });
    }
}

async function listarVeiculosDisponiveis(req, res) {
    try {
        const resultado = await veiculoService.listarVeiculosDisponiveisService();

        res.status(200).json(resultado);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar veículos disponíveis.'
        });
    }
}

async function cadastrarVeiculo(req, res) {
    const {
        marca,
        modelo,
        placa,
        ano,
        valorDiaria
    } = req.body;

    if (
        typeof marca !== 'string' ||
        !marca.trim() ||
        typeof modelo !== 'string' ||
        !modelo.trim() ||
        typeof placa !== 'string' ||
        !placa.trim() ||
        ano === undefined ||
        valorDiaria === undefined
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    if (
        !Number.isInteger(Number(ano)) ||
        !Number.isFinite(Number(valorDiaria)) ||
        Number(valorDiaria) <= 0
    ) {
        return res.status(400).json({
            mensagem: 'Informe um ano válido e um valor de diária positivo.'
        });
    }

    try {
        const novoVeiculo = await veiculoService.cadastrarVeiculoService({
            marca,
            modelo,
            placa,
            ano,
            valorDiaria
        });

        return res.status(201).json({
            mensagem: 'Veículo cadastrado com sucesso!',
            veiculo: novoVeiculo
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === 'P2002') {
            return res.status(409).json({
                mensagem: 'Já existe um veículo cadastrado com essa placa.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar veículo.'
        });
    }
}

export {
    listarVeiculos,
    listarVeiculosDisponiveis,
    cadastrarVeiculo
};




