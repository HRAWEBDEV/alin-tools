import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';
import { ProfileButton } from '@/app/[lang]/(app)/components/ProfileButton';

export default function Tools({ flexReverse }: { flexReverse?: boolean }) {
 return (
  <div className={`flex gap-3 ${flexReverse ? 'flex-row-reverse' : ''}`}>
   <ProfileButton />
   <LocaleControllerButton />
   <ModeControllerButton />
  </div>
 );
}
