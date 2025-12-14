import http from 'k6/http';
import { check, group } from 'k6';
import{ randomEmail, randomName } from './temp/helpers/randomData.js';
import { realizarLogin } from './temp/helpers/login-helper.js';
import { BASE_URL } from './temp/helpers/baseURL.js';

export const options = {
    vus: 10,
    duration: '15s',
    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};


export default function () {
    const email = randomEmail();
    const password = 'password123';
    const name = randomName();

    let token = '';

    group('Register and Login', () => {
        // Register
        const registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
            email,
            password,
            name,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
        check(registerRes, {
            'register status is 201': (r) => r.status === 201,
            'register success': (r) => r.json('success') === true,
        });

        // Login
        const loginRes = realizarLogin(email, password, BASE_URL);
        check(loginRes, {
            'login status is 200': (r) => r.status === 200,
            'login success': (r) => r.json('success') === true,
            'login token exists': (r) => !!r.json('data.token'),
        });
        token = loginRes.json('data.token');
    });

    group('Checkout', () => {
        // Compra do produto 3 (Headphones), quantidade 1, pagamento em dinheiro
        const checkoutRes = http.post(`${BASE_URL}/checkout`, JSON.stringify({
            items: [
                { productId: 3, quantity: 1 },
            ],
            paymentMethod: 'cash',
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        check(checkoutRes, {
            'checkout status is 200': (r) => r.status === 200,
            'checkout success': (r) => r.json('success') === true,
        });
    });
}
