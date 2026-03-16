'use client';
import { SVGProps } from 'react';

export function Checkin(props: SVGProps<SVGSVGElement>) {
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
   <g id='Icons'>
    <path
     d='M26,4H6C4.35,4,3,5.35,3,7v18c0,1.657,1.343,3,3,3h20c1.657,0,3-1.343,3-3V7C29,5.35,27.65,4,26,4z M14,7h2v2h-2V7z M10,7
		h2v2h-2V7z M6,7h2v2H6V7z M26,25H6V11h20V25z'
    />
    <polygon points='12.414,13.636 14.95,16.172 14.95,12 16.95,12 16.95,16.172 19.485,13.636 20.899,15.05 15.95,20 11,15.05 	' />
    <rect x='11' y='21' width='10' height='2' />
   </g>
  </svg>
 );
}
