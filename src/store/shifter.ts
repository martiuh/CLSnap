/**
 * Shifter: records the CLS and the current markup
 */
import { MessengerInterface } from '../lib/messenger';
import { GenericCallback, Overwrite } from '../types/interfaces';

export type ShifterState = 'SAVE' | 'CLEAR';

export type ShifterCallback = GenericCallback<ShifterState>;

export type ShifterMessengerType = Overwrite<
  MessengerInterface,
  { action: ShifterState }
>;

export const SHIFTER_KEY = 'shifterState';

export const getShifterState = () =>
  new Promise<ShifterState>((resolve, reject) => {
    chrome.storage.sync.get([SHIFTER_KEY], (items) => {
      const syncState = items[SHIFTER_KEY];

      if (syncState) {
        resolve(syncState);
      }
    });
  });

export const listenShifterState = (callback: ShifterCallback) => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const shifter_key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, shifter_key)) {
        const element = changes[shifter_key];
        if (shifter_key === SHIFTER_KEY) {
          callback(element.newValue);
        }
      }
    }
  });
};

export const saveShifterState = () => {};
