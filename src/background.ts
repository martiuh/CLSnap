import { MessengerInterface } from './lib/messenger';
import { RouterActions, routerActions, ROUTER_KEY } from './store/router';
import { Overwrite } from './types/interfaces';

const logJob = (payload: any): void => {
  // Don't erase this console log
  console.log(payload);
};

const onMessageListener = function (message: MessengerInterface) {
  const { namespace, action, payload } = message;
  switch (namespace) {
    case 'COMMON': {
      if (action === 'log') {
        logJob(payload);
      }
      break;
    }
    case ROUTER_KEY: {
      return backgroundRouterActions({ action, payload });
    }
  }
  return true;
};

chrome.runtime.onMessage.addListener(onMessageListener);

function backgroundRouterActions(
  params: Omit<MessengerInterface, 'namespace'>
) {
  const action = params.action as RouterActions;
  switch (action) {
    case 'SHIFT_TABS':
      {
        const url = chrome.runtime.getURL('inspector.html#hola');
        chrome.tabs.create({ url });
      }
      break;
    default:
      break;
  }
}
