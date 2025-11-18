import { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
 return {
  name: 'نرم افزار یکپارچه هتل داری آلین',
  short_name: 'نرم افزار آلین',
  description: 'نرم افزار یکپارچه هتل داری',
  start_url: '/',
  display: 'standalone',
  background_color: '#fff',
  theme_color: '#0284c7',
  scope: '.',
  icons: [
   {
    purpose: 'maskable',
    sizes: '512x512',
    src: 'app-images/icon512_maskable.png',
    type: 'image/png',
   },
   {
    purpose: 'any',
    sizes: '512x512',
    src: 'app-images/icon512_rounded.png',
    type: 'image/png',
   },
  ],
 };
};

export default manifest;
