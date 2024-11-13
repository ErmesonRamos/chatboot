import { ChatGPTAPI } from 'chatgpt';
import dotenv from 'dotenv';

dotenv.config();

// Função com retry para tentar novamente em caso de erro 429 (cota excedida)
async function sendMessageWithRetry(api, message, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const result = await api.sendMessage(message);
            return result;
        } catch (error) {
            if (error.statusCode === 429) {
                console.log("Cota excedida. Tentando novamente...");
                await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes de tentar novamente
                attempt++;
            } else {
                throw error; // Se for um erro diferente, lança o erro
            }
        }
    }
    throw new Error("Número máximo de tentativas atingido.");
}

// Instanciação da API com a chave
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
});

try {
    // Usando a função com retry
    const result = await sendMessageWithRetry(api, 'Hello world');
    console.log(result.text); // Exibe a resposta da API
} catch (error) {
    console.error('Erro ao enviar mensagem:', error.message);
}
