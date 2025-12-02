import AxiosCredentials from './services/axios-credentials/AxiosCredentials';
export default function TableLayout({ children }: LayoutProps<'/[lang]'>) {
 return (
  <>
   <AxiosCredentials />
   {children}
  </>
 );
}
