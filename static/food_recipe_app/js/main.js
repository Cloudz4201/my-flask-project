function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;

    // Clear input
    userInput.value = '';

    // Add user message to chat
    addMessageToChat('You: ' + message);

    // Send to backend
    fetch('/generate_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            addMessageToChat('Error: ' + data.error);
        } else {
            // Display recipe in the recipe container
            document.getElementById('recipe-display').innerHTML = formatRecipe(data.recipe);
            addMessageToChat('Recipe generated!');
        }
    })
    .catch(error => {
        addMessageToChat('Error: ' + error.message);
    });
}

function addMessageToChat(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatRecipe(recipeText) {
    // Convert the recipe text to HTML with proper formatting
    return recipeText.replace(/\n/g, '<br>');
}

// Allow Enter key to send message
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});