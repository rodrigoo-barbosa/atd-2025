
import http from 'k6/http';
import { check } from 'k6';
import { getBaseURL } from './baseURL.js';

export function login(email, password) {
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
