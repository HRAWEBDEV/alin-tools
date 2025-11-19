'use client';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';
import { FaUserCircle } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { CgMenuGridO } from 'react-icons/cg';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';

export default function Tabs() {
 const {
  restaurantShareDictionary: {
   components: { tabs: tabsDic },
  },
 } = useRestaurantShareDictionary();

 const tabClass = 'h-auto flex-col p-1! grow sm:text-base';
 const tabIconClass = 'size-8 sm:size-9';

 return (
  <nav className='flex items-center lg:hidden fixed end-0 start-0 bottom-0 z-(--app-restaurant-tabs-zindex) bg-neutral-100 dark:bg-neutral-900 *:shrink-0 border-t border-input text-neutral-700 dark:text-neutral-300'>
   <Button variant='ghost' className={tabClass}>
    <DishIcon className={tabIconClass} />
    <p>{tabsDic.salons}</p>
   </Button>
   <Button variant='ghost' className={tabClass}>
    <CgMenuGridO className={tabIconClass} />
    <p>{tabsDic.menus}</p>
   </Button>
   <div>
    <Button
     variant='secondary'
     className='p-1! rounded-full size-14 sm:size-16'
    >
     <FaCirclePlus className='size-8 sm:size-9' />
    </Button>
   </div>
   <Button variant='ghost' className={tabClass}>
    <FaUserCircle className={tabIconClass} />
    <p>{tabsDic.salons}</p>
   </Button>
   <Button variant='ghost' className={tabClass}>
    <FaUserCircle className={tabIconClass} />
    <p>{tabsDic.profile}</p>
   </Button>
  </nav>
 );
}
