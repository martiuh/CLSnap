/**
 * Router: tells when to create a new tab with certain data
 */
import { MessengerInterface } from '../lib/messenger';
import { GenericCallback, Overwrite } from '../types/interfaces';

export const routerActions = {
  WEBPAGE: 'WEBPAGE',
  SHIFT_TABS: 'SHIFT_TABS',
};

export type RouterActions = keyof typeof routerActions;

export type RouterCallback = GenericCallback<RouterActions>;

export type RouterMessengerType = Overwrite<
  MessengerInterface,
  { action: RouterActions }
>;

export const ROUTER_KEY = 'routerState';

export const getRouterState = () =>
  new Promise<RouterActions[]>((resolve, reject) => {
    chrome.storage.sync.get([ROUTER_KEY], (items) => {
      const syncState = items[ROUTER_KEY];

      if (syncState) {
        resolve(syncState);
      } else {
      }
    });
  });

export const setRouterState = (state: RouterActions[]) => {
  chrome.storage.sync.set({ [ROUTER_KEY]: state });
};
