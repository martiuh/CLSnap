/**
 *
 * @description simple print command for debugging purposes
 * @example print('WAZZA');
 */
export const print = (...msg: any): void => {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: 'log', payload: msg });
  }
};
