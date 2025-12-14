
// Funções puras para geração de dados aleatórios compatíveis com K6
function gerarEmailAleatorio() {
    const random = Math.floor(Math.random() * 1000000);
    return `usuario${Date.now()}_${random}@exemplo.com`;
}

function gerarNomeAleatorio() {
    const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena'];
    const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Pereira', 'Lima', 'Costa', 'Gomes', 'Ribeiro'];
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    return `${nome} ${sobrenome}`;
}

function gerarSenhaAleatoria() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let senha = '';
    for (let i = 0; i < 12; i++) {
        senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return senha;
}

module.exports = {
    gerarEmailAleatorio,
    gerarNomeAleatorio,
    gerarSenhaAleatoria
};

module.exports = {
    gerarEmailAleatorio,
    gerarNomeAleatorio,
    gerarSenhaAleatoria
};
