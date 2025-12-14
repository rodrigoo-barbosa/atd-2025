
import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseURL } from './helpers/baseURL.js';
import { gerarEmailAleatorio, gerarNomeAleatorio, gerarSenhaAleatoria } from './helpers/fakerHelper.js';
import { login } from './helpers/login.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Stages: define a evolução dos usuários virtuais ao longo do teste
export const options = {
    stages: [
        { duration: '5s', target: 1 },   // Sobe para 1 usuário
        { duration: '10s', target: 1 },  // Mantém 1 usuário
        { duration: '5s', target: 0 },   // Desce para 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // Threshold de duração das requisições
        'tempo_checkout': ['p(95)<2000'],  // Threshold customizado para o checkout
        'checks': ['rate>0.95'],          // Threshold de sucesso dos checks
    },
};

// Trend (É uma métrica customizada para medir o tempo do checkout)
const tempoCheckout = new Trend('tempo_checkout');

// Dados para Data-Driven Testing
const cenariosCheckout = [
    { produtoId: 1, quantidade: 1, metodoPagamento: 'cash' },
    { produtoId: 2, quantidade: 5, metodoPagamento: 'credit_card' }, 
    { produtoId: 3, quantidade: 1, metodoPagamento: 'cash' }, 
];

export default function () {
    // Funçao implementada para resolve o problema de falta de estoque dos produros
    group('Resetar estoque', function () {
        const url = `${getBaseURL()}/products/reset-stock`;
        const resposta = http.post(url, null, { headers: { 'Content-Type': 'application/json' } });
        check(resposta, {
            'Estoque resetado': (r) => r.status === 200 && r.json('success') === true,
        });
    });
    // Helpers/Faker: geração de dados aleatórios
    const email = gerarEmailAleatorio();
    const senha = gerarSenhaAleatoria();
    const nome = gerarNomeAleatorio();
    let token = '';
    let respostaCheckout = null;

    // Group: Cadastro do usuário
    group('Cadastro do Usuário', function () {
        const url = `${getBaseURL()}/auth/register`;
        const payload = JSON.stringify({ email, password: senha, name: nome });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const resposta = http.post(url, payload, params);
        check(resposta, {
            'Cadastro retornou 201': (r) => r.status === 201,
        });
    });

    // Group: Login do usuário
    group('Login do Usuário', function () {
        token = login(email, senha);
        check(token, {
            'Token recebido': (t) => typeof t === 'string' && t.length > 10,
        });
    });

    // Data-Driven Testing - múltiplos cenários de checkout
    cenariosCheckout.forEach((cenario) => {
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
    });

    // Variável de ambiente
    group('Verificando variável de ambiente', function () {
        check(__ENV.BASE_URL, {
            'BASE_URL está definida': (v) => v !== undefined,
        });
    });

    // Reaproveitamento de resposta
    group('Validação da resposta do último checkout', function () {
        check(respostaCheckout, {
            'Checkout tem status 200 ou 201': (r) => r && (r.status === 200 || r.status === 201),
        });
    });

}

// Gera relatório HTML 
export function handleSummary(data) {
    return {
        'reports/checkout.html': htmlReport(data),
    };
}

