import { Button } from '@/components/ui/button';
import { useSettingsContext } from '../settingsContext';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import { FaArrowRight } from 'react-icons/fa6';

export default function BackBtn({ className }: { className?: string }) {
 const { setActiveView } = useSettingsContext();
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <Button
   className={`sm:px-8! px-4! py-3! h-full flex items-center justify-center gap-2 rounded-lg  ${className ? className : ' border border-primary/90 dark:border-primary/90 dark:hover:border-primary hover:border-primary text-gray-200 hover:text-gray-200! dark:text-gray-500 dark:hover:text-gray-500'}`}
   onClick={() => setActiveView(null)}
   variant='outline'
  >
   <FaArrowRight className='font-medium sm:size-5 size-4' />
   <span className='font-medium sm:text-sm text-xs sm:block hidden'>
    {settings.backBtn}
   </span>
  </Button>
 );
}
