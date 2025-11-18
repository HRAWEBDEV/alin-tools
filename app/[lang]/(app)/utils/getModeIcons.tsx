import { SVGProps } from 'react';
import { FaSun } from 'react-icons/fa';
import { FaCloudMoon } from 'react-icons/fa';
import { GrSystem } from 'react-icons/gr';
import { type AppModes } from '@/theme/appModes';

export function getModeIcon(mode?: AppModes, props?: SVGProps<SVGSVGElement>) {
 switch (mode) {
  case 'light':
   return <FaSun {...props} />;
  case 'dark':
   return <FaCloudMoon {...props} />;
 }
 return <GrSystem {...props} />;
}
