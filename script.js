async function sendMessage() {

  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Show user message

  chatBox.innerHTML += `
    <div class="user-message">
      ${userMessage}
    </div>
  `;

  input.value = "";

  // Auto scroll

  chatBox.scrollTop = chatBox.scrollHeight;

  try {

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    console.log(data);

    // Handle API errors

    if (data.error) {

      chatBox.innerHTML += `
        <div class="ai-message">
          Error: ${data.error.message}
        </div>
      `;

      return;
    }

    // Extract AI reply safely

    const aiReply =
      data.choices?.[0]?.message?.content;

    if (!aiReply) {

      chatBox.innerHTML += `
        <div class="ai-message">
          No response received.
        </div>
      `;

      return;
    }

    // Show AI message

    chatBox.innerHTML += `
      <div class="ai-message">
        ${aiReply}
      </div>
    `;

    // Auto scroll

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {

    console.error(error);

    chatBox.innerHTML += `
      <div class="ai-message">
        Error: ${error.message}
      </div>
    `;
  }
}

/* Enter key support */

document
  .getElementById("user-input")
  .addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
      sendMessage();
    }

});