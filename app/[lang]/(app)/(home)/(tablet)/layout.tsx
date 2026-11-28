import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
import AxiosApiPackage from './services/axios-api-package/AxiosApiPackage';
import UserInfoRouterProvider from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterProvider';
import UserAccessibilityProvider from '../../login/services/user-accessibility/UserAccessibilityProvider';
import LoginInterceptor from '../../login/services/LoginInterceptor';
import AuthBroadcastProvider from '../../login/services/auth-broadcast/AuthBroadcastProvider';

export default function TableLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <AuthBroadcastProvider>
   <AxiosCredentials />
   <UserInfoRouterProvider>
    <AxiosApiPackage />
    <LoginInterceptor />
    <UserAccessibilityProvider>{children}</UserAccessibilityProvider>
   </UserInfoRouterProvider>
  </AuthBroadcastProvider>
 );
}
