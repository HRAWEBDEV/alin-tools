import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
import AxiosApiPackage from './services/axios-api-package/AxiosApiPackage';
import UserInfoRouterProvider from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterProvider';
import LoginInterceptor from '../../login/services/LoginInterceptor';

export default function TableLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <>
   <AxiosCredentials />
   <UserInfoRouterProvider>
    <AxiosApiPackage />
    <LoginInterceptor />
    {children}
   </UserInfoRouterProvider>
  </>
 );
}
