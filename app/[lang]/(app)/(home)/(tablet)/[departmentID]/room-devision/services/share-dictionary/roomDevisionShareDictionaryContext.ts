import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type RoomDevisionShareDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/share/dictionary';

interface Store {
 roomDevisionShareDictionary: RoomDevisionShareDictionary;
}

const shareDictionaryContext = createContext<Store | null>(null);

function useRoomDevisionShareDictionary(): Store {
 const value = use(shareDictionaryContext);
 if (!value) throw new OutOfContext('shareDictionary');
 return value;
}

export type { Store };
export { shareDictionaryContext, useRoomDevisionShareDictionary };
