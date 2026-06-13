import { createContext, use } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type UserAccessibility } from './services/userAccessibilityApiActions';

const devAccess: UserAccessibility = {
 restaurant: {
  order: {
   add: true,
   delete: true,
   edit: true,
   changeCustomer: true,
   changeDiscount: true,
   close: true,
   payment: true,
  },
  orderItem: {
   add: true,
   delete: true,
   edit: true,
  },
  table: {
   change: true,
   merge: true,
  },
 },
};

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
export { devAccess, userAccessibilityContext, useUserAccessibilityContext };
