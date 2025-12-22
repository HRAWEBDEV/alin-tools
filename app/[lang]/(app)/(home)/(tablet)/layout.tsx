import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
import DepartmentRouter from '@/app/[lang]/(app)/login/services/DepartmentRouter';
import DepartmentRouterProvider from '@/app/[lang]/(app)/login/services/department-router/DepartmentRouterProvider';
export default function TableLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <>
   <AxiosCredentials />
   <DepartmentRouterProvider>
    <DepartmentRouter />
   </DepartmentRouterProvider>
   {children}
  </>
 );
}
