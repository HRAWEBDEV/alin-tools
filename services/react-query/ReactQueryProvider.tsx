'use client';
import { DEVELOPMENT } from '@/utils/env';
import {
 isServer,
 QueryClient,
 QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren } from 'react';

let browserClient: null | QueryClient = null;

function createQueryClient(): QueryClient {
 return new QueryClient({
  defaultOptions: {
   queries: {
    retry: process.env.NEXT_PUBLIC_MODE === DEVELOPMENT ? 0 : 3,
    staleTime() {
     return 5 * 60 * 1000; // 5 min
    },
   },
  },
 });
}

function getQueryClient(): QueryClient {
 if (isServer) {
  return createQueryClient();
 } else {
  if (!browserClient) browserClient = createQueryClient();
  return browserClient;
 }
}

export default function ReactQueryProvider({ children }: PropsWithChildren) {
 const queryClient = getQueryClient();
 return (
  <QueryClientProvider client={queryClient}>
   {children}
   <ReactQueryDevtools />
  </QueryClientProvider>
 );
}
