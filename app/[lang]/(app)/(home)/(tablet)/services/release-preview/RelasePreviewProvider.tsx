'use client';
import { ReactNode, useState } from 'react';
import {
 type ReleasePreview,
 releasePreviewContext,
} from './releasePreviewContext';
import {
 Drawer,
 DrawerContent,
 DrawerClose,
 DrawerHeader,
 DrawerTitle,
 DrawerDescription,
} from '@/components/ui/drawer';
import { useShareDictionary } from '@/app/[lang]/(app)/services/share-dictionary/shareDictionaryContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

export default function ReleasePreviewProvider({
 children,
 departmentName,
 versions = [],
}: {
 children: ReactNode;
 departmentName: string;
 versions?: string[];
}) {
 const [markdown, setMarkdown] = useState('');
 const { localeInfo, locale } = useBaseConfig();
 const {
  shareDictionary: {
   components: { releases: dic },
  },
 } = useShareDictionary();
 const basePath = `/releases/${departmentName}/${locale}`;
 const [isOpen, setIsOpen] = useState(false);

 function handleToggle(state?: boolean) {
  setIsOpen((pre) => (state === undefined ? !pre : state));
 }

 const ctx: ReleasePreview = {
  isOpen,
  onToggle: handleToggle,
 };

 return (
  <releasePreviewContext.Provider value={ctx}>
   {children}
   <Drawer
    open={isOpen}
    onOpenChange={handleToggle}
    direction={localeInfo.contentDirection === 'rtl' ? 'right' : 'left'}
   >
    <DrawerContent>
     <DrawerHeader className='border-b border-border'>
      <DrawerTitle className='text-start'>{dic.title}</DrawerTitle>
      <DrawerDescription className='hidden'>{dic.title}</DrawerDescription>
     </DrawerHeader>
     <div className='p-4 grow overflow-auto'>
      {versions.length === 0 ? (
       <div>
        <NoItemFound />
       </div>
      ) : (
       <article className='prose'>
        <ReactMarkdown>{markdown}</ReactMarkdown>
       </article>
      )}
     </div>
    </DrawerContent>
   </Drawer>
  </releasePreviewContext.Provider>
 );
}
