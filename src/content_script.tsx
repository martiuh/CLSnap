import { getPerformanceObserver } from './lib/getPerformanceObserver';
import { MessengerInterface } from './lib/messenger';
import {
  RECORDER_KEY,
  RecorderMessengerType,
  getRecorderState,
} from './store/recorder';
import { ShifterMessengerType, SHIFTER_KEY } from './store/shifter';

const perfObserver = getPerformanceObserver((cls, entry) => {
  console.log(entry);
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
  const { action, payload } = params;

  switch (action) {
    case 'STOPPED':
      break;

    case 'RECORDING':
      perfObserver.start();

    default:
      break;
  }
};

const manageShifterState = (params: ShifterMessengerType) => {
  const { action, payload } = params;

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
