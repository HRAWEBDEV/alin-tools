type AuthBroadcastMessageType = 'login' | 'logout';

interface AuthBroadcastMessage {
 type: AuthBroadcastMessageType;
}

const authBroadcastChannelName = 'app-auth';

let authBroadcastChannel: BroadcastChannel | null = null;

function getAuthBroadcastChannel(): BroadcastChannel | null {
 if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
  return null;
 }
 if (!authBroadcastChannel) {
  authBroadcastChannel = new BroadcastChannel(authBroadcastChannelName);
 }
 return authBroadcastChannel;
}

function publishAuthMessage(message: AuthBroadcastMessage): void {
 const broadcastChannel = getAuthBroadcastChannel();
 if (!broadcastChannel) return;
 try {
  broadcastChannel.postMessage(message);
 } catch (error) {
  console.error('auth broadcast publish failed:', error);
 }
}

function subscribeAuthBroadcast(
 handler: (message: AuthBroadcastMessage) => void,
): () => void {
 const broadcastChannel = getAuthBroadcastChannel();
 if (!broadcastChannel) return () => {};
 const listener = (event: MessageEvent<AuthBroadcastMessage>) => {
  if (
   event.data &&
   (event.data.type === 'login' || event.data.type === 'logout')
  ) {
   handler(event.data);
  }
 };
 broadcastChannel.addEventListener('message', listener);
 return () => {
  broadcastChannel.removeEventListener('message', listener);
 };
}

export type { AuthBroadcastMessage };
export { publishAuthMessage, subscribeAuthBroadcast };
