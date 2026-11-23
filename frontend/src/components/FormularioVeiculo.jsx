import { useState } from 'react';

function FormularioVeiculo({ onCadastrar, enviando }) {
    const [formulario, setFormulario] = useState({
        marca: '',
        modelo: '',
        placa: '',
        ano: '',
        valorDiaria: ''
    });

    function atualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario((atual) => ({
            ...atual,
            [name]: value
        }));
    }

    async function enviarFormulario(evento) {
        evento.preventDefault();

        const cadastrado = await onCadastrar(formulario);

        if (cadastrado) {
            setFormulario({
                marca: '',
                modelo: '',
                placa: '',
                ano: '',
                valorDiaria: ''
            });
        }
    }

    return (
        <form className="dashboard-card" onSubmit={enviarFormulario}>
            <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input
                    id="marca"
                    name="marca"
                    value={formulario.marca}
                    onChange={atualizarCampo}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="modelo">Modelo</label>
                <input
                    id="modelo"
                    name="modelo"
                    value={formulario.modelo}
                    onChange={atualizarCampo}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="placa">Placa</label>
                <input
                    id="placa"
                    name="placa"
                    value={formulario.placa}
                    onChange={atualizarCampo}
                    placeholder="ABC1D23"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="ano">Ano</label>
                <input
                    type="number"
                    id="ano"
                    name="ano"
                    min="1900"
                    max="2100"
                    value={formulario.ano}
                    onChange={atualizarCampo}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="valorDiaria">Valor da diária (R$)</label>
                <input
                    type="number"
                    id="valorDiaria"
                    name="valorDiaria"
                    min="0.01"
                    step="0.01"
                    value={formulario.valorDiaria}
                    onChange={atualizarCampo}
                    required
                />
            </div>

            <button type="submit" disabled={enviando}>
                {enviando ? 'Cadastrando...' : 'Cadastrar veículo'}
            </button>
        </form>
    );
}

export default FormularioVeiculo;