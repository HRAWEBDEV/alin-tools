'use client';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import LoginControllers from './LoginControllers';
import LoginLogo from './LoginLogo';
import { useLoginContext } from '../services/login/loginContext';

export default function LoginPageWrapper({
 children,
}: {
 children: ReactNode;
}) {
 const { loginModalIsOpen } = useLoginContext();
 return (
  <div className='text-foreground dark:text-foreground h-full w-full flex flex-col z-1'>
   <motion.div
    data-login-modal={!loginModalIsOpen}
    initial={{ opacity: 0.0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
     delay: 0.3,
     duration: 0.8,
     ease: 'easeInOut',
    }}
    className='p-4 pb-10 glass-card h-full sm:h-auto bg-white/30 dark:bg-black/30 w-full sm:w-[min(100%,28rem)] m-auto data-[login-modal="true"]:border data-[login-modal="true"]:border-input sm:rounded-lg sm:data-[login-modal="true"]:shadow-lg'
   >
    {!loginModalIsOpen && <LoginControllers />}
    <div className='w-[min(100%,24rem)] mx-auto'>
     <LoginLogo />
     {children}
    </div>
   </motion.div>
  </div>
 );
}
