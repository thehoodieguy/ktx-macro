const getWebhookUrl = () => localStorage.getItem("KTX_MACRO::slackWebHookUrl");

const playSound = () => {
  if (typeof audio != "undefined" && audio) {
    audio.pause();
    document.body.removeChild(audio);
    audio = null;
  }
  audio = document.createElement("audio");
  document.body.appendChild(audio);
  audio.autoplay = true;
  audio.src = chrome.extension.getURL("tada.mp3");
  audio.play();
};

const sendTelegramMessage = () => {
  const botToken = localStorage.getItem("KTX_MACRO::bot-token");
  const chatId = localStorage.getItem("KTX_MACRO::chat-id");

  if (!botToken || !chatId) {
    return;
  }

  const msg = encodeURI("예약을 시도하였습니다. 예약을 확인해주세요.");
  const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;

  fetch(url);
};

const sendWebhookMessage = () => {
  const webhookUrl = getWebhookUrl();
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "post",
      body: {
        text:
          "예약이 완료되었습니다. 지금 결제해주세요! :fast_forward: \n" +
          "http://www.letskorail.com/",
      },
    });
  }
};

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type == "successTicketing") {
    playSound();
    sendTelegramMessage();
    sendWebhookMessage();
    sendResponse(true);
  }
});
