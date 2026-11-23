
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

Para executar o projeto localmente, é necessário ter instalado:

- Node.js e npm.
- MySQL Server.
- Git.

Também é necessário configurar um banco de dados MySQL e um usuário com permissões adequadas para executar as migrações.

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/EmersonGualberto/sistema-locacao-veiculos.git
cd sistema-locacao-veiculos
```

### 2. Preparar o banco de dados

Acesse o MySQL com uma conta administrativa:

```bash
sudo mysql
```

Crie o banco de dados:

```sql
CREATE DATABASE IF NOT EXISTS locacao_veiculos;
```

Crie um usuário específico para a aplicação, substituindo a senha de exemplo por uma senha própria:

```sql
CREATE USER IF NOT EXISTS 'locacao_app'@'localhost'
IDENTIFIED BY 'SENHA_FORTE_AQUI';

GRANT ALL PRIVILEGES ON locacao_veiculos.*
TO 'locacao_app'@'localhost';

FLUSH PRIVILEGES;
```

Saia do MySQL:

```sql
EXIT;
```

O usuário utilizado nas migrações precisa ter permissões suficientes para o Prisma criar e modificar as tabelas. O comando `prisma migrate dev` também utiliza um banco temporário (shadow database), podendo exigir permissões adicionais de criação e exclusão de bancos no ambiente de desenvolvimento.

### 3. Configurar o backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm ci
```

Crie o arquivo de configuração a partir do exemplo:

```bash
cp .env.example .env
```

Configure o arquivo `.env`:

```env
DATABASE_URL="mysql://locacao_app:SENHA_FORTE_AQUI@localhost:3306/locacao_veiculos"
JWT_SECRET="SUBSTITUA_POR_UM_SEGREDO_LONGO_E_ALEATORIO"
```

Substitua os valores de exemplo pelas credenciais configuradas no MySQL e por um segredo JWT próprio.

Se a senha do banco contiver caracteres especiais, eles devem ser codificados adequadamente na URL de conexão.

O arquivo `.env` contém informações sensíveis e não deve ser enviado ao GitHub.

### 4. Preparar o Prisma

Gere o Prisma Client:

```bash
npx prisma generate
```

Aplique as migrações existentes:

```bash
npx prisma migrate deploy
```

As migrações criam as tabelas e relacionamentos definidos no arquivo `prisma/schema.prisma`.

### 5. Preparar os dados de demonstração

Execute:

```bash
npm run seed
```

Esse comando cadastra um usuário de demonstração e cinco veículos.

O seed utiliza `upsert`, permitindo executar novamente a preparação sem duplicar os registros identificados pelo e-mail ou pela placa.

### 6. Iniciar o backend

Na pasta `backend`, execute:

```bash
node index.js
```

A API será iniciada em:

```text
http://localhost:3000
```

Mantenha esse terminal aberto.

### 7. Configurar e iniciar o frontend

Abra outro terminal e, a partir da raiz do projeto, execute:

```bash
cd frontend
npm ci
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

O frontend se comunica com a API executada em `http://localhost:3000`.

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
