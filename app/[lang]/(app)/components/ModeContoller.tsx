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
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuTrigger,
 DropdownMenuGroup,
 DropdownMenuItem,
 DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useShareDictionary } from '../services/share-dictionary/shareDictionaryContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { getModeIcon } from '../utils/getModeIcons';

function ModeControllerButton() {
 const { localeInfo } = useBaseConfig();
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
   className='rounded-full'
  >
   {getModeIcon(theme as AppModes, { className: 'size-5' })}
  </Button>
 );

 return (
  <>
   <div className='hidden lg:block'>
    <DropdownMenu dir={localeInfo.contentDirection}>
     <DropdownMenuTrigger asChild>{modeButton}</DropdownMenuTrigger>
     <DropdownMenuContent align='start' className='w-40'>
      <DropdownMenuLabel className='hidden'>
       {modeController.description}
      </DropdownMenuLabel>
      <DropdownMenuGroup>
       {appModes.map((mode) => (
        <DropdownMenuItem key={mode} onClick={() => setTheme(mode)}>
         {getModeIcon(mode, { className: 'size-6' })}
         <span>{modes[mode]}</span>
        </DropdownMenuItem>
       ))}
      </DropdownMenuGroup>
     </DropdownMenuContent>
    </DropdownMenu>
   </div>
   <div className='inline-block lg:hidden'>
    <Drawer>
     <DrawerTrigger asChild>{modeButton}</DrawerTrigger>
     <DrawerContent>
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
   </div>
  </>
 );
}

export { ModeControllerButton };
