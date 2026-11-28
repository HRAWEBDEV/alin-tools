'use client';
import { Fragment, useEffect, useEffectEvent, useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import {
 type AuthBroadcastMessage,
 subscribeAuthBroadcast,
} from './authBroadcast';

export default function AuthBroadcastProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 const [authEpoch, setAuthEpoch] = useState(0);
 const logout = useLogout({ broadcast: false });

 const onAuthMessage = useEffectEvent((message: AuthBroadcastMessage) => {
  if (message.type === 'login') {
   setAuthEpoch((epoch) => epoch + 1);
   return;
  }
  logout();
 });

 useEffect(() => {
  const unsubscribe = subscribeAuthBroadcast(onAuthMessage);
  return unsubscribe;
 }, []);

 return <Fragment key={authEpoch}>{children}</Fragment>;
}
