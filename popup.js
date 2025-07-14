document.addEventListener("DOMContentLoaded", () => {
  const powerButton = document.getElementById("powerButton");
  const statusText = document.getElementById("statusText");

  chrome.storage.local.get("chatSplitOn", (data) => {
    const isOn = data.chatSplitOn === true;
    updateUI(isOn);
  });

  powerButton.addEventListener("click", async () => {
    chrome.storage.local.get("chatSplitOn", async (data) => {
      const isOn = data.chatSplitOn === true;
      const newState = !isOn;
      chrome.storage.local.set({ chatSplitOn: newState });
      updateUI(newState);

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: toggleSplitWithPrompt,
        args: [newState]
      });
    });
  });

  function updateUI(isOn) {
    if (isOn) {
      powerButton.classList.add("on");
      statusText.textContent = "Status: ON";
    } else {
      powerButton.classList.remove("on");
      statusText.textContent = "Status: OFF";
    }
  }
});

function toggleSplitWithPrompt(enable) {
  const iframe = document.getElementById("helperChatGPT");
  const chatWindow = document.querySelector("main");

  if (enable) {
    if (!iframe && chatWindow) {
      chatWindow.style.width = "75%";
      chatWindow.style.float = "left";
      chatWindow.style.borderRight = "2px solid #ccc";

      const helperIframe = document.createElement("iframe");
      helperIframe.src = "https://chat.openai.com";
      helperIframe.id = "helperChatGPT";
      helperIframe.style.width = "25%";
      helperIframe.style.height = "100vh";
      helperIframe.style.border = "none";
      helperIframe.style.position = "fixed";
      helperIframe.style.top = "0";
      helperIframe.style.right = "0";
      helperIframe.style.zIndex = "9999";
      document.body.appendChild(helperIframe);

      const style = document.createElement("style");
      style.innerHTML = `body { overflow-x: hidden !important; }`;
      document.head.appendChild(style);

      const messages = [...document.querySelectorAll("main div")];
      const userMessage = messages.reverse().find(div => div.innerText && div.innerText.length < 500)?.innerText || "this topic";
      const assistantPrompt = `Can you give me a general overview about ${userMessage.split('.')[0].trim()}?`;
      localStorage.setItem("chatGPT_tutor_prompt", assistantPrompt);
    }
  } else {
    if (iframe) iframe.remove();
    if (chatWindow) {
      chatWindow.style.width = "100%";
      chatWindow.style.float = "none";
      chatWindow.style.borderRight = "none";
    }
  }
}