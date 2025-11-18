'use client';

export default function AppError({}: {
 error: Error & { digest?: string; reset: () => void };
}) {
 return (
  <div>
   <p>application error</p>
  </div>
 );
}
