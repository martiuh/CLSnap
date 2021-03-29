import { messenger } from './messenger';

/**
 *
 * @description simple print command for debugging purposes
 * @example print('WAZZA');
 */
export const print = (...msg: any): void => {
  if (chrome && chrome.runtime) {
    messenger({ namespace: 'COMMON', action: 'log', payload: msg });
  }
};
