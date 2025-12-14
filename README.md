## Trabalho de Conclusão da Disciplina: Automação de Testes de Performance

Este projeto foi desenvolvido como parte integral da avaliação final da disciplina de Automação de Testes de Performance, pertencente à pós-graduação em Automação de Testes de Software — Turma 2025.

Abaixo seguem alguns conceitos empregados nos testes, adquiridos ao longo da disciplina.

As informações sobre a API seguem logo abaixo da explicação destes conceitos.


### 1. Thresholds (Limiares)
Realizando uma comparação com uma corrida, onde queremos garantir que os corredores alcancem uma meta de tempo, na qual 95% deles devem terminar a corrida em menos de 2 minutos. No teste, thresholds são essas “metas de tempo” para as requisições. No código, definimos que 95% das respostas devem ser rápidas (menos de 2 segundos), e que pelo menos 95% dos testes devem passar.

Aplicação no código de teste:
```js
thresholds: {
  http_req_duration: ['p(95)<2000'],
  'tempo_checkout': ['p(95)<2000'],
  'checks': ['rate>0.95'],
}
```
---
### 2. Checks (Verificações)
No teste, os "checks" estão sendo usados para validar automaticamente se cada etapa importante do fluxo foi bem-sucedida e estão estruturados da seguinte forma:

**Cadastro do Usuário:**
Verifica se o cadastro retornou status 201 (criado com sucesso).
```js
check(resposta, {
  'Cadastro retornou 201': (r) => r.status === 201,
});
```

**Login do Usuário:**
Confere se o token de autenticação foi recebido e tem tamanho adequado.
```js
check(token, {
  'Token recebido': (t) => typeof t === 'string' && t.length > 10,
});
```

**Checkout (para cada cenário):**
Valida se o checkout retornou status 200 ou 201 e se a resposta contém um ID.
```js
check(resposta, {
  'Checkout retornou 200 ou 201': (r) => r.status === 200 || r.status === 201,
  'Resposta contém ID': (r) => r.json('data.id') !== undefined,
});
```

---
### 3. Helpers
Helpers são arquivos auxiliares que deixam o código mais limpo e fácil de entender. Neste projeto, modularizamos funções como `login`, `fakerHelper` (dados aleatórios) e `baseURL` com o objetivo de reaproveitar código.
No teste, os helpers são importados e utilizados diretamente, evitando repetição.

Exemplo de importação dos arquivos helpers no código de teste:
```js
import { getBaseURL } from './helpers/baseURL.js';
import { gerarEmailAleatorio, gerarNomeAleatorio, gerarSenhaAleatoria } from './helpers/fakerHelper.js';
import { login } from './helpers/login.js';
```

---
### 4. Trends (Tendências)
Trends são como um backlog de métricas customizadas, que anotam quanto tempo cada checkout levou. Assim, depois do teste, é possível analisar se o sistema ficou mais rápido ou mais lento.

Aqui foi declarada a Trend:
```js
const tempoCheckout = new Trend('tempo_checkout');
```

E aqui a Trend é incrementada com a duração do checkout, permitindo análise de desempenho:
```js
tempoCheckout.add(resposta.timings.duration);
```

---
### 5. Faker (Geração de Dados Aleatórios)

Geração de dados aleatórios (nome, e-mail, senha) para simular usuários reais. Isso evita repetição e ajuda a encontrar problemas.

Foi enfrentado um problema onde o K6 não suporta a biblioteca Faker.js original porque ela depende de recursos do Node.js que não estão disponíveis no ambiente do K6.
Para contornar isso, foi utilizado funções helpers próprias, para gerar dados aleatórios como nomes, e-mails e senhas dentro do teste, sem depender do Faker.js original.

Para isso foram criadas funções helpers e importadas no arquivo de teste, recebendo os parâmetros correspondentes.

Aplicação no código de teste:
```js
const email = gerarEmailAleatorio();
const senha = gerarSenhaAleatoria();
const nome = gerarNomeAleatorio();
```

---
### 6. Variável de Ambiente

Utilziar variável de ambiente torna o teste mais flexível e reutilizável, pois você pode mudar configurações (por exemplo, rodar em diferentes ambientes) sem alterar o código, apenas informando a variável ao executar o teste.

Foi criado um helper `baseURL.js`, importado no teste e utilizado quando necessário.

Aplicação no código de teste:
```js
getBaseURL(); // Usa __ENV.BASE_URL se definido
check(__ENV.BASE_URL, { 'BASE_URL está definida': (v) => v !== undefined });
```

---
### 7. Stages

Este conceito simula o fluxo de acesso flutuante do usuários, por exemplo começando devagar, aumentando a quantidade de usuários, depois diminuindo, desta forma é possível simular o movimento de pessoas entrando e saindo da loja.

Aplicação no código de teste:
```js
stages: [
  { duration: '5s', target: 1 },
  { duration: '10s', target: 1 },
  { duration: '5s', target: 0 },
]
```

---
### 8. Reaproveitamento de Resposta
Neste conceito, o teste salva a resposta do checkout e faz verificações extras nela no final.

Na implementação, o `check` valida a resposta da última requisição de checkout. Verifica se `respostaCheckout` existe e se o status é 200 ou 201, indicando sucesso.

Aplicação no código de teste:
```js
 group('Validação da resposta do último checkout', function () {
        check(respostaCheckout, {
            'Checkout tem status 200 ou 201': (r) => r && (r.status === 200 || r.status === 201),
        });
    });
```
---
### 9. Uso de Token de Autenticação
O token é a “chave” que permite acessar áreas protegidas. O teste faz login, pega o token e usa ele para fazer o checkout, simulando um usuário real.

Aplicação no código de teste:
```js
'Authorization': `Bearer ${token}`
```
---
### 10. Data-Driven Testing (Teste Orientado a Dados)

Neste projeto de teste, o conceito de Data-Driven Testing está sendo aplicado ao separar os dados do fluxo e iterar sobre eles para executar o mesmo teste com variações controladas.

O fluxo do teste basicamente:

Aplicação no código de teste:
```js
cenariosCheckout.forEach((cenario) => {
  group(`Checkout Produto ${cenario.produtoId} (${cenario.metodoPagamento})`, function () {
    const payload = JSON.stringify({
      items: [{ productId: cenario.produtoId, quantity: cenario.quantidade }],
      paymentMethod: cenario.metodoPagamento
    });
    const resposta = http.post(`${getBaseURL()}/checkout`, payload, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    tempoCheckout.add(resposta.timings.duration);
    check(resposta, {
      'Checkout retornou 200 ou 201': (r) => r.status === 200 || r.status === 201,
      'Resposta contém ID': (r) => r.json('data.id') !== undefined,
    });
  });
});
```
### 11. Groups (Agrupamentos)
Groups são como capítulos de um livro: cada parte do teste (cadastro, login, checkout) fica organizada, facilitando a leitura dos resultados.

Neste projeto de teste, foram criadas seções nomeadas no relatório, separando cada etapa do restante do teste.
Dentro delas, os `checks` validam as respostas e deixam claro, por grupo, o sucesso de cada fase.

Aplicação no código de teste:
```js
  group('Cadastro do Usuário', function () {
        const url = `${getBaseURL()}/auth/register`;
        const payload = JSON.stringify({ email, password: senha, name: nome });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const resposta = http.post(url, payload, params);
        check(resposta, {
            'Cadastro retornou 201': (r) => r.status === 201,
        });
    });

...

 group('Login do Usuário', function () {
        token = login(email, senha);
        check(token, {
            'Token recebido': (t) => typeof t === 'string' && t.length > 10,
        });
    });

...

group(`Checkout Produto ${cenario.produtoId} (${cenario.metodoPagamento})`, function () {
            const url = `${getBaseURL()}/checkout`;
            const payload = JSON.stringify({
                items: [{ productId: cenario.produtoId, quantity: cenario.quantidade }],
                paymentMethod: cenario.metodoPagamento
            });
            const params = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const resposta = http.post(url, payload, params);
            respostaCheckout = resposta; // Reaproveitamento de resposta
            tempoCheckout.add(resposta.timings.duration); // Trend
            check(resposta, {
                'Checkout retornou 200 ou 201': (r) => r.status === 200 || r.status === 201,
                'Resposta contém ID': (r) => r.json('data.id') !== undefined,
     });
  });   
```
---
### Comando para executar o teste de performance com base URL customizada
```bash
k6 run --env BASE_URL=http://localhost:3000 tests/k6/checkout.test.js
```
---
### Relatório HTML do k6

Abre o relatório direto no navegador
```bash
npm run k6:report
```

Rodar o teste e abrir o relatório logo depois:
```bash
k6 run --env BASE_URL=http://localhost:3000 tests/k6/checkout.test.js
start "" reports\checkout.html
```

Aplicação no código de teste:
```js
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'reports/checkout.html': htmlReport(data),
  };
}
```

Como executar e visualizar:
```bash
k6 run --env BASE_URL=http://localhost:3000 tests/k6/checkout.test.js
```

- Abra o arquivo gerado: reports/checkout.html

         
----

# Informaçoes sobre a API Utilizada

## E-commerce REST API

A simple e-commerce REST API built with JavaScript and Express.js that allows users to register, login with JWT authentication, and perform checkouts with cash or credit card payments.

#### Description

This API provides a complete e-commerce backend solution with the following features:
- User registration and authentication using JWT tokens
- Secure checkout process with payment method validation
- Cash payments with 10% discount
- Credit card payments with no discount
- Health check endpoint for monitoring
- Complete API documentation with Swagger UI

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atd-2025
```

2. Install dependencies:
```bash
npm install
```

### How to Run

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

### Rules

#### Checkout Rules
- **Payment Methods**: Only cash and credit card are accepted
- **Cash Discount**: Cash payments receive a 10% discount
- **Authentication**: Only authenticated users can perform checkout
- **Product Validation**: Products must exist and have sufficient stock

#### API Rules
- **Endpoints**: Only 4 endpoints are available (login, register, checkout, healthcheck)
- **Data Storage**: Everything runs in memory (no database)
- **JWT Authentication**: Required for checkout endpoint
- **Input Validation**: All inputs are validated for security

### Data Already Existent

#### Users (3 default users)
| ID | Email | Password | Name |
|----|-------|----------|------|
| 1 | john@example.com | password123 | John Doe |
| 2 | jane@example.com | password456 | Jane Smith |
| 3 | bob@example.com | password789 | Bob Johnson |

#### Products (3 default products)
| ID | Name | Description | Price | Stock |
|----|------|-------------|-------|-------|
| 1 | Laptop | High-performance laptop for work and gaming | $999.99 | 50 |
| 2 | Smartphone | Latest model smartphone with advanced features | $699.99 | 30 |
| 3 | Headphones | Wireless noise-canceling headphones | $199.99 | 100 |

### How to Use the REST API

#### Base URL
```
http://localhost:3000
```

#### API Documentation
Visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

#### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Endpoints

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 4,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

##### 3. Checkout
**POST** `/checkout`

Process a checkout with items and payment method. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout completed successfully",
  "data": {
    "id": 1640995200000,
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "productName": "Laptop",
        "quantity": 2,
        "unitPrice": 999.99,
        "total": 1999.98
      },
      {
        "productId": 3,
        "productName": "Headphones",
        "quantity": 1,
        "unitPrice": 199.99,
        "total": 199.99
      }
    ],
    "paymentMethod": "cash",
    "subtotal": 2199.97,
    "discount": 219.997,
    "total": 1979.973,
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

##### 4. Health Check
**GET** `/health`

Check the health status of the API.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "memory": {
      "rss": 12345678,
      "heapTotal": 12345678,
      "heapUsed": 12345678,
      "external": 12345678
    },
    "environment": "development",
    "data": {
      "totalUsers": 3,
      "totalProducts": 3
    }
  }
}
```

##### 5. Get All Products
**GET** `/products`

Returns a list of all products. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for work and gaming",
      "price": 999.99,
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Smartphone",
      "description": "Latest model smartphone with advanced features",
      "price": 699.99,
      "stock": 30,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Headphones",
      "description": "Wireless noise-canceling headphones",
      "price": 199.99,
      "stock": 100,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

##### 6. Create Product
**POST** `/products`

Creates a new product. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "Tablet",
  "description": "Portable tablet device",
  "price": 299.99,
  "stock": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Tablet",
    "description": "Portable tablet device",
    "price": 299.99,
    "stock": 20,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Example Usage with cURL

##### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

##### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

##### Checkout (replace TOKEN with actual JWT token):
```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1
      }
    ],
    "paymentMethod": "cash"
  }'
```

##### Health check:
```bash
curl -X GET http://localhost:3000/health
```

##### Get all products (replace TOKEN with actual JWT token):
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer TOKEN"
```

##### Create a new product (replace TOKEN with actual JWT token):
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Tablet",
    "description": "Portable tablet device",
    "price": 299.99,
    "stock": 20
  }'
```

#### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (invalid token)
- `404` - Not Found (endpoint not found)
- `500` - Internal Server Error

### Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── AuthController.js
│   ├── CheckoutController.js
│   └── HealthController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Data models
│   ├── User.js
│   └── Product.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── checkout.js
│   ├── health.js
│   └── index.js
├── services/            # Business logic
│   ├── UserService.js
│   └── CheckoutService.js
└── app.js              # Main application file
```

### Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Swagger UI** - API documentation
- **CORS** - Cross-origin resource sharing
- **YAML** - Swagger specification

### License
ISC License
