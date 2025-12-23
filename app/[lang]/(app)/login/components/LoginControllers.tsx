import { LocaleControllerButton } from '../../components/LocaleController';
import { ModeControllerButton } from '../../components/ModeContoller';
import BackToLoginController from './BackToLoginController';

export default function LoginControllers() {
 return (
  <div className='flex gap-4 justify-between'>
   <div className='flex gap-4'>
    <LocaleControllerButton />
    <ModeControllerButton />
   </div>
   <BackToLoginController />
  </div>
 );
}
