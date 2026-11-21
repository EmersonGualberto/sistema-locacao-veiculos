import express from 'express';
import * as veiculoController from '../controllers/veiculoController.js';
import * as usuarioController from '../controllers/usuarioController.js';
import * as locacaoController from '../controllers/locacaoController.js';
import { verificarToken } from '../middlewares/autenticacao.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Rota principal funcionando!');
});


router.post('/usuarios', usuarioController.cadastrarUsuario);
router.post('/auth/login', usuarioController.loginUsuario);


router.get('/veiculos',verificarToken, veiculoController.listarVeiculos);
router.get('/veiculos/disponiveis', verificarToken,  veiculoController.listarVeiculosDisponiveis);
router.post('/veiculos', verificarToken,  veiculoController.cadastrarVeiculo);



router.post('/locacoes', verificarToken, locacaoController.registrarLocacao);
router.get('/locacoes', verificarToken, locacaoController.listarLocacoes);
router.patch('/locacoes/:id/finalizar', verificarToken, locacaoController.finalizarLocacao);

export default router;




