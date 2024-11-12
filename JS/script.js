const inputQuestion = document.getElementById('inputQuestion');
const result = document.getElementById('result');

inputQuestion.addEventListener('keypress', (event) => {
  if(inputQuestion.value && event.key === 'Enter') {
    sendQuestion();
  }
});

const OPENAI_API_KEY = 'sk-proj-your-api-key-here';  // Substitua pela sua chave real

// Histórico de mensagens, que ajuda a manter o contexto
let chatHistory = [];

function sendQuestion() {
  const sQuestion = inputQuestion.value;

  // Adiciona a pergunta ao histórico da conversa
  chatHistory.push({ role: 'user', content: sQuestion });

  // Exibe que está processando
  result.value = 'Carregando...';
  inputQuestion.disabled = true;

  fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Pode mudar para "gpt-4" se estiver usando o GPT-4
      messages: chatHistory,  // Passa o histórico de mensagens para a API
      max_tokens: 1500,  // Ajuste conforme necessário
      temperature: 0.5,   // Temperatura ajustada para respostas mais coesas
      top_p: 1.0,         // Controle de diversidade das respostas
      frequency_penalty: 0, // Evita repetição excessiva
      presence_penalty: 0  // Controle de repetição de temas
    })
  })
  .then((response) => response.json())
  .then((json) => {
    // Se a resposta for um erro
    if (json.error?.message) {
      result.value = `Error: ${json.error.message}`;
    } else {
      const text = json.choices?.[0]?.message?.content || "Sem resposta";

      // Exibe a resposta do GPT
      result.value = `Chat GPT: ${text}`;

      // Adiciona a resposta ao histórico
      chatHistory.push({ role: 'assistant', content: text });
    }

    // Atualiza a interface do usuário
    inputQuestion.value = '';  // Limpa o campo de input
    inputQuestion.disabled = false;
    inputQuestion.focus();     // Foca no campo de input novamente
    result.scrollTop = result.scrollHeight; // Rola o resultado para o final
  })
  .catch((error) => {
    result.value = `Erro ao se comunicar com a API: ${error.message}`;
    inputQuestion.disabled = false;
  });
}
