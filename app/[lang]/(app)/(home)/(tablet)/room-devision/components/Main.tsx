import { ReactNode } from 'react';
import MainWrapperSetupProvider from '../services/main-wrapper-setup/MainWrapperSetupProvider';

export default function Main({ children }: { children: ReactNode }) {
 return <MainWrapperSetupProvider>{children}</MainWrapperSetupProvider>;
}
