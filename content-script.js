const key = "YOUR_API_KEY_HERE";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clip-rule="evenodd" /></svg>`;

const inputElementSelector = `input[type=text], input[type=search], textarea, [contenteditable=true]`;

function doTheThing(inputFields) {
    // Loop through each input field
    inputFields.forEach(inputField => {
      // Create a floating button and append it to the page
      const button = document.createElement("button");
      button.classList.add("floating-button");
      button.innerHTML = iconSvg;
      document.body.appendChild(button);
  
      // Position the button near the input field
      function syncButtonPosition() {
        const inputFieldBoundingClientRect = inputField.getBoundingClientRect();
        button.style.top = `${inputFieldBoundingClientRect.y - 38}px`;
        button.style.left = `${inputFieldBoundingClientRect.x + inputFieldBoundingClientRect.width - 38}px`;
      }
      syncButtonPosition();
      window.addEventListener("resize", syncButtonPosition);
  
      // When the button is clicked, call the OpenAI API and replace the text in the input field with the response
      button.addEventListener("click", async () => {
        button.disabled = "true";
  
        const isContentEditableType = inputField.getAttribute("contenteditable");
        const inputText = isContentEditableType ? inputField.innerText : inputField.value;
  
        if (inputText) {
          const response = await fetch("https://api.openai.com/v1/completions", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: "text-davinci-003",
              prompt: inputText,
              max_tokens: 1000
            })
          });
          const data = await response.json();
          console.log(`OpenAI API response →`, data);
  
          const output = data.choices[0].text;
          
          // Replace the input field's text with the response
          if (isContentEditableType) {
            inputField.innerText = output;
          } else {
            inputField.value = output;
          }
        } else {
          console.error("No prompt found for OpenAI API.");
        }
  
        button.disabled = null;
      });
    });
}

// This is the main function that runs when the extension is activated
function main() {
  // Get all input fields on the page
  const inputFields = document.querySelectorAll(inputElementSelector);
  console.log("input elms", inputFields);

  doTheThing(inputFields);
}

// Run the main function when the extension is activated
window.addEventListener("load", main);