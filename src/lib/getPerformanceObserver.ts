import { LayoutShiftInterface } from '../types/interfaces';
import { print } from './print';

export type PerfObserverCallback = (
  cls: number,
  entry: LayoutShiftInterface
) => void;

export interface PerfObserver {
  /**
   * fires the `layout-shift` observer
   */
  start: () => void;
  stop: () => void;
  /**
   * since we are adding some custom methods, we are keeping the original observer here
   */
  original: PerformanceObserver;
}

/**
 * @description observe the layout shift
 */
export function getPerformanceObserver(
  callback: PerfObserverCallback
): PerfObserver {
  let cls = 0;
  const perfObserver = new PerformanceObserver((entryList) => {
    for (const e of entryList.getEntries()) {
      const entry = e as LayoutShiftInterface;
      if (!entry.hadRecentInput) {
        cls += entry.value;
        callback(cls, entry);
      }
    }
  });

  return {
    original: perfObserver,
    start: () => perfObserver.observe({ type: 'layout-shift', buffered: true }),
    stop: () => perfObserver.disconnect(),
  };
}
