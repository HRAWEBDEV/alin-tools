import React, { ReactNode, useState } from 'react';
import { SettingsContext, type Settings } from './settingsContext';
export default function SettingsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [isOpen, setIsOpen] = useState(false);
 const [activeView, setActiveView] = useState(null);

 const ctx: Settings = {
  isOpen,
  activeView,
 };
 return (
  <SettingsContext.Provider value={ctx}>{children}</SettingsContext.Provider>
 );
}
