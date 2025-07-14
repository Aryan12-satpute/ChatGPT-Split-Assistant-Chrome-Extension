
(function() {
    if (document.getElementById('chatgpt-split-assistant-frame')) return;

    const iframe = document.createElement('iframe');
    iframe.id = "chatgpt-split-assistant-frame";
    iframe.src = "https://chat.openai.com/";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "0";
    iframe.style.width = "25%";
    iframe.style.height = "100%";
    iframe.style.zIndex = "9999";
    iframe.style.backgroundColor = "white";
    iframe.style.boxShadow = "0 0 12px 4px #00ff88";
    iframe.style.border = "2px solid #00ff88";
    iframe.style.borderRadius = "4px";
    iframe.style.transition = "all 0.3s ease-in-out";

    document.body.appendChild(iframe);
})();
