import { LayoutShiftInterface } from '../types/interfaces';
import { print } from './print';

export type PerfObserverCallback = (
  cls: number,
  entry: LayoutShiftInterface
) => void;

export interface PerfObserver extends PerformanceObserver {
  /**
   * fires the `layout-shift` observer
   */
  start: () => void;
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
        print(entry);
        callback(cls, entry);
      }
    }
  });

  return {
    ...perfObserver,
    start: () => perfObserver.observe({ type: 'layout-shift', buffered: true }),
  };
}
