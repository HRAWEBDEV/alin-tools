'use client';
import DinnerIcon from '@/app/[lang]/(app)/components/icons/DinnerIcon';
import DishIcon from '@/app/[lang]/(app)/components/icons/DishIcon';
import { Button } from '@/components/ui/button';
import { useRestaurantShareDictionary } from '../services/share-dictionary/restaurantShareDictionaryContext';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { usePathname } from 'next/navigation';
import { MdDoneAll } from 'react-icons/md';
import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';

export default function NavList() {
 const { routeDepartment, routeProgram } = useUserInfoRouter();
 const { locale } = useBaseConfig();
 const pathname = usePathname();
 const pathSegments = pathname.split('/');
 const activePath = pathSegments.at(-1);
 const {
  restaurantShareDictionary: {
   components: { navigation },
  },
 } = useRestaurantShareDictionary();
 return (
  <ul className='p-2 w-[min(100%,15rem)] mx-auto grid gap-2'>
   <li>
    <Button
     data-active={activePath === 'salons'}
     variant='ghost'
     className='relative w-full h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'salons'
        ? '#'
        : `/${locale}/${routeDepartment.id}/restaurant/${routeProgram.id}/salons`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <DinnerIcon className='size-12' />
      <p className='text-base'>{navigation.salons}</p>
     </Link>
    </Button>
   </li>
   <li>
    <Button
     data-active={activePath === 'new-order'}
     variant='ghost'
     className='w-full h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
     asChild
    >
     <Link
      href={
       activePath === 'new-order'
        ? '#'
        : `/${locale}/${routeDepartment.id}/restaurant/${routeProgram.id}/new-order`
      }
      className='flex w-auto h-auto items-center gap-4'
     >
      <DishIcon className='size-12' />
      <p className='text-base'>{navigation.newOrder}</p>
     </Link>
    </Button>
   </li>
   {routeProgram.systemTypeID === 5 && (
    <li className='mt-4'>
     <Button
      data-active={activePath === 'breakfast-control'}
      className='w-full min-h-16 h-auto justify-start data-[active="true"]:bg-background border border-transparent data-[active="true"]:text-primary data-[active="true"]:border-primary'
      asChild
     >
      <Link
       href={
        activePath === 'breakfast-control'
         ? '#'
         : `/${locale}/${routeDepartment.id}/restaurant/${routeProgram.id}/breakfast-control`
       }
       className='flex w-auto h-auto items-center gap-4'
      >
       <MdDoneAll className='size-8' />
       <p className='text-base'>{navigation.breakfastControl}</p>
      </Link>
     </Button>
    </li>
   )}
  </ul>
 );
}
