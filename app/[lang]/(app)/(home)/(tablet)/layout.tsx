import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
import UserInfoRouterProvider from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterProvider';
export default function TableLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <>
   <AxiosCredentials />
   <UserInfoRouterProvider>
    {/* <DepartmentRouter /> */}
    {children}
   </UserInfoRouterProvider>
  </>
 );
}
