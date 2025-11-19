'use client';
import { type AppModes, appModes } from '@/theme/appModes';
import { useTheme } from 'next-themes';
import {
 Drawer,
 DrawerClose,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useShareDictionary } from '../services/share-dictionary/shareDictionaryContext';
import { getModeIcon } from '../utils/getModeIcons';

function ModeControllerButton() {
 const {
  shareDictionary: {
   system: { modes },
   components: { modeController },
  },
 } = useShareDictionary();
 const { theme, setTheme } = useTheme();

 // mode icon
 const modeButton = (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='rounded-full size-11'
  >
   {getModeIcon(theme as AppModes, { className: 'size-6' })}
  </Button>
 );

 return (
  <Drawer>
   <DrawerTrigger asChild>{modeButton}</DrawerTrigger>
   <DrawerContent className='min-h-[40svh]'>
    <DrawerHeader className='hidden'>
     <DrawerTitle>{modeController.description}</DrawerTitle>
    </DrawerHeader>
    <ul className='py-2'>
     {appModes.map((mode) => (
      <li key={mode}>
       <DrawerClose asChild>
        <Button
         variant='ghost'
         size={'icon-lg'}
         className='p-4! w-full justify-start h-[unset] gap-4 items-center'
         onClick={() => setTheme(mode)}
        >
         {getModeIcon(mode, { className: 'size-6' })}
         <span>{modes[mode]}</span>
        </Button>
       </DrawerClose>
      </li>
     ))}
    </ul>
   </DrawerContent>
  </Drawer>
 );
}

export { ModeControllerButton };
