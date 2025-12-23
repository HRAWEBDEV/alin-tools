import { usePathname } from 'next/navigation';
export function useIsHomePage() {
 const path = usePathname();
 return path.split('/').length <= 2;
}
