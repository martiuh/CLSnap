export interface LayoutShiftInterface extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export type GenericCallback<T> = (state: T) => void;

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
