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

export interface InvoiceDetail {
 sumUnitPrice: number; // total price of this item
 name: string; // item name
 qty: number; // item quantity
 toz: string; // item description
}

export interface InvoiceModel {
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

export function useN950Pos() {
 const [socket, setSocket] = useState<WebSocket | null>(null);
 const [status, setStatus] = useState<ConnectionStatus>('connecting');
 const [lastOperation, setLastOperation] = useState<
  'checkConnection' | 'printInvoice' | 'purchase' | ''
 >('');
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
    ID: '',
    GovID: '',
    SC: '',
   });
  },
  [sendMessage],
 );

 const handlePrintInvoice = useCallback(() => {
  setLastOperation('printInvoice');
  sendMessage({
   CompanyName: 'SEP',
   RequestType: 'receiptBitMap',
   invoice: {
    num: 1,
    price: 11000,
    sumQty: 2,
    sumPrice: 10000,
    discountAmount: 0,
    serviceAmount: 1000,
    taxAmount: 0,
    phoneNumber: '09120000000',
    description: 'Test invoice',
    tableName: 'Table 1',
    customerName: 'Test Customer',
    waiterName: 'Test Waiter',
    guestQty: 2,
    creationTime: '12:30:00',
    farsiDate: '1405/08/16',
    creditPrice: 0,
    restaurantName: 'Test Restaurant',
    roundedAmount: 0,
    invoices: null,
    invoiceDetails: [
     { name: 'Item A', qty: 1, sumUnitPrice: 4000, toz: '' },
     { name: 'Item B', qty: 1, sumUnitPrice: 6000, toz: 'no sugar' },
    ],
   },
  });
 }, [sendMessage]);

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
 };
}
