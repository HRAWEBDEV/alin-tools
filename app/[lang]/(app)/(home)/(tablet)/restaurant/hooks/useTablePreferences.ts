import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { useCallback } from 'react';

const TABLE_VIEW_MODE_KEY = 'tablesDisplayMode';
const TABLE_BOLD_STYLE_KEY = 'tablesBoldStyle';

export const TABLE_DISPLAY_MODES = {
 NORMAL: 'normalMode',
 MINIMAL: 'minimalMode',
} as const;

export function useTablePreferences() {
 const displayMode = useLocalStorageSync(TABLE_VIEW_MODE_KEY);
 const boldStyle = useLocalStorageSync(TABLE_BOLD_STYLE_KEY);

 const isMinimal = displayMode === TABLE_DISPLAY_MODES.MINIMAL;
 const isBold = boldStyle === 'true';

 const setDisplayMode = useCallback((mode: string) => {
  if (typeof window !== 'undefined') {
   localStorage.setItem(TABLE_VIEW_MODE_KEY, mode);
   window.dispatchEvent(new Event('local-storage'));
  }
 }, []);

 const setBoldStyle = useCallback((bold: boolean) => {
  if (typeof window !== 'undefined') {
   localStorage.setItem(TABLE_BOLD_STYLE_KEY, String(bold));
   window.dispatchEvent(new Event('local-storage'));
  }
 }, []);

 return {
  displayMode: displayMode || TABLE_DISPLAY_MODES.NORMAL,
  isMinimal,
  isBold,
  setDisplayMode,
  setBoldStyle,
 };
}
