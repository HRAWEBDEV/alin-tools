'use client';
import { Button } from '@/components/ui/button';
import { useState, ReactNode, useEffect, useRef, RefObject } from 'react';
import { RiEyeLine } from 'react-icons/ri';
import { isHoverable } from '../utils/isHoverableDevice';
import { cx } from 'class-variance-authority';

export default function OrderItemImage({
 src,
 alt,
 activeID,
 id,
 onChangeID,
 overlayVisible,
 onOverlayChange,
 children,
}: {
 src?: string;
 alt?: string;
 activeID?: number | null;
 id?: number;
 overlayVisible?: number | null;
 onOverlayChange?: (id: number | null) => void;
 onChangeID?: (id: number | null) => void;
 children?: ReactNode;
}) {
 const [showImage, setShowImage] = useState(true);
 const imageRef = useRef<HTMLButtonElement>(null);

 useEffect(() => {
  if (id === undefined || overlayVisible === undefined || !onOverlayChange)
   return;
  if (id !== overlayVisible) return;
  const callbackFn = (e: Event) => {
   const target = e.target as Node;
   if (!imageRef.current?.contains(target)) {
    if (target instanceof Element && target.closest('.order-item-image-btn'))
     return;
    return onOverlayChange(null);
   }
  };
  document.addEventListener('click', callbackFn);

  return () => document.removeEventListener('click', callbackFn);
 }, [id, onOverlayChange, overlayVisible]);

 function handleToggleImageDialog() {
  if (id === undefined || !onChangeID || !onOverlayChange) return;
  const isDesktopDevice = isHoverable();
  if (isDesktopDevice) {
   return onChangeID(id);
  } else {
   if (overlayVisible === id) {
    onChangeID(id);
    onOverlayChange(null);
   } else {
    onOverlayChange(id);
   }
  }
 }
 return (
  <>
   {src && showImage ? (
    <Button
     ref={imageRef}
     variant='ghost'
     className={cx(
      'order-item-image-btn w-full h-full p-0 relative group',
      id !== undefined && onChangeID ? 'cursor-pointer' : 'cursor-default',
     )}
     onClick={handleToggleImageDialog}
    >
     <img
      alt={alt || 'image'}
      src={src}
      loading='lazy'
      className='object-center object-cover w-full h-full'
      onError={() => {
       setShowImage(false);
      }}
     />
     {id !== undefined && onChangeID && (
      <div
       className={cx(
        `rounded-full flex items-center justify-center  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 w-full h-full transition backdrop-blur-xs opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100`,
        id === overlayVisible ? 'opacity-100!' : 'opacity-0',
       )}
      >
       <RiEyeLine className='w-full text-gray-900 size-10' />
      </div>
     )}
    </Button>
   ) : (
    <>{children}</>
   )}
  </>
 );
}
