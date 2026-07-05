'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NotFound from '../components/NotFound';

export default function NotFoundPage() {
 const { lang } = useParams();
 const router = useRouter();

 useEffect(() => {
  router.push(`/${lang}`);
 }, [lang, router]);
 return (
  <div>
   <NotFound />
  </div>
 );
}
