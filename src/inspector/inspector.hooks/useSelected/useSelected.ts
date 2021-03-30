import { useState } from 'react';

export interface UseSelectedProps<ITEM> {
  items: ITEM[];
  initialIndex?: number;
  config?: {
    /**
     * make the selection never start
     * @default false
     */
    repeat: boolean;
  };
}

export interface Handler {
  onClick: () => void;
  disabled: boolean;
}
export interface UseSelectedInterface<ITEM> {
  currentItem: ITEM;
  currentIndex: number;
  jsxProps: {
    nextHandler: Handler;
    prevHandler: Handler;
  };
  programmatic: {
    goNext: () => void;
    goPrev: () => void;
    selectItem: SelectItemFunction;
  };
}

export type SelectItemFunction = (nextIndex: number) => void;

export function useSelected<ITEM>(
  props: UseSelectedProps<ITEM>
): UseSelectedInterface<ITEM> {
  const { items, initialIndex } = props;
  const itemsCount = items.length;
  const [currentIndex, setCurrentIndex] = useState(
    getInitialIndex(initialIndex, itemsCount)
  );
  const currentItem = items[currentIndex];

  const nextIndex = currentIndex + 1;
  const prevIndex = currentIndex - 1;

  const hasNext = nextIndex < itemsCount;
  const hasPrev = prevIndex >= 0;

  const selectItem: SelectItemFunction = (index: number) => {
    const itemExists = isIndexInRange(index, itemsCount);
    if (itemExists) {
      setCurrentIndex(index);
    }
  };

  const goNext = () => selectItem(currentIndex + 1);
  const goPrev = () => selectItem(currentIndex - 1);

  const nextHandler = {
    onClick: goNext,
    disabled: !hasNext,
  };

  const prevHandler = {
    onClick: goPrev,
    disabled: !hasPrev,
  };

  return {
    currentItem,
    currentIndex,
    jsxProps: {
      nextHandler,
      prevHandler,
    },
    programmatic: {
      goNext,
      goPrev,
      selectItem,
    },
  };
}

function getInitialIndex(index: number | undefined, count: number): number {
  if (index) {
    if (isIndexInRange(index, count)) {
      return index;
    }
  }
  return 0;
}

function isIndexInRange(index: number, count: number): boolean {
  return index < count && index >= 0;
}
