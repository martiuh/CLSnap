/**
 * Shifter: records the CLS and the current markup
 */
import { MessengerInterface } from '../lib/messenger';
import {
  GenericCallback,
  LayoutShiftInterface,
  Overwrite,
} from '../types/interfaces';

export interface ShifterState {
  layoutShift: LayoutShiftInterface;
  node: HTMLElement;
}

export type SyncShifterState = Record<keyof ShifterState, string>;

export type ShifterActions = 'SAVE' | 'CLEAR';

export type ShifterCallback = GenericCallback<ShifterActions>;

export type ShifterMessengerType = Overwrite<
  MessengerInterface,
  { action: ShifterActions }
>;

export const SHIFTER_KEY = 'shifterState';

export const getShifterState = () =>
  new Promise<SyncShifterState[]>((resolve, reject) => {
    chrome.storage.sync.get([SHIFTER_KEY], (items) => {
      const syncState = items[SHIFTER_KEY];

      if (syncState) {
        resolve(syncState);
      } else {
        resolve([]);
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

export const writeShifterState = (state: SyncShifterState[]) => {
  chrome.storage.sync.set({ [SHIFTER_KEY]: state });
};

export const concatenateShifts = async (shift: ShifterState) => {
  const currentState = await getShifterState();
  const nextState = [...currentState, stringifyShift(shift)];
  writeShifterState(nextState);
};

const stringifyShift = (shift: ShifterState): SyncShifterState => {
  return {
    layoutShift: JSON.stringify(shift.layoutShift),
    node: shift.node.innerHTML,
  };
};
