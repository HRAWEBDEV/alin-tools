'use client';
import { useState, ReactNode } from 'react';

export default function OrderItemImage({
 src,
 alt,
 children,
}: {
 src?: string;
 alt?: string;
 children?: ReactNode;
}) {
 const [showImage, setShowImage] = useState(true);
 return (
  <>
   {src && showImage ? (
    <img
     alt={alt || 'image'}
     src={src}
     loading='lazy'
     className='object-center object-cover w-full h-full'
     onError={() => {
      setShowImage(false);
     }}
    />
   ) : (
    <>{children}</>
   )}
  </>
 );
}
