let conversationHistory = []; // track full chat for multi-turn memory
let isLoading = false;        // prevent double sends

function scrollToBottom() {
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
}

function dismissKeyboard() {
  document.activeElement.blur(); // closes iOS keyboard after send
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `
    <div class="ai-message" id="typing-indicator">
      Thinking...
    </div>
  `;
  scrollToBottom();
}

function removeTyping() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

async function sendMessage() {
  if (isLoading) return; // block while waiting for reply

  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  isLoading = true;
  input.value = "";
  dismissKeyboard(); // close keyboard on mobile after send

  // Sanitize to prevent XSS (never inject raw user text into innerHTML)
  const safe = d
