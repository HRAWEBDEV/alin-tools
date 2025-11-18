import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

const tools = [
 {
  type: 'marked-pages',
  label: 'marked-pages',
 },
] as const;

type Tool = (typeof tools)[number];

type ToolAction = (params: { show?: boolean; tool: Tool }) => unknown;
type AppTools = {
 tools: Readonly<Tool[]>;
 toolAction: ToolAction;
};

const appToolsContext = createContext<null | AppTools>(null);

function useAppToolsContext(): AppTools {
 const val = use(appToolsContext);
 if (!val) throw new OutOfContext('appToolsContext');
 return val;
}

export type { AppTools, Tool, ToolAction };
export { tools, appToolsContext, useAppToolsContext };
