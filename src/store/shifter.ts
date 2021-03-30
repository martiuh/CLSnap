/**
 * Shifter: records the CLS and the current markup
 */
import { MessengerInterface } from '../lib/messenger';
import {
  GenericCallback,
  LayoutShiftInterface,
  Overwrite,
} from '../types/interfaces';
import { unique } from '../utils/unique';

export interface ShifterState {
  id: string;
  layoutShift: LayoutShiftInterface;
  node: string;
  dataUri: string;
}

export type SyncShifterState = Overwrite<ShifterState, { layoutShift: string }>;

export type ShifterActions = 'SAVE' | 'CLEAR';

export type ShifterCallback = GenericCallback<ShifterActions>;

export type ShifterMessengerType = Overwrite<
  MessengerInterface,
  { action: ShifterActions }
>;

export const SHIFTER_KEY = 'shifterState';

export const getShifterState = () =>
  new Promise<SyncShifterState[]>((resolve, reject) => {
    chrome.storage.local.get([SHIFTER_KEY], (items) => {
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
  chrome.storage.local.set({ [SHIFTER_KEY]: state });
};

export const clearShifterState = () => {
  chrome.storage.local.clear();
};

export type ConcatenateShift = Omit<ShifterState, 'id' | 'dataUri'>;

export const concatenateShifts = async (shift: ConcatenateShift) => {
  const currentState = await getShifterState();
  const currentCount = currentState.length;
  const lastShift = currentState[currentCount - 1] ?? {};
  const nextShift = createShift(shift);

  if (lastShift?.dataUri) {
    console.log(lastShift.dataUri, nextShift.dataUri);
    // Avoid loading insignificant layout shifts
    if (lastShift.dataUri === nextShift.dataUri) {
      return;
    }
  }

  writeShifterState([...currentState, nextShift]);
};

const createShift = (shift: ConcatenateShift): SyncShifterState => {
  const { node } = shift;
  return {
    id: unique(),
    layoutShift: JSON.stringify(shift.layoutShift),
    node,
    dataUri: `data:text/html;charset=UTF-8,${encodeURIComponent(node)}`,
  };
};
