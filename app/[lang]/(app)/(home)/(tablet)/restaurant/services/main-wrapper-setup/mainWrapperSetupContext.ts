import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface MainWrapperSetup {
 scrollToTop: () => unknown;
}

const mainWrapperSetupContext = createContext<null | MainWrapperSetup>(null);

function useMainWrapperSetupContext() {
 const val = use(mainWrapperSetupContext);
 if (!val) throw new OutOfContext('mainWrapperSetupContext');
 return val;
}

export type { MainWrapperSetup };
export { mainWrapperSetupContext, useMainWrapperSetupContext };
