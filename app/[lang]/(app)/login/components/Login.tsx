import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import LoginOptions from './LoginOptions';
import LoginWithPassword from './LoginWithPassword';

export default function Login({ dic }: { dic: LoginDictionary }) {
 return (
  <div>
   <LoginWithPassword dic={dic} />
   {/* <LoginOptions dic={dic} /> */}
  </div>
 );
}
