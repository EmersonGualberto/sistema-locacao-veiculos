
import { prisma } from '../prisma.js';

function criarErro(mensagem, statusCode) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function registrarLocacaoService(usuarioId, dadosLocacao) {
    const { veiculoId, dataInicio, dataPrevistaDevolucao } = dadosLocacao;

    const inicio = new Date(dataInicio);
    const devolucaoPrevista = new Date(dataPrevistaDevolucao);

    if (
        Number.isNaN(inicio.getTime()) ||
        Number.isNaN(devolucaoPrevista.getTime())
    ) {
        throw criarErro('Informe datas válidas para a locação.', 400);
    }

    if (devolucaoPrevista <= inicio) {
        throw criarErro(
            'A data prevista de devolução deve ser posterior ao início.',
            400
        );
    }

    const duracao = devolucaoPrevista.getTime() - inicio.getTime();
    const quantidadeDias = Math.ceil(duracao / (1000 * 60 * 60 * 24));

    return await prisma.$transaction(async (transacao) => {
        const veiculo = await transacao.veiculo.findUnique({
            where: { id: veiculoId }
        });

        if (!veiculo) {
            throw criarErro('Veículo não encontrado.', 404);
        }

        const atualizacaoVeiculo = await transacao.veiculo.updateMany({
            where: {
                id: veiculoId,
                disponivel: true
            },
            data: {
                disponivel: false
            }
        });

        if (atualizacaoVeiculo.count !== 1) {
            throw criarErro('Este veículo não está disponível.', 409);
        }

        const valorTotal = Math.round(
            Number(veiculo.valorDiaria) * quantidadeDias * 100
        ) / 100;

        return await transacao.locacao.create({
            data: {
                usuarioId,
                veiculoId,
                dataInicio: inicio,
                dataPrevistaDevolucao: devolucaoPrevista,
                valorTotal,
                status: 'ATIVA'
            },
            include: {
                veiculo: {
                    select: {
                        marca: true,
                        modelo: true,
                        placa: true,
                        valorDiaria: true
                    }
                }
            }
        });
    });
}

async function listarLocacoesService(usuarioId) {
    return await prisma.locacao.findMany({
        where: {
            usuarioId
        },
        orderBy: {
            id: 'desc'
        },
        include: {
            veiculo: {
                select: {
                    marca: true,
                    modelo: true,
                    placa: true
                }
            }
        }
    });
}

async function finalizarLocacaoService(locacaoId, usuarioId) {
    return await prisma.$transaction(async (transacao) => {
        const locacao = await transacao.locacao.findFirst({
            where: {
                id: locacaoId,
                usuarioId
            }
        });

        if (!locacao) {
            throw criarErro(
                'Locação não encontrada para este usuário.',
                404
            );
        }

        if (locacao.status !== 'ATIVA') {
            throw criarErro('Esta locação já foi finalizada.', 409);
        } 
         
        const agora = new Date()

        if (agora < locacao.dataInicio) {
    throw criarErro(
        'Não é possível finalizar uma locação antes da data de início.',
        409
    );
}

        const atualizacaoLocacao = await transacao.locacao.updateMany({
            where: {
                id: locacaoId,
                usuarioId,
                status: 'ATIVA'
            },
            data: {
                status: 'FINALIZADA',
                dataDevolucao: agora
            }
        });

        if (atualizacaoLocacao.count !== 1) {
            throw criarErro(
                'Não foi possível finalizar esta locação.',
                409
            );
        }

        await transacao.veiculo.update({
            where: {
                id: locacao.veiculoId
            },
            data: {
                disponivel: true
            }
        });

        return await transacao.locacao.findUnique({
            where: {
                id: locacaoId
            },
            include: {
                veiculo: {
                    select: {
                        marca: true,
                        modelo: true,
                        placa: true
                    }
                }
            }
        });
    });
}

export {
    registrarLocacaoService,
    listarLocacoesService,
    finalizarLocacaoService
};
