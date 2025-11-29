'use client';
import { ReactNode } from 'react';
import { motion } from 'motion/react';

export default function LoginBox({ children }: { children: ReactNode }) {
 return (
  <motion.div
   className='m-auto sm:w-[min(100%,30rem)] relative sm:border border-input rounded-lg glass-card bg-white/30 dark:bg-black/30 text-foreground shadow-xl p-4 sm:p-8'
   initial={{ opacity: 0.0, y: 40 }}
   whileInView={{ opacity: 1, y: 0 }}
   transition={{
    delay: 0.3,
    duration: 0.8,
    ease: 'easeInOut',
   }}
  >
   {children}
  </motion.div>
 );
}
