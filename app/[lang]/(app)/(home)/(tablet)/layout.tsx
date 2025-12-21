import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
import LoginInterceptor from '../../login/services/LoginInterceptor';
export default function TableLayout({ children }: LayoutProps<'/[lang]'>) {
 return (
  <>
   <AxiosCredentials />
   <LoginInterceptor />
   {children}
  </>
 );
}
