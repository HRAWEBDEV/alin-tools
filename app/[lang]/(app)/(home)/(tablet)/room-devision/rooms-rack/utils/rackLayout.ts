type RackLayout = (typeof rackLayoutOptions)[number];
const rackLayoutOptions = ['minimal', 'compact', 'detailed'] as const;

export type { RackLayout };
export { rackLayoutOptions };
