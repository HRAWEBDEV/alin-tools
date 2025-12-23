import { OutOfContext } from '@/utils/OutOfContext';
import { use, createContext } from 'react';

interface Login {
 loginModalIsOpen: boolean;
 changeLoginModalIsOpen: (open?: boolean) => unknown;
 //  justLoggedIn: boolean;
 //  setJustLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const loginContext = createContext<Login | null>(null);

function useLoginContext() {
 const val = use(loginContext);
 if (!val) throw new OutOfContext('loginContext');
 return val;
}

export type { Login };
export { loginContext, useLoginContext };
