type AppModes = (typeof appModes)[number];
const LIGHT = 'light';
const DARK = 'dark';
const SYSTEM = 'system';
const appModes = [LIGHT, DARK, SYSTEM] as const;

export type { AppModes };
export { LIGHT, DARK, SYSTEM, appModes };
