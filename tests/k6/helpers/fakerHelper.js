const { faker } = require('@faker-js/faker');

function gerarEmailAleatorio() {
    return faker.internet.email();
}

function gerarNomeAleatorio() {
    return faker.person.fullName();
}

function gerarSenhaAleatoria() {
    return faker.internet.password(12);
}

module.exports = {
    gerarEmailAleatorio,
    gerarNomeAleatorio,
    gerarSenhaAleatoria
};
