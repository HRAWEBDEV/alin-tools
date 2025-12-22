import LoadingLogo from '@/app/[lang]/(app)/components/LoadingLogo';

export default function Loading() {
 return (
  <div className='fixed inset-0 z-(--startup-loading-zindex)'>
   <div className='flex items-center justify-center h-full bg-white/50 dark:bg-black/50 p-10'>
    <LoadingLogo width='20rem' className='dark:brightness-50' />
   </div>
  </div>
 );
}
