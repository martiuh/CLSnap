import { getPerformanceObserver } from './lib/getPerformanceObserver';
import { createMessenger, MessengerInterface } from './lib/messenger';
import {
  RECORDER_KEY,
  RecorderMessengerType,
  getRecorderState,
} from './store/recorder';
import { RouterActions, ROUTER_KEY } from './store/router';
import {
  concatenateShifts,
  ShifterMessengerType,
  SHIFTER_KEY,
  writeShifterState,
} from './store/shifter';

const perfObserver = getPerformanceObserver(async (cls, entry) => {
  const nodeHTML =
    document.querySelector('html')?.innerHTML ?? '<h1>Node not found</h1>';

  // Taken from https://stackoverflow.com/a/9239272/4879756
  const node = nodeHTML
    .replace(/\s{2,}/g, '') // <-- Replace all consecutive spaces, 2+
    .replace(/%/g, '%25') // <-- Escape %
    .replace(/&/g, '%26') // <-- Escape &
    .replace(/#/g, '%23'); // <-- Escape #

  await concatenateShifts({
    layoutShift: entry,
    // IDEA: you can chose to just run the layout shifts for certain elements
    node,
  });
});

chrome.runtime.onMessage.addListener(function (
  msg: MessengerInterface,
  sender,
  sendResponse
) {
  const { namespace, ...message } = msg;
  if (RECORDER_KEY === namespace) {
    return manageRecorderState(message as RecorderMessengerType);
  }

  if (SHIFTER_KEY === namespace) {
    return manageShifterState(message as ShifterMessengerType);
  }
});

const manageRecorderState = (params: RecorderMessengerType) => {
  const { action } = params;

  const resetShifterState = () => writeShifterState([]);

  const routerMessenger = createMessenger<RouterActions>(ROUTER_KEY);

  switch (action) {
    case 'STOPPED':
      perfObserver.stop();
      routerMessenger({ action: 'SHIFT_TABS' });
      break;

    case 'RECORDING': {
      resetShifterState();
      perfObserver.start();
      break;
    }

    case 'RELOAD_AND_RECORD': {
      resetShifterState();
      break;
    }
  }
};

const manageShifterState = (params: ShifterMessengerType) => {
  const { action } = params;

  switch (action) {
    case 'SAVE': {
      break;
    }

    default:
      break;
  }
};

const runReloadAndRecordJob = async () => {
  const state = await getRecorderState();
  if (state === 'RELOAD_AND_RECORD') {
    perfObserver.start();
  }
};

runReloadAndRecordJob();
