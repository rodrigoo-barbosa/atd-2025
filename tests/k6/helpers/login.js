const http = require('k6/http');
const { check } = require('k6');
const { getBaseURL } = require('./baseURL.js');

function login(email, password) {
    const url = `${getBaseURL()}/auth/login`;
    const payload = JSON.stringify({ email, password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    check(res, {
        'login status is 200': (r) => r.status === 200,
        'login returns token': (r) => r.json('data.token') !== undefined,
    });
    return res.json('data.token');
}

module.exports = { login };
