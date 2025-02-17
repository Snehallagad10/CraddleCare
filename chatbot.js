let prompt = document.querySelector("#prompt"); 
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA5eLFusTjS41T5lxD4RieftMuF91QoHoU"; // Replace with actual API key

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null
  }
};

// Function to process Markdown formatting (Bold, Lists, Code Blocks)
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
    .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline Code
    .replace(/- (.+)/g, "<li>$1</li>") // Bullet Points
    .replace(/\n/g, "<br>"); // New Lines
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": user.message }
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, requestOptions);
        let data = await response.json();

        console.log("API Response:", data);  // 🔍 Log the full API response

        if (!data || !data.candidates || !data.candidates.length || !data.candidates[0].content.parts.length) {
            throw new Error("Invalid API response");
        }

        let apiResponse = data.candidates[0].content.parts[0].text.trim();
        text.innerHTML = formatMarkdown(apiResponse);
    } catch (error) {
        console.error("API Error:", error);
        text.innerHTML = "<b style='color: red;'>⚠️ Error: Unable to get a response. Try again!</b>";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
}

 

// Function to Create Chat Box
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to Handle Chat Input

function handlechatResponse(userMessage) {
  if (!userMessage.trim()) return;

  user.message = userMessage;

  let userHtml = `
      <div class="user-chat-area">
          ${user.message}
      </div>`;

  prompt.value = "";

  let userChatBox = createChatBox(userHtml, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  // AI Response
  setTimeout(() => {
      let aiHtml = `
          <div class="ai-chat-area">
              <img src="loading.webp" alt="Loading" class="load" width="50px">
          </div>`;
      let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
      chatContainer.appendChild(aiChatBox);
      generateResponse(aiChatBox);
  }, 500);
}


// Event Listeners
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlechatResponse(prompt.value);
  }
});

submitbtn.addEventListener("click", () => {
  handlechatResponse(prompt.value);
});
