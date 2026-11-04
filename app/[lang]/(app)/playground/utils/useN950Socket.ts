import { useCallback, useEffect, useRef, useState } from 'react';

const SOCKET_URL = 'ws://127.0.0.1:1372/';

// طبق نمونه مستندات؛ در محیط واقعی AppID دریافتی از شرکت پرداخت را قرار بده.
const APP_ID = '1';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type PrinterResponse = {
 compName?: string;
 trxType?: string;
 responseCode?: string;
 printStatus?: unknown;
 checkPaper?: unknown;
 error?: unknown;
 [key: string]: unknown;
};

export function useN950Socket() {
 const socketRef = useRef<WebSocket | null>(null);

 const [status, setStatus] = useState<ConnectionStatus>('connecting');

 const [lastMessage, setLastMessage] = useState<
  PrinterResponse | string | null
 >(null);

 useEffect(() => {
  const socket = new WebSocket(SOCKET_URL);
  socketRef.current = socket;

  socket.onopen = () => {
   setStatus('connected');
  };

  socket.onmessage = (event) => {
   try {
    setLastMessage(JSON.parse(event.data));
   } catch {
    setLastMessage(event.data);
   }
  };

  socket.onerror = () => {
   setStatus('error');
  };

  socket.onclose = () => {
   setStatus('disconnected');
  };

  return () => {
   socket.close();
   socketRef.current = null;
  };
 }, []);

 const send = useCallback((data: object) => {
  const socket = socketRef.current;

  if (!socket || socket.readyState !== WebSocket.OPEN) {
   throw new Error('WebSocket is not connected');
  }

  socket.send(JSON.stringify(data));
 }, []);

 const printString = useCallback(
  (text: string) => {
   send({
    CompanyName: 'SEP',
    RequestType: 'PrintString',
    Text: text,
    AppID: APP_ID,
   });
  },
  [send],
 );

 const printBitmap = useCallback(
  (base64: string) => {
   send({
    CompanyName: 'SEP',
    RequestType: 'PrintBitmap',
    Bitmap: base64,
    AppID: APP_ID,
   });
  },
  [send],
 );

 const checkPaper = useCallback(() => {
  send({
   CompanyName: 'SEP',
   RequestType: 'checkPaper',
  });
 }, [send]);

 const getMerchantInfo = useCallback(() => {
  send({
   CompanyName: 'SEP',
   RequestType: 'getMerchantInfo',
  });
 }, [send]);

 return {
  status,
  lastMessage,
  printString,
  printBitmap,
  checkPaper,
  getMerchantInfo,
 };
}
