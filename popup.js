const WEBHOOK_URL = 'KTX_MACRO::slackWebHookUrl';
const fetchJson = (url, option, data) =>
    fetch(url, {
        body: JSON.stringify(data),
        ...option,
    });


(() => {
    const MESSAGE_RESET = '초기화 되었습니다.';
    const MESSAGE_CONNECTION_SUCCESS = '연동되었습니다.';
    const MESSAGE_CONNECTION_FAIL = '연동에 실패하였습니다.<br>입력하신 정보를 다시 확인해주세요.';

    const init = () => {
        chrome.storage.local.get([WEBHOOK_URL], (result) => {
            document.getElementById('webhook-url').value = result[WEBHOOK_URL];
        });
    }

    const save = () => {
        const webhookUrl = document.getElementById('webhook-url').value;

        if (webhookUrl) {
            fetchJson(
                webhookUrl,
                { method: "post" },
                {
                    text:
                        "코레일 예매를 위한 연동이 완료되었습니다. \n" +
                        "준비가 완료되면 이 채널로 알려드릴게요 :+1:",
                }
            ).then(response => {
                if (response.status === 200) {
                    chrome.storage.local.set({ [WEBHOOK_URL]: webhookUrl }, () => {
                        setMessage(MESSAGE_CONNECTION_SUCCESS);
                    });
                } else {
                    setMessage(MESSAGE_CONNECTION_FAIL);
                }
            }).catch(err => {
                setMessage(MESSAGE_CONNECTION_FAIL);
            });
        }
    }

    const reset = () => {
        document.getElementById('webhook-url').value = '';
        chrome.storage.local.remove(WEBHOOK_URL, () => {
            setMessage(MESSAGE_RESET);
        });
    }

    const setMessage = message => {
        document.getElementById('message').innerHTML = message;
    }

    init();
    document.getElementById('button-save').addEventListener('click', save);
    document.getElementById('button-reset').addEventListener('click', reset);
})();