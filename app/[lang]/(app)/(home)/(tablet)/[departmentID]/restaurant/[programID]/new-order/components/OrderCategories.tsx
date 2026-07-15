'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useKeenSlider } from 'keen-slider/react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { useMainWrapperSetupContext } from '../../../services/main-wrapper-setup/mainWrapperSetupContext';
import { useOrderBaseConfigContext } from '../services/order-tools/orderBaseConfigContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderCategories({}: { dic: NewOrderDictionary }) {
 const {
  initialDataInfo: { data, isLoading },
  itemsInfo: { selectedItemGroup, changeSelectedItemGroup },
  showSplitPanel,
 } = useOrderBaseConfigContext();
 const { scrollDirection, scrollToTop } = useMainWrapperSetupContext();
 const { localeInfo } = useBaseConfig();

 const [splitPanelSliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  breakpoints: {
   '(max-width:1580px)': {
    slides: {
     perView: 6,
     spacing: 4,
    },
   },
   '(max-width:1366px)': {
    slides: {
     perView: 4,
     spacing: 4,
    },
   },
   '(max-width:980px)': {
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
   perView: 10,
   spacing: 4,
  },
 });

 const itemGroupsButtonClass = `transition-[height_0.4s_ease] w-full ${scrollDirection === 'down' ? 'h-14' : 'h-24'} border border-border rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 data-[active="true"]:bg-primary data-[active="true"]:text-white data-[active="true"]:dark:text-primary-foreground cursor-pointer`;

 return (
  <div>
   <div
    key={'show-slider ' + String(isLoading) + ' ' + String(showSplitPanel)}
    ref={showSplitPanel ? splitPanelSliderRef : sliderRef}
    className='keen-slider'
   >
    {isLoading ? (
     <div className={itemGroupsButtonClass + ' cursor-not-allowed'}>
      <Skeleton />
     </div>
    ) : (
     data?.itemGroups.map(({ key, value }) => (
      <div key={key} className={`keen-slider__slide number-slide${key}`}>
       <button
        data-active={selectedItemGroup?.key === key}
        className={itemGroupsButtonClass}
        onClick={() => {
         changeSelectedItemGroup({ key, value });
         scrollToTop();
        }}
       >
        {scrollDirection === 'up' && <DishIcon className='size-10 shrink-0' />}
        <p className='text-wrap text-sm font-medium'>{value}</p>
       </button>
      </div>
     ))
    )}
   </div>
  </div>
 );
}
