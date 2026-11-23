function ListaVeiculos({
    veiculos,
    filtro,
    onAlterarFiltro,
    carregando,
    erro,
    formatarMoeda
}) {
    return (
        <section className="dashboard-section">
            <div className="section-heading">
                <h2>Veículos cadastrados</h2>

                <div className="filter-group">
                    <label htmlFor="filtroDisponibilidade">
                        Disponibilidade:
                    </label>

                    <select
                        id="filtroDisponibilidade"
                        value={filtro}
                        onChange={(evento) => onAlterarFiltro(evento.target.value)}
                    >
                        <option value="todos">Todos os veículos</option>
                        <option value="disponiveis">Somente disponíveis</option>
                    </select>
                </div>
            </div>

            {carregando && <p>Carregando veículos...</p>}

            {erro && <p className="erro" role="alert">{erro}</p>}

            {!carregando && !erro && veiculos.length === 0 && (
                <p>Nenhum veículo encontrado para esse filtro.</p>
            )}

            <div className="dashboard-grid">
                {veiculos.map((veiculo) => (
                    <article className="dashboard-card" key={veiculo.id}>
                        <h3>{veiculo.marca} {veiculo.modelo}</h3>
                        <p>Placa: {veiculo.placa}</p>
                        <p>Ano: {veiculo.ano}</p>
                        <p>Diária: {formatarMoeda(veiculo.valorDiaria)}</p>
                        <p>
                            Disponibilidade:{' '}
                            <strong>
                                {veiculo.disponivel ? 'Disponível' : 'Alugado'}
                            </strong>
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ListaVeiculos;