function FormularioLocacao({
    veiculos,
    formulario,
    atualizarCampo,
    registrarLocacao,
    enviando,
    obterDataHoraLocal
}) {
    return (
        <section className="dashboard-section">
            <h2>Alugar veículo</h2>

            {veiculos.length === 0 && (
                <p>Não existem veículos disponíveis para locação.</p>
            )}

            {veiculos.length > 0 && (
                <form onSubmit={registrarLocacao} className="dashboard-card">
                    <div className="form-group">
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

                    <div className="form-group">
                        <label htmlFor="dataInicio">
                            Data e hora de início:
                        </label>

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

                    <div className="form-group">
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
    );
}

export default FormularioLocacao;