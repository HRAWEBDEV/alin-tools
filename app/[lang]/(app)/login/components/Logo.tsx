export default function Logo() {
 return (
  <div>
   <img
    className='dark:hidden'
    alt='alin logo'
    src='/images/logo/alincloud-light.png'
   />
   <img
    className='hidden dark:block'
    alt='alin logo'
    src='/images/logo/alincloud-dark.png'
   />
  </div>
 );
}
