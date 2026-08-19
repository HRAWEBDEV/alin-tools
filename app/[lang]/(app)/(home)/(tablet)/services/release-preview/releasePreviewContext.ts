import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

interface ReleasePreview {
 isOpen: boolean;
 onToggle: (state?: boolean) => void;
}

const releasePreviewContext = createContext<ReleasePreview | null>(null);

function useReleasePreview() {
 const val = use(releasePreviewContext);
 if (!val) throw new OutOfContext('release preview context');
 return val;
}

export type { ReleasePreview };
export { releasePreviewContext, useReleasePreview };
