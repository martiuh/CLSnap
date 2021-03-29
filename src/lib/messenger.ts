import { Overwrite } from '../types/interfaces';

export interface MessengerInterface {
  namespace: string;
  action: string;
  payload?: any;
}

export function messenger(params: MessengerInterface) {
  chrome.runtime.sendMessage(params);
  return;
}

export function createMessenger<ACTIONS extends string>(namespace: string) {
  return (
    params: Overwrite<
      Omit<MessengerInterface, 'namespace'>,
      { action: ACTIONS }
    >
  ) => messenger({ ...params, namespace });
}
