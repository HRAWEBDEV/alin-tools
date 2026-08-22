'use client';
import {
 ReactNode,
 useState,
 useEffect,
 useMemo,
 useCallback,
 useRef,
} from 'react';
import {
 type ReleasePreview,
 releasePreviewContext,
} from './releasePreviewContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerDescription,
} from '@/components/ui/drawer';
import { useShareDictionary } from '@/app/[lang]/(app)/services/share-dictionary/shareDictionaryContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { Button } from '@/components/ui/button';

export default function ReleasePreviewProvider({
 children,
 departmentName,
 versions = [],
}: {
 children: ReactNode;
 departmentName: string;
 versions?: string[];
}) {
 const firstloadRef = useRef(true);
 const [loadedLogsCount, setLoadedLogsCount] = useState(0);
 const [markdowns, setMarkdowns] = useState<string[]>([]);
 const { localeInfo, locale } = useBaseConfig();
 const {
  shareDictionary: {
   components: { releases: dic },
  },
 } = useShareDictionary();
 const basePath = useMemo(
  () => `/releases/${locale}/${departmentName}`,
  [locale, departmentName],
 );
 const [isOpen, setIsOpen] = useState(false);

 function handleToggle(state?: boolean) {
  setIsOpen((pre) => (state === undefined ? !pre : state));
 }

 const ctx: ReleasePreview = {
  isOpen,
  onToggle: handleToggle,
  newVersion: !!markdowns.length,
 };

 const showLog = useCallback(
  async (version: string) => {
   axios
    .get(`${basePath}/${version}.md`)
    .then((res) => {
     setMarkdowns((pre) => [...pre, res.data]);
    })
    .catch(() => {
     setMarkdowns((pre) => [...pre, '']);
    })
    .finally(() => {
     setLoadedLogsCount((pre) => pre + 1);
    });
  },
  [basePath],
 );

 useEffect(() => {
  if (versions.length === 0) return;
  if (firstloadRef.current) {
   versions.slice(0, 2).forEach((version) => {
    if (!version) return;
    showLog(version);
   });
   firstloadRef.current = false;
  }
 }, [versions, showLog]);

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
      {markdowns.length === 0 ? (
       <div>
        <NoItemFound />
       </div>
      ) : (
       <>
        {markdowns.map((markdown, index) => (
         <article className='prose mb-6' key={index}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
         </article>
        ))}
       </>
      )}
      {loadedLogsCount < versions.length && (
       <Button onClick={() => showLog(versions[loadedLogsCount])}>
        {dic.loadMore}
       </Button>
      )}
     </div>
    </DrawerContent>
   </Drawer>
  </releasePreviewContext.Provider>
 );
}
