const STORAGE_KEY = 'orderConfig';

interface OrderConfig {
 getInitInfo: (typeof getInitInfoOptions)[number];
}

const getInitInfoOptions = ['active', 'inactive'] as const;

const defaultStorageOrderConfig: OrderConfig = {
 getInitInfo: 'active',
};

function getStorageOrderConfig(): OrderConfig {
 const val = localStorage.getItem(STORAGE_KEY);
 return val ? JSON.parse(val) : defaultStorageOrderConfig;
}

function setStorageOrderConfig(newConfig: OrderConfig) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
}

export type { OrderConfig };
export {
 getInitInfoOptions,
 defaultStorageOrderConfig,
 getStorageOrderConfig,
 setStorageOrderConfig,
};
