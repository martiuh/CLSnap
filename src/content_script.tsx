import { getPerformanceObserver } from './lib/getPerformanceObserver';
import {
  createMessenger,
  messenger,
  MessengerInterface,
} from './lib/messenger';
import {
  RECORDER_KEY,
  RecorderMessengerType,
  getRecorderState,
  setRecorderState,
  RecorderActions,
} from './store/recorder';
import { RouterActions, ROUTER_KEY } from './store/router';
import {
  concatenateShifts,
  ShifterMessengerType,
  SHIFTER_KEY,
  writeShifterState,
} from './store/shifter';

const perfObserver = getPerformanceObserver(async (cls, entry) => {
  await concatenateShifts({
    layoutShift: entry,
    // IDEA: you can chose to just run the layout shifts for certain elements
    node:
      document.querySelector('html')?.innerHTML ?? '<h1>Node not found</h1>',
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

    case 'RECORDING':
      resetShifterState();
      perfObserver.start();

    case 'RELOAD_AND_RECORD':
      resetShifterState();

    default:
      break;
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
