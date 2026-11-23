
# Sistema de Locação de Veículos

Sistema web desenvolvido como projeto acadêmico da disciplina **Programação com Frameworks Web**.

A aplicação permite cadastrar usuários, realizar autenticação, gerenciar veículos, registrar locações e finalizar devoluções. O sistema utiliza uma API REST com Node.js e Express, banco de dados MySQL gerenciado pelo Prisma ORM e interface desenvolvida com React.

## Tecnologias utilizadas

### Backend
- Node.js
- JavaScript
- Express
- Prisma ORM
- MySQL
- JWT (JSON Web Token)
- bcrypt
- CORS

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

## Funcionalidades

### Usuários
- Cadastro de novos usuários.
- Login com e-mail e senha.
- Senhas protegidas com bcrypt.
- Autenticação utilizando JWT.
- Identificação do usuário autenticado.
- Logout.

### Veículos
- Cadastro de veículos.
- Consulta dos veículos cadastrados.
- Filtro para exibir todos os veículos ou somente os disponíveis.
- Validação de placas duplicadas.
- Validação do valor da diária.
- Atualização da disponibilidade conforme as locações.

### Locações
- Registro de locações.
- Seleção do veículo e das datas de início e devolução prevista.
- Cálculo do valor total pelo backend.
- Consulta do histórico de locações do usuário autenticado.
- Visualização do status da locação.
- Finalização de locações.
- Liberação do veículo após a devolução.

## Regras de negócio

1. Um veículo não pode possuir duas locações ativas simultaneamente.
2. Ao registrar uma locação, o veículo fica indisponível.
3. Ao finalizar uma locação, o veículo volta a ficar disponível.
4. Uma locação finalizada não pode ser finalizada novamente.
5. A data prevista de devolução deve ser posterior à data de início.
6. O valor total é calculado com base na quantidade de diárias e no valor da diária do veículo.
7. Períodos fracionados são arredondados para uma diária completa.
8. Cada usuário pode consultar e finalizar somente suas próprias locações.
9. As operações protegidas exigem autenticação JWT.
10. O histórico de locações é preservado após a devolução.

## Estrutura do projeto

```text
sistema-locacao-veiculos/
├── backend/
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── veiculoController.js
│   │   └── locacaoController.js
│   ├── middlewares/
│   │   └── autenticacao.js
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── routes/
│   │   └── index.js
│   ├── services/
│   │   ├── usuarioService.js
│   │   ├── veiculoService.js
│   │   └── locacaoService.js
│   ├── .env.example
│   ├── index.js
│   ├── prisma.config.ts
│   ├── prisma.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Cadastro.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

## Pré-requisitos

Para executar o projeto em outra máquina, é necessário:

- Git
- Node.js e npm (recomendado Node.js 26, versão utilizada no desenvolvimento)
- MySQL Server 8
- Um terminal para o backend e outro para o frontend

O projeto foi desenvolvido e testado no Pop!_OS. Os comandos de instalação do MySQL apresentados abaixo são destinados ao Ubuntu/Pop!_OS. Em outros sistemas operacionais, a instalação e o acesso administrativo ao MySQL podem ser diferentes.

## Instalação e execução

### 1. Clonar o projeto

```bash
git clone https://github.com/EmersonGualberto/sistema-locacao-veiculos.git
cd sistema-locacao-veiculos
```

### 2. Configurar o MySQL

No Ubuntu/Pop!_OS, verifique se o MySQL está funcionando:

```bash
sudo systemctl status mysql
```

Se necessário, inicie o serviço:

```bash
sudo systemctl start mysql
```

Acesse o MySQL com uma conta administrativa:

```bash
sudo mysql
```

Crie o banco de dados e um usuário para a aplicação:

```sql
CREATE DATABASE IF NOT EXISTS locacao_veiculos;

CREATE USER IF NOT EXISTS 'locacao_app'@'localhost'
IDENTIFIED BY 'SENHA_FORTE_AQUI';

GRANT ALL PRIVILEGES ON locacao_veiculos.*
TO 'locacao_app'@'localhost';

EXIT;
```

Substitua `SENHA_FORTE_AQUI` por uma senha própria. Caso o usuário já exista, o comando `CREATE USER IF NOT EXISTS` não altera sua senha.

O comando `prisma migrate deploy`, utilizado neste projeto, aplica as migrações existentes e não exige a criação de um shadow database. Para desenvolver novas migrações com `prisma migrate dev`, podem ser necessárias permissões adicionais.

### 3. Instalar as dependências do backend

Na raiz do projeto:

```bash
cd backend
npm ci
```

### 4. Configurar as variáveis de ambiente do backend

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite o arquivo e configure:

```env
DATABASE_URL="mysql://locacao_app:SENHA_FORTE_AQUI@127.0.0.1:3306/locacao_veiculos"
JWT_SECRET="SUBSTITUA_POR_UM_SEGREDO_LONGO_E_ALEATORIO"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Descrição das variáveis:**

| Variável | Finalidade |
|---|---|
| `DATABASE_URL` | Endereço, usuário, senha e nome do banco MySQL |
| `JWT_SECRET` | Segredo utilizado para assinar e validar tokens JWT |
| `PORT` | Porta utilizada pelo backend |
| `FRONTEND_URL` | Origem do frontend autorizada pelo CORS |

O adaptador Prisma utiliza o host definido em `DATABASE_URL`, permitindo configurar outro servidor MySQL sem modificar o código.

Se a senha do banco contiver caracteres especiais, eles precisam ser codificados para uso na URL. Por exemplo, `@` deve ser representado por `%40`.

O arquivo `.env` contém informações sensíveis e não deve ser enviado ao GitHub.

### 5. Gerar o Prisma Client e aplicar as migrações

Ainda na pasta `backend`, execute:

```bash
npx prisma generate
npx prisma migrate deploy
```

O primeiro comando gera o Prisma Client utilizado pela aplicação.

O segundo aplica as migrações versionadas no repositório, criando as tabelas `Usuario`, `Veiculo` e `Locacao` em um banco novo.

### 6. Preparar os dados de demonstração

Execute:

```bash
npm run seed
```

O seed prepara um usuário de demonstração e cinco veículos.

Ele utiliza `upsert`, evitando a duplicação desses registros quando executado novamente. O comando não apaga o histórico de locações.

### 7. Iniciar o backend

Execute:

```bash
node index.js
```

Com a configuração padrão, o backend estará disponível em:

http://localhost:3000

Mantenha esse terminal aberto.

### 8. Instalar e configurar o frontend

Abra outro terminal e, a partir da raiz do projeto, execute:

```bash
cd frontend
npm ci
```

Crie o arquivo de ambiente do frontend:

```bash
cp .env.example .env
```

O conteúdo padrão é:

```env
VITE_API_URL="http://localhost:3000"
```

Essa variável define o endereço utilizado pelo frontend para acessar a API.

Se o backend estiver em outro endereço ou porta, atualize `VITE_API_URL` de acordo com o ambiente. Reinicie o Vite após alterar o arquivo `.env`.

As variáveis `VITE_` ficam disponíveis no código do navegador e não devem conter senhas ou segredos.

### 9. Iniciar o frontend

Execute:

```bash
npm run dev
```

Com a configuração padrão, acesse:

http://localhost:5173

A tela de login será exibida. Utilize as credenciais da seção **Dados de demonstração**.

### 10. Verificar a instalação

Após iniciar o backend e o frontend:

1. Faça login com o usuário de demonstração.
2. Confira se os cinco veículos cadastrados pelo seed aparecem.
3. Registre uma locação para um veículo disponível.
4. Verifique se o veículo passa a ficar indisponível.
5. Finalize a locação e confirme se o veículo volta a ficar disponível.
6. Confira o histórico de locações.

### Problemas comuns

**Erro de conexão com o MySQL**

Verifique se o serviço MySQL está em execução, se o banco foi criado e se as credenciais de `DATABASE_URL` estão corretas.

**Erro ao executar o Prisma**

Execute `npx prisma generate` e confirme se as migrações foram aplicadas com `npx prisma migrate deploy`.

**Erro de CORS**

Confira se `FRONTEND_URL` no backend corresponde exatamente à origem exibida pelo Vite, incluindo a porta.

**Frontend não consegue acessar a API**

Verifique se o backend está em execução e se `VITE_API_URL` aponta para o endereço correto.

**Erro de autenticação**

Confira as credenciais digitadas. A senha diferencia letras maiúsculas de minúsculas.

## Dados de demonstração

Após executar `npm run seed`, utilize as seguintes credenciais:

| Campo | Valor |
|---|---|
| Nome | Administrador Demo |
| E-mail | demo@locadora.com |
| Senha | Demo@12345 |

Essas credenciais são destinadas exclusivamente ao ambiente de demonstração e não devem ser utilizadas em produção.

### Veículos cadastrados pelo seed

| Marca | Modelo | Ano | Placa | Diária |
|---|---|---|---|---|
| Toyota | Corolla | 2022 | DEM1A23 | R$ 180,00 |
| Honda | Civic | 2023 | DEM2B34 | R$ 200,00 |
| Chevrolet | Onix | 2024 | DEM3C45 | R$ 120,00 |
| Volkswagen | T-Cross | 2023 | DEM4D56 | R$ 190,00 |
| Hyundai | HB20 | 2024 | DEM5E67 | R$ 130,00 |

A disponibilidade de cada veículo depende das locações registradas no banco.

## Rotas da API

### Usuários e autenticação

| Método | Rota | Descrição | JWT |
|---|---|---|---|
| POST | `/usuarios` | Cadastrar usuário | Não |
| POST | `/auth/login` | Autenticar usuário | Não |

### Veículos

| Método | Rota | Descrição | JWT |
|---|---|---|---|
| GET | `/veiculos` | Listar todos os veículos | Sim |
| GET | `/veiculos/disponiveis` | Listar veículos disponíveis | Sim |
| POST | `/veiculos` | Cadastrar veículo | Sim |

### Locações

| Método | Rota | Descrição | JWT |
|---|---|---|---|
| POST | `/locacoes` | Registrar locação | Sim |
| GET | `/locacoes` | Consultar locações do usuário | Sim |
| PATCH | `/locacoes/:id/finalizar` | Finalizar locação | Sim |

As rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Exemplo de cadastro de veículo

```http
POST /veiculos
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT
```

```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "placa": "ABC1D23",
  "ano": 2022,
  "valorDiaria": 180
}
```

### Exemplo de registro de locação

```http
POST /locacoes
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT
```

```json
{
  "veiculoId": 1,
  "dataInicio": "2026-12-10T10:00:00-03:00",
  "dataPrevistaDevolucao": "2026-12-12T10:00:00-03:00"
}
```

O ID do usuário é obtido pelo token JWT, e o valor total é calculado pelo backend.

## Organização do backend

O backend utiliza uma organização em camadas:

- **Routes:** definem os endpoints e encaminham as requisições.
- **Controllers:** recebem as requisições e devolvem as respostas HTTP.
- **Services:** executam as regras de negócio e acessam o banco pelo Prisma.
- **Middlewares:** verificam a autenticação e autorizam o acesso às rotas protegidas.
- **Prisma:** gerencia os modelos, relacionamentos, consultas e migrações do banco de dados.

## Organização do frontend

O frontend utiliza React, com páginas e componentes separados para facilitar a manutenção.

- **Login:** autenticação do usuário.
- **Cadastro:** criação de novas contas.
- **Dashboard:** interface principal do sistema.
- **Componentes:** formulários, listagens de veículos e histórico de locações.
- **Serviço de API:** centraliza a comunicação HTTP com o backend.

## Segurança

- Senhas armazenadas com hash bcrypt.
- Autenticação por JWT.
- Rotas protegidas por middleware.
- Validação de dados no backend.
- Verificação de propriedade das locações.
- Credenciais de banco configuradas por variáveis de ambiente.
- Arquivo `.env` excluído do versionamento.

## Contexto acadêmico

Projeto desenvolvido para a disciplina **Programação com Frameworks Web**, com o objetivo de aplicar conceitos de desenvolvimento full-stack, APIs REST, autenticação, banco de dados relacional, ORM e gerenciamento de estado no React.

O sistema foi desenvolvido para fins educacionais e de demonstração.
