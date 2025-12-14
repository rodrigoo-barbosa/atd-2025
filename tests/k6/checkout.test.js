const http = require('k6/http');
const { check, group } = require('k6');
const { Trend } = require('k6/metrics');
const { getBaseURL } = require('./helpers/baseURL.js');
const { generateRandomEmail, generateRandomName, generateRandomPassword } = require('./helpers/randomData.js');
const { login } = require('./helpers/login.js');

module.exports.options = {
    vus: 10,
    duration: '15s',
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        'checkout_duration': ['p(95)<2000'],
    },
};

const checkoutTrend = new Trend('checkout_duration');

module.exports.default = function () {
    let email, password, name, token;

    group('Register User', function () {
        email = generateRandomEmail();
        password = generateRandomPassword();
        name = generateRandomName();
        const url = `${getBaseURL()}/auth/register`;
        const payload = JSON.stringify({ email, password, name });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const res = http.post(url, payload, params);
        check(res, {
            'register status is 201': (r) => r.status === 201,
        });
    });

    group('Login User', function () {
        token = login(email, password);
    });

    group('Checkout', function () {
        const url = `${getBaseURL()}/checkout`;
        const payload = JSON.stringify({ productId: 1, quantity: 3, paymentMethod: 'cash' });
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        const res = http.post(url, payload, params);
        if (res && res.timings && typeof res.timings.duration === 'number') {
            checkoutTrend.add(res.timings.duration);
        }
        check(res, {
            'checkout status is 201': (r) => r.status === 201,
        });
    });
}
