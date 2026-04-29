import { createContext, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type UserAccessibility } from './services/userAccessibilityApiActions';

interface UserAccessibilityContext {
 userAccessibility: UserAccessibility;
}

const userAccessibilityContext = createContext<UserAccessibilityContext | null>(
 null,
);

function useUserAccessibilityContext() {
 const ctx = use(userAccessibilityContext);
 if (!ctx) throw new OutOfContext('userAccessibilityContext');
 return ctx;
}

export type { UserAccessibilityContext };
export { userAccessibilityContext, useUserAccessibilityContext };
