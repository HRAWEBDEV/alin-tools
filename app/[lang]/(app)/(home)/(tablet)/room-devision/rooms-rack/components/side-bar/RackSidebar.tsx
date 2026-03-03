import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
 FaQuestionCircle,
 FaInfoCircle,
 FaFilter,
 FaThumbtack,
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { Button } from '@/components/ui/button';

export default function RackSidebar({ dic }: { dic: RoomsRackDictionary }) {
 const {
  sidebar: {
   activePanel,
   onChangeActivePanel,
   toggle,
   togglePin,
   isPin,
   isOpen,
  },
 } = useRackConfigContext();
 return (
  <>
   {isOpen && (
    <aside
     className={`fixed inset-0 md:static ${isOpen && !isPin ? 'md:absolute! md:bottom-0 md:top-0 md:start-0 md:end-auto md:w-[18rem]' : ''} h-full p-4 ${isPin ? 'md:pe-0' : ''} flex flex-col overflow-hidden z-[calc(var(--app-restaurant-tabs-zindex)+1)]`}
    >
     <div className='shadow bg-background border border-input grow rounded-md overflow-auto'>
      <div className='p-2 bg-background sticky top-0'>
       <div className='flex justify-end mb-2 gap-2'>
        <Button
         data-is-pin={isPin}
         variant='ghost'
         size='icon-lg'
         className='text-neutral-400 dark:text-neutral-600 data-[is-pin=true]:text-primary hidden md:flex'
         onClick={() => {
          togglePin();
         }}
        >
         <FaThumbtack className='size-5' />
        </Button>
        <Button
         variant='ghost'
         size='icon-lg'
         className='text-destructive'
         onClick={() => toggle(false)}
        >
         <IoMdClose className='size-6' />
        </Button>
       </div>
       <Tabs value={activePanel} dir='rtl'>
        <TabsList className='w-full h-12'>
         <TabsTrigger
          value='info'
          onClick={() => onChangeActivePanel('info')}
          className='grow basis-0 text-neutral-600 dark:text-neutral-400'
         >
          <FaInfoCircle className='size-4' />
          {dic.sidebar.tabs.info}
         </TabsTrigger>
         <TabsTrigger
          value='filters'
          onClick={() => onChangeActivePanel('filters')}
          className='grow basis-0 text-neutral-600 dark:text-neutral-400'
         >
          <FaFilter className='size-4' />
          {dic.sidebar.tabs.filters}
         </TabsTrigger>
         <TabsTrigger
          value='help'
          onClick={() => onChangeActivePanel('help')}
          className='grow basis-0 text-neutral-600 dark:text-neutral-400'
         >
          <FaQuestionCircle className='size-4' />
          {dic.sidebar.tabs.help}
         </TabsTrigger>
        </TabsList>
       </Tabs>
      </div>
     </div>
    </aside>
   )}
   {!isPin && isOpen && (
    <div
     className='absolute z-1 inset-0 bg-black/40'
     onClick={() => toggle(false)}
    ></div>
   )}
  </>
 );
}
