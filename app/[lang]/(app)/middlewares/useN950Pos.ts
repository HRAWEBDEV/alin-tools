import { useEffect, useRef, useState, useCallback } from 'react';

const SOCKET_ADDRESS = 'ws://127.0.0.1:1372/';

type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'disconnected';

interface PosResponse {
 compName: string;
 trxType: string;
 // response code can be 00 (success) or 01 (not success)
 responseCode: string;
 cardNumber: string;
 RN: unknown;
 referenceNumber: string;
 terminalNumber: string;
 dateTime: string;
 amount: string;
 printStatus: string;
 checkPaper: string;
 getInfo: string;
 timeOut: string;
 barcode: string;
 MI: string;
 tranactionSuccessful: string;
 transactionFailed: string;
 error: string;
 SC: unknown;
 RC: unknown;
 notSentAdviceRefNum: string;
}

interface PaymentProps {
 paymentValue: string;
}

export function useN950Pos() {
 const socketRef = useRef<WebSocket | null>(null);
 const [status, setStatus] = useState<ConnectionStatus>('connecting');
 const [posResponse, setPosResponse] = useState<PosResponse | null>(null);

 const sendMessage = useCallback((message: object) => {
  const socket = socketRef.current;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
   throw new Error('WebSocket is not open');
  }
  socket.send(JSON.stringify(message));
 }, []);

 const checkPosConnection = useCallback(() => {
  sendMessage({
   CompanyName: 'SEP',
   RequestType: 'getMerchantInfo',
  });
 }, [sendMessage]);

 const handlePurchase = useCallback(
  ({ paymentValue }: PaymentProps) => {
   if (!paymentValue) return;
   sendMessage({
    CompanyName: 'SEP',
    RequestType: 'Sale',
    AM: paymentValue,
    paymentType: 'CARD',
    ID: '',
    GovID: '',
    SC: '',
   });
  },
  [sendMessage],
 );

 useEffect(() => {
  const socket = new WebSocket(SOCKET_ADDRESS);
  socketRef.current = socket;

  socket.onopen = () => {
   setStatus('connected');
  };

  socket.onmessage = (e) => {
   const message = e.data;
   try {
    setPosResponse(JSON.parse(message) as PosResponse);
   } catch {
    setPosResponse(null);
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

 return {
  status,
  posResponse,
  checkPosConnection,
  handlePurchase,
 };
}
