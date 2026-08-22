import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';
import { ProfileButton } from '@/app/[lang]/(app)/components/ProfileButton';
import { ContrastModeController } from '@/app/[lang]/(app)/components/ContrastModeController';
import { NotificationsController } from './NotificationsController';

export default function Tools({ flexReverse }: { flexReverse?: boolean }) {
 return (
  <div className={`flex gap-3 ${flexReverse ? 'flex-row-reverse' : ''}`}>
   <ProfileButton />
   <NotificationsController />
   <LocaleControllerButton />
   <ModeControllerButton />
   <ContrastModeController />
  </div>
 );
}
