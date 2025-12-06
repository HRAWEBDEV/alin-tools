export default function LinearLoading() {
 return (
  <div className='relative h-1 bg-primary overflow-hidden'>
   <div className='absolute -top-px left-0 h-[6px] w-1/2 bg-background animate-slide-3s'></div>
   <div className='absolute -top-px left-0 h-[6px] w-1/4 bg-b animate-slide-2s'></div>
  </div>
 );
}
