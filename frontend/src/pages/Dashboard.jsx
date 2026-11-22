
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicaoAPI } from '../services/api';

function obterDataHoraLocal() {
    const agora = new Date();
    const ajusteFuso = agora.getTimezoneOffset() * 60000;

    return new Date(agora.getTime() - ajusteFuso)
        .toISOString()
        .slice(0, 16);
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR');
}

function Dashboard() {
    const navigate = useNavigate();

    const [veiculos, setVeiculos] = useState([]);
    const [locacoes, setLocacoes] = useState([]);

    const [carregandoVeiculos, setCarregandoVeiculos] = useState(true);
    const [carregandoLocacoes, setCarregandoLocacoes] = useState(true);

    const [erroVeiculos, setErroVeiculos] = useState('');
    const [erroLocacoes, setErroLocacoes] = useState('');

    const [formulario, setFormulario] = useState({
        veiculoId: '',
        dataInicio: obterDataHoraLocal(),
        dataPrevistaDevolucao: ''
    });

    const [enviando, setEnviando] = useState(false);
    const [finalizandoId, setFinalizandoId] = useState(null);
    const [mensagemAcao, setMensagemAcao] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    const carregarDados = useCallback(async () => {
        setCarregandoVeiculos(true);
        setCarregandoLocacoes(true);

        setErroVeiculos('');
        setErroLocacoes('');

        try {
            const dadosVeiculos = await requisicaoAPI('/veiculos/disponiveis');
            setVeiculos(dadosVeiculos);
        } catch (erro) {
            setErroVeiculos(erro.message);
        } finally {
            setCarregandoVeiculos(false);
        }

        try {
            const dadosLocacoes = await requisicaoAPI('/locacoes');
            setLocacoes(dadosLocacoes);
        } catch (erro) {
            setErroLocacoes(erro.message);
        } finally {
            setCarregandoLocacoes(false);
        }
    }, []);

    useEffect(() => {
        const iniciarCarregamento = async () => {
            await carregarDados();
        }

        iniciarCarregamento();
    }, [carregarDados]);

    function atualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario((atual) => ({
            ...atual,
            [name]: value
        }));
    }

    async function registrarLocacao(evento) {
        evento.preventDefault();

        setMensagemAcao('');
        setTipoMensagem('');

        if (
            !formulario.veiculoId ||
            !formulario.dataInicio ||
            !formulario.dataPrevistaDevolucao
        ) {
            setMensagemAcao('Preencha todos os campos da locação.');
            setTipoMensagem('erro');
            return;
        }

        const inicio = new Date(formulario.dataInicio);
        const devolucao = new Date(formulario.dataPrevistaDevolucao);

        if (
            Number.isNaN(inicio.getTime()) ||
            Number.isNaN(devolucao.getTime()) ||
            devolucao <= inicio
        ) {
            setMensagemAcao(
                'A devolução prevista deve ser posterior ao início da locação.'
            );
            setTipoMensagem('erro');
            return;
        }

        setEnviando(true);

        try {
            const dados = await requisicaoAPI('/locacoes', {
                method: 'POST',
                body: JSON.stringify({
                    veiculoId: Number(formulario.veiculoId),
                    dataInicio: inicio.toISOString(),
                    dataPrevistaDevolucao: devolucao.toISOString()
                })
            });

            setMensagemAcao(dados.mensagem);
            setTipoMensagem('sucesso');

            setFormulario({
                veiculoId: '',
                dataInicio: obterDataHoraLocal(),
                dataPrevistaDevolucao: ''
            });

            await carregarDados();
        } catch (erro) {
            setMensagemAcao(erro.message);
            setTipoMensagem('erro');
        } finally {
            setEnviando(false);
        }
    }

    async function finalizarLocacao(locacaoId) {
        setMensagemAcao('');
        setTipoMensagem('');
        setFinalizandoId(locacaoId);

        try {
            const dados = await requisicaoAPI(
                `/locacoes/${locacaoId}/finalizar`,
                {
                    method: 'PATCH'
                }
            );

            setMensagemAcao(dados.mensagem);
            setTipoMensagem('sucesso');

            setLocacoes((atuais) =>
                atuais.map((locacao) =>
                    locacao.id === dados.locacao.id
                    ? dados.locacao
                    : locacao
                )
            );

            await carregarDados();
        } catch (erro) {
            setMensagemAcao(erro.message);
            setTipoMensagem('erro');
        } finally {
            setFinalizandoId(null);
        }
    }

    function sair() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        navigate('/', { replace: true });
    }

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <h1>Locadora de Veículos</h1>

                <button type="button" onClick={sair}>
                    Sair
                </button>
            </header>

            <section className="dashboard-content">
                <h2>Bem-vindo ao sistema!</h2>

                <p>
                    Consulte os veículos disponíveis e acompanhe suas locações.
                </p>

                {mensagemAcao && (
                    <p
                        className={tipoMensagem === 'sucesso' ? 'sucesso' : 'erro'}
                        role="alert"
                    >
                        {mensagemAcao}
                    </p>
                )}

                <section className="dashboard-section">
                    <h2>Alugar veículo</h2>

                    {carregandoVeiculos && <p>Carregando veículos...</p>}

                    {erroVeiculos && (
                        <p className="erro" role="alert">{erroVeiculos}</p>
                    )}

                    {!carregandoVeiculos && !erroVeiculos && veiculos.length === 0 && (
                        <p>Não existem veículos disponíveis para locação.</p>
                    )}

                    {!carregandoVeiculos && veiculos.length > 0 && (
                        <form onSubmit={registrarLocacao} className="dashboard-card">
                            <div>
                                <label htmlFor="veiculoId">Escolha o veículo:</label>

                                <select
                                    id="veiculoId"
                                    name="veiculoId"
                                    value={formulario.veiculoId}
                                    onChange={atualizarCampo}
                                    required
                                >
                                    <option value="">Selecione um veículo</option>

                                    {veiculos.map((veiculo) => (
                                        <option key={veiculo.id} value={veiculo.id}>
                                            {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="dataInicio">Data e hora de início:</label>

                                <input
                                    type="datetime-local"
                                    id="dataInicio"
                                    name="dataInicio"
                                    value={formulario.dataInicio}
                                    min={obterDataHoraLocal()}
                                    onChange={atualizarCampo}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="dataPrevistaDevolucao">
                                    Data e hora da devolução prevista:
                                </label>

                                <input
                                    type="datetime-local"
                                    id="dataPrevistaDevolucao"
                                    name="dataPrevistaDevolucao"
                                    value={formulario.dataPrevistaDevolucao}
                                    min={formulario.dataInicio || obterDataHoraLocal()}
                                    onChange={atualizarCampo}
                                    required
                                />
                            </div>

                            <button type="submit" disabled={enviando}>
                                {enviando ? 'Registrando...' : 'Confirmar locação'}
                            </button>
                        </form>
                    )}
                </section>

                <section className="dashboard-section">
                    <h2>Veículos disponíveis</h2>

                    {carregandoVeiculos && <p>Carregando veículos...</p>}

                    {!carregandoVeiculos && !erroVeiculos && veiculos.length === 0 && (
                        <p>Nenhum veículo disponível no momento.</p>
                    )}

                    <div className="dashboard-grid">
                        {veiculos.map((veiculo) => (
                            <article className="dashboard-card" key={veiculo.id}>
                                <h3>{veiculo.marca} {veiculo.modelo}</h3>
                                <p>Placa: {veiculo.placa}</p>
                                <p>Ano: {veiculo.ano}</p>
                                <p>Diária: {formatarMoeda(veiculo.valorDiaria)}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Minhas locações</h2>

                    {carregandoLocacoes && <p>Carregando locações...</p>}

                    {erroLocacoes && (
                        <p className="erro" role="alert">{erroLocacoes}</p>
                    )}

                    {!carregandoLocacoes && !erroLocacoes && locacoes.length === 0 && (
                        <p>Você ainda não possui locações.</p>
                    )}

                    <div className="dashboard-grid">
                        {locacoes.map((locacao) => (
                            <article className="dashboard-card" key={locacao.id}>
                                <h3>
                                    {locacao.veiculo.marca} {locacao.veiculo.modelo}
                                </h3>

                                <p>Placa: {locacao.veiculo.placa}</p>
                                <p>Início: {formatarData(locacao.dataInicio)}</p>

                                <p>
                                    Devolução prevista:{' '}
                                    {formatarData(locacao.dataPrevistaDevolucao)}
                                </p>

                                <p>Valor total: {formatarMoeda(locacao.valorTotal)}</p>
                                <p>Status: {locacao.status}</p>

                                {locacao.status === 'ATIVA' && (
                                    <button
                                        type="button"
                                        disabled={finalizandoId === locacao.id}
                                        onClick={() => finalizarLocacao(locacao.id)}
                                    >
                                        {finalizandoId === locacao.id
                                            ? 'Finalizando...'
                                            : 'Finalizar locação'}
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}

export default Dashboard;



