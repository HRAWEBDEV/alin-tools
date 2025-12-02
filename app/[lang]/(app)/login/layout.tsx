import LoginLayoutWrapper from './components/LoginLayoutWrapper';
import LoginPageWrapper from './components/LoginPageWrapper';

export default function LoginLayout({
 children,
}: LayoutProps<'/[lang]/login'>) {
 return (
  <LoginLayoutWrapper>
   <LoginPageWrapper>{children}</LoginPageWrapper>
  </LoginLayoutWrapper>
 );
}
