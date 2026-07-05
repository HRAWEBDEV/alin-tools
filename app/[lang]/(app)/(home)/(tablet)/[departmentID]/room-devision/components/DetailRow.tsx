import { ReactNode } from 'react';

export default function DetailRow({
 label,
 value,
 wrapperClassName = '',
 valueClassName = '',
 children,
}: {
 label: string;
 value: string | number | null | undefined;
 wrapperClassName?: string;
 valueClassName?: string;
 children?: ReactNode;
}) {
 return (
  <div
   className={`flex items-center text-start gap-2 justify-between w-full ${wrapperClassName}`}
  >
   <span className='text-muted-foreground whitespace-nowrap'>{label}:</span>
   <span className={`font-normal text-end sm:text-start ${valueClassName}`}>
    {value ?? children}
   </span>
  </div>
 );
}
