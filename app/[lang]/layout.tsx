import type { Metadata } from 'next';
import '../globals.css';
import ReactQueryProvider from '@/services/react-query/ReactQueryProvider';
import BaseConfigProvider from '@/services/base-config/BaseConfigProvider';
import {
 type Locale,
 localesList,
 getLocalInfo,
} from '@/internalization/app/localization';
import { getMetaDictionary } from '@/internalization/app/dictionaries/meta/dictionary';
import localFont from 'next/font/local';
import { DEVELOPMENT } from '@/utils/env';

export function generateStaticParams(): { lang: Locale }[] {
 return localesList.map((lang) => ({
  lang: lang as Locale,
 }));
}

export const generateMetadata = async (
 props: LayoutProps<'/[lang]'>,
): Promise<Metadata> => {
 const { lang } = await props.params;
 const meta = getMetaDictionary({ locale: lang as Locale });
 return meta;
};

const faSans = localFont({
 display: 'swap',
 variable: '--font-fa-sans',
 src: [
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-UltraLight.woff2',
   weight: '100',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-UltraLight.woff',
   weight: '100',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Light.woff2',
   weight: '300',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Light.woff',
   weight: '300',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum.woff2',
   weight: '400',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum.woff',
   weight: '400',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Medium.woff2',
   weight: '500',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Medium.woff',
   weight: '500',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Bold.woff2',
   weight: '700',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Bold.woff',
   weight: '700',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Black.woff2',
   weight: '900',
   style: 'normal',
  },
  {
   path: '../../public/fonts/fa/sans/IRANSansWebFaNum-Black.woff',
   weight: '900',
   style: 'normal',
  },
 ],
});

const enRoboto = localFont({
 display: 'swap',
 variable: '--font-en-roboto',
 src: [
  {
   path: '../../public/fonts/en/roboto/Roboto-VariableFont_wdth,wght.ttf',
   style: 'normal',
  },
  {
   path:
    '../../public/fonts/en/roboto/Roboto-Italic-VariableFont_wdth,wght.ttf',
   style: 'italic',
  },
 ],
});

export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
 const { lang } = await props.params;
 const { contentDirection } = getLocalInfo(lang as Locale);

 return (
  <html
   lang={lang}
   dir={contentDirection}
   className={`${faSans.variable} ${enRoboto.variable} font-en-roboto [[dir="rtl"]]:font-fa-sans bg-background text-foreground`}
   suppressHydrationWarning
  >
   <head>
    {process.env.NEXT_PUBLIC_MODE === DEVELOPMENT && (
     <script
      crossOrigin='anonymous'
      src='//unpkg.com/react-scan/dist/auto.global.js'
      async
     />
    )}
   </head>
   <body className={`antialiased flex flex-col h-svh`}>
    <ReactQueryProvider>
     <BaseConfigProvider activeLocale={lang as Locale}>
      {props.children}
     </BaseConfigProvider>
    </ReactQueryProvider>
   </body>
  </html>
 );
}
