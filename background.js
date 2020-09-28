const WEBHOOK_URL = 'KTX_MACRO::slackWebHookUrl';
const fetchJson = (url, option, data) =>
  fetch(url, {
    body: JSON.stringify(data),
    ...option,
  });

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

const sendWebhookMessage = () => {
  chrome.storage.local.get([WEBHOOK_URL], (result) => {
    const webhookUrl = result[WEBHOOK_URL];
    if (webhookUrl) {
      fetchJson(
        webhookUrl,
        {
          method: "post",
        },
        {
          text:
            "예약이 완료되었습니다. 지금 결제해주세요! :fast_forward: \n" +
            "http://www.letskorail.com/",
        }
      );
    }
  });

};

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type == "successTicketing") {
    playSound();
    sendWebhookMessage();
    sendResponse(true);
  }
});
