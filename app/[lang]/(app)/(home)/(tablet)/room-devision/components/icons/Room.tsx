'use client';
import { SVGProps } from 'react';

export function Room(props: SVGProps<SVGSVGElement>) {
 return (
  <svg
   version='1.1'
   xmlns='http://www.w3.org/2000/svg'
   xmlnsXlink='http://www.w3.org/1999/xlink'
   x='0px'
   y='0px'
   width='32px'
   height='32px'
   viewBox='0 0 32 32'
   enableBackground='new 0 0 32 32'
   xmlSpace='preserve'
   fill='currentColor'
   {...props}
  >
   <g id='Layer_1'></g>
   <g id='Guides__x26__Labels'></g>
   <g id='Forms'></g>
   <g id='Icons'>
    <g>
     <path d='M16,5L4,11v2h24v-2L16,5z M16,11c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2C18,10.105,17.105,11,16,11z' />
     <rect x='6' y='15' width='4' height='8' />
     <rect x='14' y='15' width='4' height='8' />
     <rect x='22' y='15' width='4' height='8' />
     <rect x='4' y='25' width='24' height='2' />
    </g>
   </g>
  </svg>
 );
}
