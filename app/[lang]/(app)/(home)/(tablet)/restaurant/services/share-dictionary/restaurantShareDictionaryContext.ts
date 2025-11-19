import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type RestaurantShareDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/share/dictionary';

interface Store {
 restaurantShareDictionary: RestaurantShareDictionary;
}

const shareDictionaryContext = createContext<Store | null>(null);

function useRestaurantShareDictionary(): Store {
 const value = use(shareDictionaryContext);
 if (!value) throw new OutOfContext('shareDictionary');
 return value;
}

export type { Store };

export { shareDictionaryContext, useRestaurantShareDictionary };
