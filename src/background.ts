const logJob = (payload: any): void => {
  console.log(payload);
};

const onMessageListener = function (message: { type: string; payload: any }) {
  const { payload } = message;
  switch (message.type) {
    case 'log':
      logJob(payload);
      break;
  }
  return true;
};

chrome.runtime.onMessage.addListener(onMessageListener);
