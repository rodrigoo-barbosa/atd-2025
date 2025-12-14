# E-commerce REST API

A simple e-commerce REST API built with JavaScript and Express.js that allows users to register, login with JWT authentication, and perform checkouts with cash or credit card payments.

## Description

This API provides a complete e-commerce backend solution with the following features:
- User registration and authentication using JWT tokens
- Secure checkout process with payment method validation
- Cash payments with 10% discount
- Credit card payments with no discount
- Health check endpoint for monitoring
- Complete API documentation with Swagger UI

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atd-2025
```

2. Install dependencies:
```bash
npm install
```

## How to Run

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Rules

### Checkout Rules
- **Payment Methods**: Only cash and credit card are accepted
- **Cash Discount**: Cash payments receive a 10% discount
- **Authentication**: Only authenticated users can perform checkout
- **Product Validation**: Products must exist and have sufficient stock

### API Rules
- **Endpoints**: Only 4 endpoints are available (login, register, checkout, healthcheck)
- **Data Storage**: Everything runs in memory (no database)
- **JWT Authentication**: Required for checkout endpoint
- **Input Validation**: All inputs are validated for security

## Data Already Existent

### Users (3 default users)
| ID | Email | Password | Name |
|----|-------|----------|------|
| 1 | john@example.com | password123 | John Doe |
| 2 | jane@example.com | password456 | Jane Smith |
| 3 | bob@example.com | password789 | Bob Johnson |

### Products (3 default products)
| ID | Name | Description | Price | Stock |
|----|------|-------------|-------|-------|
| 1 | Laptop | High-performance laptop for work and gaming | $999.99 | 50 |
| 2 | Smartphone | Latest model smartphone with advanced features | $699.99 | 30 |
| 3 | Headphones | Wireless noise-canceling headphones | $199.99 | 100 |

## How to Use the REST API

### Base URL
```
http://localhost:3000
```

### API Documentation
Visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

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

#### 3. Checkout
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

#### 4. Health Check
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

#### 5. Get All Products
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

#### 6. Create Product
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

### Example Usage with cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Checkout (replace TOKEN with actual JWT token):
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

#### Health check:
```bash
curl -X GET http://localhost:3000/health
```

#### Get all products (replace TOKEN with actual JWT token):
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer TOKEN"
```

#### Create a new product (replace TOKEN with actual JWT token):
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

### Error Responses

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

## Project Structure

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

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Swagger UI** - API documentation
- **CORS** - Cross-origin resource sharing
- **YAML** - Swagger specification

## License

ISC License

## Teste de Performance com K6: Explicação dos Conceitos


## Teste de Performance com K6: Conceitos Explicados de Forma Lúdica

Se você está começando com testes de performance usando K6, aqui vai uma explicação lúdica e didática de cada conceito aplicado no teste checkout.test.js:

---

### 1. Thresholds (Limiares)
Imagine que você está em uma corrida e quer garantir que 95% dos corredores terminem em menos de 2 minutos. No teste, thresholds são essas “metas de tempo” para as requisições. No código, definimos que 95% das respostas devem ser rápidas (menos de 2 segundos), e que pelo menos 95% dos testes devem passar.

```js
thresholds: {
  http_req_duration: ['p(95)<2000'],
  'tempo_checkout': ['p(95)<2000'],
  'checks': ['rate>0.95'],
}
```

---

### 2. Checks (Verificações)
Checks são como fiscais que conferem se tudo está certo após cada etapa. Eles verificam, por exemplo, se o cadastro retornou sucesso, se o login trouxe um token e se o checkout foi realizado corretamente.

```js
check(resposta, { 'Cadastro retornou 201': (r) => r.status === 201 });
check(token, { 'Token recebido': (t) => typeof t === 'string' && t.length > 10 });
check(resposta, { 'Checkout retornou 200 ou 201': (r) => r.status === 200 || r.status === 201 });
```

---

### 3. Helpers (Ajudantes)
Helpers são como pequenos robôs que fazem tarefas repetitivas para você: gerar dados aleatórios, montar a URL base, fazer login, etc. Eles deixam o código mais limpo e fácil de entender.

```js
import { getBaseURL } from './helpers/baseURL.js';
import { gerarEmailAleatorio, gerarNomeAleatorio, gerarSenhaAleatoria } from './helpers/fakerHelper.js';
import { login } from './helpers/login.js';
```

---

### 4. Trends (Tendências)
Trends são como um diário que anota quanto tempo cada checkout levou. Assim, depois do teste, você pode ver se o sistema ficou mais rápido ou mais lento.

```js
const tempoCheckout = new Trend('tempo_checkout');
tempoCheckout.add(resposta.timings.duration);
```

---

### 5. Faker (Geração de Dados Aleatórios)
Faker é o mágico que cria nomes, e-mails e senhas diferentes a cada teste, simulando usuários reais. Isso evita que os testes fiquem repetitivos e ajuda a encontrar problemas.

```js
const email = gerarEmailAleatorio();
const senha = gerarSenhaAleatoria();
const nome = gerarNomeAleatorio();
```

---

### 6. Variável de Ambiente
É como um post-it na sua mesa dizendo “hoje teste no servidor X”. Usamos variáveis de ambiente para mudar a URL da API sem mexer no código.

```js
getBaseURL() // Usa __ENV.BASE_URL se definido
check(__ENV.BASE_URL, { 'BASE_URL está definida': (v) => v !== undefined });
```

---

### 7. Stages (Estágios)
Stages são o roteiro do teste: “comece devagar, aumente a quantidade de usuários, depois diminua”. Assim, você simula o movimento de pessoas entrando e saindo da loja.

```js
stages: [
  { duration: '5s', target: 1 },
  { duration: '10s', target: 1 },
  { duration: '5s', target: 0 },
]
```

---

### 8. Reaproveitamento de Resposta
É como guardar o recibo da última compra para conferir depois. O teste salva a resposta do checkout e faz verificações extras nela no final.

```js
respostaCheckout = resposta; // Salva última resposta
check(respostaCheckout, { 'Checkout tem status 200 ou 201': ... });
```

---

### 9. Uso de Token de Autenticação
O token é a “chave” que permite acessar áreas protegidas. O teste faz login, pega o token e usa ele para fazer o checkout, simulando um usuário real.

```js
'Authorization': `Bearer ${token}`
```

---

### 10. Data-Driven Testing (Teste Orientado a Dados)
É como testar várias receitas diferentes: o teste faz checkouts com diferentes produtos, quantidades e métodos de pagamento, tudo em um só teste.

```js
cenariosCheckout.forEach((cenario) => { ... })
```

---

### 11. Groups (Agrupamentos)
Groups são como capítulos de um livro: cada parte do teste (cadastro, login, checkout) fica organizada, facilitando a leitura dos resultados.

```js
group('Cadastro do Usuário', ...)
group('Login do Usuário', ...)
group('Checkout Produto ...', ...)
```

---

Esses conceitos juntos tornam o teste robusto, realista e fácil de entender, mesmo para quem está começando!

## Como rodar o teste de performance com K6

Execute o comando abaixo para rodar o teste principal:
```bash
k6 run --env BASE_URL=http://localhost:3000 tests/k6/checkout.test.js
```

Você pode alterar o valor de BASE_URL conforme o ambiente desejado.

Consulte os comentários no arquivo `tests/k6/checkout.test.js` para entender cada etapa do fluxo!
Se tiver dúvidas, consulte os comentários no próprio arquivo do teste para entender cada etapa!
