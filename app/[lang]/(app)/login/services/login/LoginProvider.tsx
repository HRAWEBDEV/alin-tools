'use client';
import { Dispatch, ReactNode, SetStateAction, use } from 'react';
import { type Login, loginContext } from './loginContext';
import LoginModal from '../../components/login-dialog/LoginModal';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { OutOfContext } from '@/utils/OutOfContext';

function LoginProvider({
 loginModalIsOpen,
 setIsOpen,
 handleToggleModal,
 children,
}: {
 loginModalIsOpen: boolean;
 setIsOpen: Dispatch<SetStateAction<boolean>>;
 handleToggleModal: (open?: boolean) => void;
 children: ReactNode;
}) {
 const ctx: Login = {
  loginModalIsOpen,
  changeLoginModalIsOpen: handleToggleModal,
 };

 return (
  <loginContext.Provider value={ctx}>
   {children}

   <Dialog
    open={loginModalIsOpen}
    onOpenChange={(newValue) => setIsOpen(newValue)}
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

function useLogin() {
 const context = use(loginContext);
 if (!context) throw new OutOfContext('LoginContext');
 return context;
}

export { LoginProvider, useLogin };
