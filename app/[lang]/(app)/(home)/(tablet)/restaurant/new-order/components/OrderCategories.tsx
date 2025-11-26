'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useKeenSlider } from 'keen-slider/react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { Button } from '@/components/ui/button';

export default function OrderCategories({ dic }: { dic: NewOrderDictionary }) {
 const { localeInfo } = useBaseConfig();
 const [sliderRef, sliderInstanceRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  mode: 'free',
  slides: {
   perView: 8,
   spacing: 8,
  },
 });
 return (
  <div>
   <div ref={sliderRef} className='keen-slider'>
    {Array.from({ length: 10 }, (_, i) => i).map((i) => (
     <Button
      data-active={i === 0}
      key={i}
      className='keen-slider__slide h-24 rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 data-[active="true"]:bg-primary data-[active="true"]:text-white data-[active="true"]:dark:text-primary-foreground'
     >
      <DishIcon className='size-10' />
      <p className='text-wrap text-xs font-medium'>شام نهار صبحانه</p>
     </Button>
    ))}
   </div>
  </div>
 );
}
