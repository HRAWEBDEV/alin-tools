import { type AppModes, appModes } from '@/theme/appModes';
import { getModeIcon } from '@/app/[lang]/(app)/utils/getModeIcons';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useShareDictionary } from '@/app/[lang]/(app)/services/share-dictionary/shareDictionaryContext';
import { useMounted } from '@/hooks/useMounted';
import { motion } from 'motion/react';
export default function AppThemeToggler() {
 const mounted = useMounted();

 const { theme, setTheme } = useTheme();

 const {
  shareDictionary: {
   system: { modes },
  },
 } = useShareDictionary();

 const modeButton = (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='rounded-full size-11 bg-transparent text-neutral-600 dark:text-neutral-400'
  >
   {getModeIcon(theme as AppModes, { className: 'size-6' })}
  </Button>
 );
 if (!mounted) return <>{modeButton}</>;

 return (
  <motion.div
   initial={{ x: -200, y: 10, opacity: 0 }}
   animate={{ x: 0, y: 0, opacity: 1 }}
   exit={{ x: -200, y: 10, opacity: 0 }}
   transition={{ duration: 0.3 }}
  >
   <ul className='py-2 px-0'>
    {appModes.map((mode) => (
     <li key={mode}>
      <Button
       variant='ghost'
       size='icon-lg'
       className='text-base p-4! w-full justify-start h-[unset] gap-4 items-center'
       onClick={() => setTheme(mode)}
      >
       {getModeIcon(mode, { className: 'size-6' })}
       <span>{modes[mode]}</span>
      </Button>
     </li>
    ))}
   </ul>
  </motion.div>
 );
}
