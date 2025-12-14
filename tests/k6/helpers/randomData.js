function randomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

function generateRandomName() {
    return 'User' + randomString(6);
}

function generateRandomPassword() {
    return randomString(12);
}

module.exports = {
    generateRandomEmail,
    generateRandomName,
    generateRandomPassword
};
