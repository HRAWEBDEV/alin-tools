import { LocaleControllerButton } from '../../components/LocaleController';
import { ModeControllerButton } from '../../components/ModeContoller';

export default function LoginControllers() {
 return (
  <div className='flex gap-4'>
   <LocaleControllerButton />
   <ModeControllerButton />
  </div>
 );
}
