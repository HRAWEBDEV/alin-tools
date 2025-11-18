import { SVGProps } from 'react';
import { type Tool } from '../services/app-tools/appToolsContext';
import { RiBookMarkedFill } from 'react-icons/ri';

export function getToolIcons(
 toolType: Tool['type'],
 props?: SVGProps<SVGSVGElement>,
) {
 switch (toolType) {
  case 'marked-pages':
   return <RiBookMarkedFill {...props} />;
 }
 return null;
}
