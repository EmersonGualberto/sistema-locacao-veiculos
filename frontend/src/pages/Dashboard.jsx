import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicaoAPI } from '../services/api';

import FormularioVeiculo from '../components/FormularioVeiculo';
import ListaVeiculos from '../components/ListaVeiculos';
import FormularioLocacao from '../components/FormularioLocacao';
import HistoricoLocacoes from '../components/HistoricoLocacoes';

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

function obterUsuarioLogado() {
    try {
        return JSON.parse(localStorage.getItem('usuario')) || {};
    } catch {
        return {};
    }
}

function Dashboard() {
    const navigate = useNavigate();

    const [usuario] = useState(obterUsuarioLogado);
    const [veiculos, setVeiculos] = useState([]);
    const [locacoes, setLocacoes] = useState([]);

    const [filtro, setFiltro] = useState('todos');

    const [carregandoVeiculos, setCarregandoVeiculos] = useState(true);
    const [carregandoLocacoes, setCarregandoLocacoes] = useState(true);

    const [erroVeiculos, setErroVeiculos] = useState('');
    const [erroLocacoes, setErroLocacoes] = useState('');

    const [formularioLocacao, setFormularioLocacao] = useState({
        veiculoId: '',
        dataInicio: obterDataHoraLocal(),
        dataPrevistaDevolucao: ''
    });

    const [enviandoLocacao, setEnviandoLocacao] = useState(false);
    const [enviandoVeiculo, setEnviandoVeiculo] = useState(false);
    const [finalizandoId, setFinalizandoId] = useState(null);

    const [mensagemAcao, setMensagemAcao] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    const carregarDados = useCallback(async () => {
        setCarregandoVeiculos(true);
        setCarregandoLocacoes(true);

        setErroVeiculos('');
        setErroLocacoes('');

        try {
            const dadosVeiculos = await requisicaoAPI('/veiculos');
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
        };        
        void iniciarCarregamento();
    }, [carregarDados]);

    const veiculosFiltrados = veiculos.filter((veiculo) => {
        if (filtro === 'disponiveis') {
            return veiculo.disponivel;
        }

        return true;
    });

    const veiculosDisponiveis = veiculos.filter(
        (veiculo) => veiculo.disponivel
    );

    function atualizarCampoLocacao(evento) {
        const { name, value } = evento.target;

        setFormularioLocacao((atual) => ({
            ...atual,
            [name]: value
        }));
    }

    async function cadastrarVeiculo(formulario) {
        setMensagemAcao('');
        setTipoMensagem('');

        setEnviandoVeiculo(true);

        try {
            const dados = await requisicaoAPI('/veiculos', {
                method: 'POST',
                body: JSON.stringify({
                    marca: formulario.marca,
                    modelo: formulario.modelo,
                    placa: formulario.placa,
                    ano: Number(formulario.ano),
                    valorDiaria: Number(formulario.valorDiaria)
                })
            });

            setMensagemAcao(
                dados.mensagem || 'Veículo cadastrado com sucesso!'
            );
            setTipoMensagem('sucesso');

            await carregarDados();

            return true;
        } catch (erro) {
            setMensagemAcao(erro.message);
            setTipoMensagem('erro');

            return false;
        } finally {
            setEnviandoVeiculo(false);
        }
    }

    async function registrarLocacao(evento) {
        evento.preventDefault();

        setMensagemAcao('');
        setTipoMensagem('');

        if (
            !formularioLocacao.veiculoId ||
            !formularioLocacao.dataInicio ||
            !formularioLocacao.dataPrevistaDevolucao
        ) {
            setMensagemAcao('Preencha todos os campos da locação.');
            setTipoMensagem('erro');
            return;
        }

        const inicio = new Date(formularioLocacao.dataInicio);
        const devolucao = new Date(
            formularioLocacao.dataPrevistaDevolucao
        );

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

        setEnviandoLocacao(true);

        try {
            const dados = await requisicaoAPI('/locacoes', {
                method: 'POST',
                body: JSON.stringify({
                    veiculoId: Number(formularioLocacao.veiculoId),
                    dataInicio: inicio.toISOString(),
                    dataPrevistaDevolucao: devolucao.toISOString()
                })
            });

            setMensagemAcao(dados.mensagem || 'Locação registrada com sucesso!');
            setTipoMensagem('sucesso');

            setFormularioLocacao({
                veiculoId: '',
                dataInicio: obterDataHoraLocal(),
                dataPrevistaDevolucao: ''
            });

            await carregarDados();
        } catch (erro) {
            setMensagemAcao(erro.message);
            setTipoMensagem('erro');
        } finally {
            setEnviandoLocacao(false);
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

            setMensagemAcao(dados.mensagem || 'Locação finalizada com sucesso!');
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
                <div>
                    <h1>Locadora de Veículos</h1>
                    <p className="usuario-logado">
                        Usuário: {usuario.nome || usuario.email || 'Autenticado'}
                    </p>
                </div>

                <button type="button" onClick={sair}>
                    Sair
                </button>
            </header>

            <section className="dashboard-content">
                <h2>Bem-vindo ao sistema!</h2>

                <p>
                    Consulte os veículos, realize locações e acompanhe seu histórico.
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
                    <h2>Cadastrar veículo</h2>

                    <FormularioVeiculo
                        onCadastrar={cadastrarVeiculo}
                        enviando={enviandoVeiculo}
                    />
                </section>

                <ListaVeiculos
                    veiculos={veiculosFiltrados}
                    filtro={filtro}
                    onAlterarFiltro={setFiltro}
                    carregando={carregandoVeiculos}
                    erro={erroVeiculos}
                    formatarMoeda={formatarMoeda}
                />

                <FormularioLocacao
                    veiculos={veiculosDisponiveis}
                    formulario={formularioLocacao}
                    atualizarCampo={atualizarCampoLocacao}
                    registrarLocacao={registrarLocacao}
                    enviando={enviandoLocacao}
                    obterDataHoraLocal={obterDataHoraLocal}
                />

                <HistoricoLocacoes
                    locacoes={locacoes}
                    carregando={carregandoLocacoes}
                    erro={erroLocacoes}
                    finalizandoId={finalizandoId}
                    finalizarLocacao={finalizarLocacao}
                    formatarMoeda={formatarMoeda}
                    formatarData={formatarData}
                />
            </section>
        </main>
    );
}

export default Dashboard;
