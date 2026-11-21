
import { prisma } from '../prisma.js';

async function listarVeiculosService() {
    return await prisma.veiculo.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

async function listarVeiculosDisponiveisService() {
    return await prisma.veiculo.findMany({
        where: {
            disponivel: true
        },
        orderBy: {
            id: 'asc'
        }
    });
}

async function cadastrarVeiculoService(dadosVeiculo) {
    const {
        marca,
        modelo,
        placa,
        ano,
        valorDiaria
    } = dadosVeiculo;

    if (Number(valorDiaria) <= 0) {
        throw new Error('O valor da diária deve ser maior que zero.');
    }

    return await prisma.veiculo.create({
        data: {
            marca: marca.trim(),
            modelo: modelo.trim(),
            placa: placa.trim().toUpperCase(),
            ano: Number(ano),
            valorDiaria: Number(valorDiaria)
        }
    });
}

export {
    listarVeiculosService,
    listarVeiculosDisponiveisService,
    cadastrarVeiculoService
};


