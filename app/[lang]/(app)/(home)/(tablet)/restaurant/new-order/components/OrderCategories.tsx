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
  slides: {
   perView: 7,
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
      className='text-foreground keen-slider__slide h-28 rounded-xl p-2 flex flex-col items-center justify-center gap-1 bg-neutral-200 dark:bg-neutral-800 data-[active="true"]:bg-primary data-[active="true"]:text-white data-[active="true"]:dark:text-primary-foreground'
     >
      <DishIcon className='size-12 font-medium' />
      <p className='font-medium'>میان معده</p>
     </Button>
    ))}
   </div>
  </div>
 );
}
