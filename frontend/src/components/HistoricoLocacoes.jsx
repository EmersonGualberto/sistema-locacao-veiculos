function HistoricoLocacoes({
    locacoes,
    carregando,
    erro,
    finalizandoId,
    finalizarLocacao,
    formatarMoeda,
    formatarData
}) {
    return (
        <section className="dashboard-section">
            <h2>Minhas locações</h2>

            {carregando && <p>Carregando locações...</p>}

            {erro && <p className="erro" role="alert">{erro}</p>}

            {!carregando && !erro && locacoes.length === 0 && (
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
    );
}

export default HistoricoLocacoes;