'use client';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import DinnerIcon from '@/app/[lang]/(app)/components/icons/DinnerIcon';
import { useProfileContext } from '../services/profile/profileContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function Tabs() {
 const { locale } = useBaseConfig();
 const { toggleProfile } = useProfileContext();
 const {
  restaurantShareDictionary: {
   components: { tabs: tabsDic },
  },
 } = useRestaurantShareDictionary();

 const tabClass = 'h-auto flex-col p-1! grow sm:text-base';
 const tabIconClass = 'size-8 sm:size-9';

 return (
  <nav className=' shrink-0 flex items-center lg:hidden fixed end-0 start-0 bottom-0 z-(--app-restaurant-tabs-zindex) bg-neutral-100 dark:bg-neutral-900 *:shrink-0 border-t border-input text-neutral-700 dark:text-neutral-300 transition-transform in-data-[scroll-dicretion="down"]:translate-y-20'>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/restaurant/salons`}>
     <DinnerIcon className={tabIconClass} />
     <p>{tabsDic.salons}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} asChild>
    <Link href={`/${locale}/restaurant/new-order`}>
     <DishIcon className={tabIconClass} />
     <p>{tabsDic.newOrder}</p>
    </Link>
   </Button>
   <Button variant='ghost' className={tabClass} onClick={() => toggleProfile()}>
    <FaUserCircle className={tabIconClass} />
    <p>{tabsDic.profile}</p>
   </Button>
  </nav>
 );
}
