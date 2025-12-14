import http from 'k6/http';

export function login(email, password, baseURL) {
    return http.post(`${baseURL}/auth/login`, JSON.stringify({
        email,
        password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
