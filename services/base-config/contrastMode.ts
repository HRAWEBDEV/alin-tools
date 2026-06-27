const STORAGE_KEY = 'contrast-mode';

function getLocaleContrastMode(): boolean {
 const val = localStorage.getItem(STORAGE_KEY);
 return val ? JSON.parse(val) === 'on' : true;
}

function setLocaleContrastMode(state: boolean) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state ? 'on' : 'off'));
}

export { getLocaleContrastMode, setLocaleContrastMode };
