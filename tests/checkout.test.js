import http from 'k6/http';
import { check, group } from 'k6';
import { getBaseURL } from './temp/helpers/baseURL.js';
import { login } from './temp/helpers/login.js';
import {Trend} from 'k6/metrics';

const postCheckoutTrend = new Trend('post_checkout_duration');

export const options = {
    vus: 10,
    //duration: '15s',
    iterations:10,
    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};

function randomEmail() {
    return `user_${Math.random().toString(36).substring(2, 10)}@example.com`;
}

function randomName() {
    return `User_${Math.random().toString(36).substring(2, 8)}`;
}

export default function () {
    const BASE_URL = getBaseURL();
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
        const loginRes = login(email, password, BASE_URL);
        check(loginRes, {
            'login status is 200': (r) => r.status === 200,
            'login success': (r) => r.json('success') === true,
            'login token exists': (r) => !!r.json('data.token'),
        });
        token = loginRes.json('data.token');
    });

    group('Checkout', () => {
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
        postCheckoutTrend.add(checkoutRes.timings.duration);
        check(checkoutRes, {
            'checkout status is 200': (r) => r.status === 200,
            'checkout success': (r) => r.json('success') === true,
        });
    });
}
