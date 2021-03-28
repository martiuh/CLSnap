import { MessengerInterface } from '../lib/messenger';
import { GenericCallback, Overwrite } from '../types/interfaces';

export type RecorderState =
  | 'RELOAD_AND_RECORD'
  | 'RECORDING'
  | 'STOPPED'
  | 'IDLE';

export type GenericRecorderCallback = GenericCallback<RecorderState>;

export type RecorderMessengerType = Overwrite<
  MessengerInterface,
  { action: RecorderState }
>;

export const RECORDER_KEY = 'recorderState';

export const getRecorderState = () =>
  new Promise<RecorderState>((resolve, reject) => {
    chrome.storage.sync.get([RECORDER_KEY], (items) => {
      const syncRecorderState = items[RECORDER_KEY];

      if (syncRecorderState) {
        resolve(syncRecorderState);
      }
    });
  });

export const listenRecorderState = (callback: GenericRecorderCallback) => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const recorder_key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, recorder_key)) {
        const element = changes[recorder_key];
        if (recorder_key === RECORDER_KEY) {
          callback(element.newValue);
        }
      }
    }
  });
};
