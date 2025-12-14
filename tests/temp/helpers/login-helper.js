import http from 'k6/http';

export function realizarLogin(userEmail, userPassword, BASE_URL) {
    let payload = {
        email: userEmail,
        password: userPassword,
    };
    let res = http.post(`${BASE_URL}/auth/login`, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
    });
    return res;
}
