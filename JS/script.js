const inputQuestion = document.getElementById('inputQuestion');
const result = document.getElementById('result');

inputQuestion.addEventListener('keypress', (event) => {
  if(inputQuestion.value && event.key === 'Enter') {
    sendQuestion();
  }
});

const OPENAI_API_KEY = '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';

function sendQuestion() {
  var sQuestion = inputQuestion.value;

  fetch("https://api.openai.com/v1/completions", {
    method: 'POST',
    headers: {
      Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", 
      prompt: sQuestion,
      max_tokens: 2048,
      temperature: 0.5,
    })
  })
    .then((response) => response.json())
    .then((json) => {
      if (result.value) result.value += "\n";

      if (json.error?.message) {
        result.value += `Error: ${json.error.message}`;
      } else if (json.choices?.[0].text) {
        var text = json.choices[0].text || "Sem resposta";

        result.value += "Chat GPT: " + text;
      }
    }) 
  if(result.value) result.value += "\n\n\n";

  result.value += `Eu ${sQuestion}`;
  inputQuestion.value = 'Carregando...';
  inputQuestion.disabled = true;

  result.scrollTop = result.scrollHeight;
}