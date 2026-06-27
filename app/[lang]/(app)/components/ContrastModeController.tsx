'use client';
import { Button } from '@/components/ui/button';
import { useShareDictionary } from '../services/share-dictionary/shareDictionaryContext';
import { IoContrast } from 'react-icons/io5';
import { TbContrastOff } from 'react-icons/tb';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 Tooltip,
 TooltipTrigger,
 TooltipContent,
} from '@/components/ui/tooltip';

function ContrastModeController() {
 const {
  shareDictionary: {
   components: { contractMode: contractModeDic },
  },
 } = useShareDictionary();
 const { contrastMode, onContrastModeChange } = useBaseConfig();

 return (
  <Tooltip>
   <TooltipTrigger asChild>
    <Button
     type='button'
     variant='outline'
     size='icon-lg'
     className='rounded-full size-11 bg-transparent text-neutral-600 dark:text-neutral-400'
     onClick={() => onContrastModeChange(!contrastMode)}
    >
     {contrastMode ? (
      <IoContrast className='size-6' />
     ) : (
      <TbContrastOff className='size-6' />
     )}
    </Button>
   </TooltipTrigger>
   <TooltipContent>
    <p>
     {contractModeDic.title}:{' '}
     {contrastMode ? contractModeDic.on : contractModeDic.off}
    </p>
   </TooltipContent>
  </Tooltip>
 );
}

export { ContrastModeController };
