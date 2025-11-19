'use client';
import {
 Drawer,
 DrawerClose,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { locales } from '@/internalization/app/localization';
import { Badge } from '@/components/ui/badge';
import { getLocaleIcon } from '../utils/getLocaleIcons';

function LocaleControllerButton() {
 const { localeInfo, setLocale } = useBaseConfig();
 // mode icon
 const modeButton = (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='relative rounded-full size-11'
  >
   <div className='absolute -top-1 -end-2'>
    <Badge variant='secondary'>{localeInfo.localeShortName}</Badge>
   </div>
   <FaGlobeAmericas className='size-6' />
  </Button>
 );

 return (
  <Drawer>
   <DrawerTrigger asChild>{modeButton}</DrawerTrigger>
   <DrawerContent className='min-h-[40svh]'>
    <DrawerHeader className='hidden'>
     <DrawerTitle></DrawerTitle>
    </DrawerHeader>
    <ul className='py-2'>
     {Object.values(locales).map((locale) => (
      <li key={locale.locale}>
       <DrawerClose asChild>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className={`text-base p-4! w-full justify-start h-[unset] gap-4 items-center ${locale.locale === 'fa' ? 'font-fa-sans' : 'font-en-roboto'}`}
         onClick={() => setLocale(locale.locale)}
         disabled={!locale.active}
        >
         {getLocaleIcon(locale.locale, { className: 'size-8 rounded-full' })}
         <span>{locale.localeName}</span>
        </Button>
       </DrawerClose>
      </li>
     ))}
    </ul>
   </DrawerContent>
  </Drawer>
 );
}

export { LocaleControllerButton };
