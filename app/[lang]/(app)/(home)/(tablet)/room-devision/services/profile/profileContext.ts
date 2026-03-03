import { OutOfContext } from '@/utils/OutOfContext';
import { use, createContext } from 'react';

interface Profile {
 isOpen: boolean;
 toggleProfile: (open?: boolean) => unknown;
}

const profileContext = createContext<null | Profile>(null);

function useProfileContext(): Profile {
 const val = use(profileContext);
 if (!val) throw new OutOfContext('profileContext');
 return val;
}

export type { Profile };
export { profileContext, useProfileContext };
