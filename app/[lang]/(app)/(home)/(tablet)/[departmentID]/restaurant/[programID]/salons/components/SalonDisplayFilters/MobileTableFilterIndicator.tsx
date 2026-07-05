export default function MobileTableFilterIndicator({ num }: { num: number }) {
 return num > 0 ? (
  <div className='size-4 bg-primary/90 text-gray-200 rounded-full flex items-center justify-center text-xs absolute -left-px -top-px'>
   {num}
  </div>
 ) : null;
}
