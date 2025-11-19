import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
 return <main className='grow p-4 sm:p-8 overflow-auto'>{children}</main>;
}
