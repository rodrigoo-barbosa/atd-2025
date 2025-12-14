function getBaseURL() {
    return __ENV.BASE_URL || 'http://localhost:3000';
}
module.exports = { getBaseURL };
