import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

type ScrollDirection = 'up' | 'down';

interface MainWrapperSetup {
 scrollToTop: () => unknown;
 scrollTop: number;
 scrollDirection: ScrollDirection;
}

const mainWrapperSetupContext = createContext<null | MainWrapperSetup>(null);

function useMainWrapperSetupContext() {
 const val = use(mainWrapperSetupContext);
 if (!val) throw new OutOfContext('mainWrapperSetupContext');
 return val;
}

export type { MainWrapperSetup, ScrollDirection };
export { mainWrapperSetupContext, useMainWrapperSetupContext };
