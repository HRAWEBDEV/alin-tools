'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function Test() {
 const ws = useRef<WebSocket | null>(null);

 const [status, setStatus] = useState<ConnectionStatus>('disconnected');
 const [message, setMessage] = useState('Hello Newland N950S');
 const [logs, setLogs] = useState<string[]>([]);

 const addLog = (value: string) => {
  setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${value}`, ...prev]);
 };

 const connect = () => {
  if (ws.current?.readyState === WebSocket.OPEN) return;

  setStatus('connecting');

  const socket = new WebSocket('ws://127.0.0.1:1372/');
  ws.current = socket;

  socket.onopen = () => {
   setStatus('connected');
   addLog('Connected to POS');
  };

  socket.onmessage = (event) => {
   addLog(`Response: ${event.data}`);
  };

  socket.onerror = (err) => {
   addLog('WebSocket connection error');
  };

  socket.onclose = () => {
   setStatus('disconnected');
   addLog('Connection closed');
  };
 };

 const disconnect = () => {
  ws.current?.close();
  ws.current = null;
  setStatus('disconnected');
 };

 const sendRequest = (payload: object) => {
  if (ws.current?.readyState !== WebSocket.OPEN) {
   addLog('Not connected');
   return;
  }

  ws.current.send(JSON.stringify(payload));
  addLog(`Sent: ${JSON.stringify(payload)}`);
 };

 const checkConnection = () => {
  sendRequest({
   CompanyName: 'SEP',
   RequestType: 'getMerchantInfo',
  });
 };

 const checkPaper = () => {
  sendRequest({
   CompanyName: 'SEP',
   RequestType: 'checkPaper',
  });
 };

 const printText = () => {
  sendRequest({
   CompanyName: 'SEP',
   RequestType: 'PrintString',
   Text: message,
   AppID: '1', // Replace with the AppID provided by Tondar Noor
  });
 };

 return (
  <div className='mx-auto w-full max-w-xl'>
   <div>
    <div>Newland POS Printer</div>
    <div>
     <Badge
      variant={
       status === 'connected'
        ? 'default'
        : status === 'connecting'
          ? 'secondary'
          : 'destructive'
      }
     >
      {status}
     </Badge>
    </div>
   </div>

   <div className='space-y-4'>
    <div className='flex gap-2'>
     <Button onClick={connect} disabled={status !== 'disconnected'}>
      Connect
     </Button>

     <Button
      variant='outline'
      onClick={disconnect}
      disabled={status === 'disconnected'}
     >
      Disconnect
     </Button>
    </div>

    <div className='flex flex-wrap gap-2'>
     <Button
      variant='secondary'
      onClick={checkConnection}
      disabled={status !== 'connected'}
     >
      Test Connection
     </Button>

     <Button
      variant='secondary'
      onClick={checkPaper}
      disabled={status !== 'connected'}
     >
      Check Paper
     </Button>
    </div>

    <div className='space-y-2'>
     <Input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder='Text to print'
     />

     <Button
      className='w-full'
      onClick={printText}
      disabled={status !== 'connected' || !message.trim()}
     >
      Print
     </Button>
    </div>

    <div className='space-y-2'>
     <div className='flex items-center justify-between'>
      <h3 className='font-medium'>Logs</h3>
      <Button size='sm' variant='ghost' onClick={() => setLogs([])}>
       Clear
      </Button>
     </div>

     <div className='h-48 overflow-y-auto rounded-md border bg-muted p-3 font-mono text-xs'>
      {logs.length === 0 ? (
       <p className='text-muted-foreground'>No logs yet</p>
      ) : (
       logs.map((log, index) => <p key={index}>{log}</p>)
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
