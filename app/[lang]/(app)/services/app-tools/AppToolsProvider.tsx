'use client';
import { ReactNode, useState } from 'react';
import {
 type Tool,
 type AppTools,
 type ToolAction,
 tools,
 appToolsContext,
} from './appToolsContext';

export default function AppToolsProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [toolsState, setToolsState] = useState<(Tool & { show: boolean })[]>(
  tools.map((item) => ({ ...item, show: false })),
 );
 const handleToolAction: ToolAction = ({ show, tool }) => {
  setToolsState((pre) => {
   return pre.map((item) => {
    if (item.type === tool.type) {
     const newShowValue = show === undefined ? !item.show : show;
     return {
      ...item,
      show: newShowValue,
     };
    }
    return item;
   });
  });
 };

 const ctx: AppTools = {
  tools,
  toolAction: handleToolAction,
 };
 return (
  <appToolsContext.Provider value={ctx}>{children}</appToolsContext.Provider>
 );
}
