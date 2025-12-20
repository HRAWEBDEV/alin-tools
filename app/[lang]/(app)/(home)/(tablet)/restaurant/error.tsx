'use client';
import UnExpectedError from '../../../components/UnExpectedError';
import { useEffect } from 'react';

export default function Error({
 error,
}: {
 error: Error & { digest?: string };
}) {
 useEffect(() => {
  // Log the error to an error reporting service
  console.error(error);
 }, [error]);

 return (
  <div>
   <UnExpectedError />
  </div>
 );
}
