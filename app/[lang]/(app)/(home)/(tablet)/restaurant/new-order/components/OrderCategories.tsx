'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useKeenSlider } from 'keen-slider/react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { useScrollWatcher } from '../../hooks/useScrollWatcher';

export default function OrderCategories({}: { dic: NewOrderDictionary }) {
 const { scrollTop } = useScrollWatcher();
 const scrollTopOffsetReached = scrollTop > 20;
 const { localeInfo } = useBaseConfig();
 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  breakpoints: {
   '(max-width:1280px)': {
    slides: {
     perView: 6,
     spacing: 4,
    },
   },
   '(max-width:980px)': {
    slides: {
     perView: 4,
     spacing: 4,
    },
   },
   '(max-width:700px)': {
    slides: {
     perView: 3,
     spacing: 4,
    },
   },
  },
  slides: {
   perView: 8,
   spacing: 4,
  },
 });
 return (
  <div>
   <div ref={sliderRef} className='keen-slider'>
    {Array.from({ length: 10 }, (_, i) => i).map((i) => (
     <div key={i} className={`keen-slider__slide number-slide${i}`}>
      <button
       data-active={i === 0}
       className={`transition-[height_0.4s_ease] w-full ${scrollTopOffsetReached ? 'h-16' : 'h-24'} rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 data-[active="true"]:bg-primary data-[active="true"]:text-white data-[active="true"]:dark:text-primary-foreground cursor-pointer`}
      >
       <DishIcon className='size-10' />
       {!scrollTopOffsetReached && (
        <p className='text-wrap text-xs font-medium'>شام نهار صبحانه</p>
       )}
      </button>
     </div>
    ))}
   </div>
  </div>
 );
}
