import { type Locale } from '@/internalization/app/localization';
import IranFlag from '@/components/icons/flags/IranFlag';
import EnglandFlag from '@/components/icons/flags/EnglandFlag';
import { SVGProps } from 'react';

export function getLocaleIcon(locale: Locale, props?: SVGProps<SVGSVGElement>) {
 switch (locale) {
  case 'en':
   return <EnglandFlag {...props} />;
 }
 return <IranFlag {...props} />;
}
