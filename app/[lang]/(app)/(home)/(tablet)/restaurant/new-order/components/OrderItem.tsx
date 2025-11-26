export default function OrderItem() {
 return (
  <div className='flex flex-col h-60 pt-17'>
   <div className='grow rounded-xl shadow-xl'>
    <div className='grid place-content-center -mt-17 mb-2'>
     <div className='rounded-full size-34 border border-input bg-background overflow-hidden'>
      <img
       alt='food image'
       src='/images/faseenjoon.jpg'
       className='object-center object-cover w-full h-full'
      />
     </div>
    </div>
    <div className='text-center'>
     <h3 className='font-medium text-neutral-700 dark:text-neutral-300'>
      خورشت فسنجان
     </h3>
    </div>
   </div>
  </div>
 );
}
