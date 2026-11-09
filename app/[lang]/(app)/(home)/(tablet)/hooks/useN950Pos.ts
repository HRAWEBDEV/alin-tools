import { useEffect, useState, useCallback } from 'react';

const SOCKET_ADDRESS = 'ws://127.0.0.1:1372/';
const APP_ID = '1';

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

interface InvoiceDetail {
 sumUnitPrice: number; // total price of this item
 name: string; // item name
 qty: number; // item quantity
 toz: string; // item description
}

interface InvoiceModel {
 num: number; // invoice number
 price: number; // payable amount
 sumQty: number; // total item count
 sumPrice: number; // total of all items
 discountAmount: number;
 serviceAmount: number;
 taxAmount: number;
 phoneNumber: string;
 description: string;
 tableName: string;
 customerName: string;
 waiterName: string;
 guestQty: number;
 creationTime: string;
 farsiDate: string;
 creditPrice: number;
 restaurantName: string;
 roundedAmount: number;
 invoices: InvoiceModel | null; // nested invoice, unused in the docs
 invoiceDetails: InvoiceDetail[];
}

type Operations =
 'checkConnection' | 'printInvoice' | 'purchase' | 'reverseTransaction';

export function useN950Pos() {
 const [socket, setSocket] = useState<WebSocket | null>(null);
 const [status, setStatus] = useState<ConnectionStatus>('connecting');
 const [lastOperation, setLastOperation] = useState<Operations | ''>('');
 const [posResponse, setPosResponse] = useState<PosResponse | null>(null);

 const connect = useCallback(() => {
  const socket = new WebSocket(SOCKET_ADDRESS);
  setStatus('connecting');
  setSocket(socket);
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
 }, []);

 const closeConnection = useCallback(() => {
  if (!socket) return;
  socket.close();
  setSocket(null);
 }, [socket]);

 const sendMessage = useCallback(
  (message: object) => {
   setPosResponse(null);
   if (!socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket is not open');
   }
   socket.send(JSON.stringify(message));
  },
  [socket],
 );

 const checkPosConnection = useCallback(() => {
  setLastOperation('checkConnection');
  sendMessage({
   CompanyName: 'SEP',
   RequestType: 'getMerchantInfo',
  });
 }, [sendMessage]);

 const handlePurchase = useCallback(
  ({ paymentValue }: PaymentProps) => {
   if (!paymentValue) return;
   setLastOperation('purchase');
   sendMessage({
    CompanyName: 'SEP',
    RequestType: 'Sale',
    AM: paymentValue,
    paymentType: 'CARD',
    AppID: APP_ID,
    ID: '',
    GovID: '',
    SC: '',
   });
  },
  [sendMessage],
 );

 const handlePrintInvoice = useCallback(
  ({ invoice }: { invoice: InvoiceModel }) => {
   setLastOperation('printInvoice');
   sendMessage({
    CompanyName: 'SEP',
    RequestType: 'receiptBitMap',
    AppID: APP_ID,
    invoice,
   });
  },
  [sendMessage],
 );

 const handleReverseTransaction = useCallback(
  ({ refNum }: { refNum: string }) => {
   setLastOperation('reverseTransaction');
   sendMessage({
    CompanyName: 'SEP',
    RequestType: 'ReverseTransaction',
    RefNum: refNum,
    AppID: APP_ID,
   });
  },
  [sendMessage],
 );

 useEffect(() => {
  connect();
 }, [connect]);

 useEffect(() => {
  return closeConnection;
 }, [closeConnection]);

 return {
  status,
  posResponse,
  lastOperation,
  connect,
  closeConnection,
  checkPosConnection,
  handlePurchase,
  handlePrintInvoice,
  handleReverseTransaction,
 };
}

export type { PosResponse, Operations, InvoiceDetail, InvoiceModel };
