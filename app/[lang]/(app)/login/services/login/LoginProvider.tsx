'use client';
import { type Login, loginContext } from './loginContext';
import LoginModal from '../../components/login-dialog/LoginModal';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';

export default function LoginProvider({ children }: { children: ReactNode }) {
 const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
 //  const [justLoggedIn, setJustLoggedIn] = useState(false);
 function handleChangeLoginModalIsOpen(open?: boolean) {
  setLoginModalIsOpen((pre) => (open === undefined ? !pre : open));
 }

 const ctx: Login = {
  loginModalIsOpen,
  changeLoginModalIsOpen: handleChangeLoginModalIsOpen,
  // justLoggedIn,
  // setJustLoggedIn,
 };

 return (
  <loginContext.Provider value={ctx}>
   {children}
   <Dialog
    open={loginModalIsOpen}
    onOpenChange={(newValue) => setLoginModalIsOpen(newValue)}
   >
    <DialogContent className='gap-0 p-0 max-h-[90svh] overflow-hidden flex flex-col'>
     <DialogHeader className='p-4'></DialogHeader>
     <div className='p-4 overflow-auto'>
      <LoginModal />
     </div>
    </DialogContent>
   </Dialog>
  </loginContext.Provider>
 );
}
