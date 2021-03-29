import { act, renderHook } from '@testing-library/react-hooks';
import { useSelected } from '../';

describe('useSelected hook', () => {
  const sayans = ['Goku', 'Vegeta', 'Gohan', 'Raditz', 'Napa', 'Trunks'];

  it('returns currentIndex as 0 and the first item', () => {
    const items1 = [1, 2, 3, 4, 5];
    const expectedIndex = 0;

    const { result } = renderHook(() => useSelected({ items: items1 }));

    const { currentIndex, currentItem } = result.current;

    expect(currentIndex).toBe(expectedIndex);
    expect(currentItem).toBe(items1[expectedIndex]);
  });

  it('returns currentIndex as 2 and the third item', () => {
    const items2 = [1, 2, 3, 4, 5];
    const expectedIndex = 2;

    const { result } = renderHook(() =>
      useSelected({
        items: items2,
        initialIndex: expectedIndex,
      })
    );

    const { currentIndex, currentItem } = result.current;

    expect(currentIndex).toBe(expectedIndex);
    expect(currentItem).toBe(items2[expectedIndex]);
  });

  it('returns currentIndex as 0 when invalid currentIndex is set', () => {
    const items = [1, 2, 3, 4, 5];
    const wrongIndex = items.length;
    const expectedIndex = 0;

    const { result } = renderHook(() =>
      useSelected({
        items: items,
        initialIndex: wrongIndex,
      })
    );

    const { currentIndex, currentItem } = result.current;

    expect(currentIndex).toBe(expectedIndex);
    expect(currentItem).toBe(items[expectedIndex]);
  });

  describe('programmatic', () => {
    it('`goNext` & `goPrev` combined functionality', () => {
      const initialIndex = 2;

      const { result } = renderHook(() =>
        useSelected({ items: sayans, initialIndex })
      );

      const nextIdx = 3;

      act(() => {
        result.current.programmatic.goNext();
      });

      expect(result.current.currentIndex).toBe(nextIdx);
      expect(result.current.currentItem).toBe(sayans[nextIdx]);

      // Moving from two indices down
      // 1 Call
      act(() => {
        result.current.programmatic.goPrev();
      });

      // 2 Call
      act(() => {
        result.current.programmatic.goPrev();
      });

      const nextIdx2 = 1;

      expect(result.current.currentIndex).toBe(nextIdx2);
      expect(result.current.currentItem).toBe(sayans[nextIdx2]);
    });

    it('`goNext` returns same index when currentIndex is last one', () => {
      // Last index
      const initialIndex = sayans.length - 1;

      const { result } = renderHook(() =>
        useSelected({ items: sayans, initialIndex })
      );

      act(() => {
        result.current.programmatic.goNext();
      });

      expect(result.current.currentIndex).toBe(initialIndex);
      expect(result.current.currentItem).toBe(sayans[initialIndex]);
    });

    it('`goPrev` returns same index when currentIndex is first one', () => {
      // Last index
      const initialIndex = 0;

      const { result } = renderHook(() =>
        useSelected({ items: sayans, initialIndex })
      );

      act(() => {
        result.current.programmatic.goPrev();
      });

      expect(result.current.currentIndex).toBe(initialIndex);
      expect(result.current.currentItem).toBe(sayans[initialIndex]);
    });

    it('`selectItem` returns to the desired index', () => {
      const expectedIndex = 3;

      const { result } = renderHook(() => useSelected({ items: sayans }));

      act(() => {
        result.current.programmatic.selectItem(expectedIndex);
      });

      const { currentIndex, currentItem } = result.current;

      expect(currentIndex).toBe(expectedIndex);
      expect(currentItem).toBe(sayans[expectedIndex]);
    });
  });
});
