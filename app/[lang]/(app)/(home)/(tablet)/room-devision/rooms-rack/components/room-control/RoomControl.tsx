import { useState, useEffect, useMemo } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type Rack } from '../../services/roomsRackApiActions';
import {
 Dialog,
 DialogClose,
 DialogTrigger,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MdTouchApp } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 roomControlSteps,
 getRoomControlStyles,
} from '../../utils/roomControl';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import {
 type RoomControlStep,
 type SaveRoomControl,
 roomControlBaseKey,
 getRoomControl,
 saveRoomControl,
 changeRoomControl,
 getRoomControlHistory,
} from '../../services/room-control/roomControlApiActions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { BiError } from 'react-icons/bi';
import { Badge } from '@/components/ui/badge';
import RoomControlHistory from './RoomControlHistory';

type RoomControlStepDetails = {
 [key in RoomControlStep]: {
  isChecked: boolean;
  date: string | null;
  fullName: string | null;
 };
};

const roomControlStepDetailDefaults: RoomControlStepDetails = {
 alert: {
  isChecked: false,
  fullName: null,
  date: null,
 },
 checkNow: {
  isChecked: false,
  fullName: null,
  date: null,
 },
 miniBar: {
  isChecked: false,
  fullName: null,
  date: null,
 },
 checkRoom: {
  isChecked: false,
  fullName: null,
  date: null,
 },
};

export default function RoomControl({
 dic,
 open,
 onChangeOpen,
 room,
 onSuccess,
}: {
 dic: RoomsRackDictionary;
 open: boolean;
 room: Rack;
 onChangeOpen: (state: boolean) => unknown;
 onSuccess: () => unknown;
}) {
 const queryClient = useQueryClient();
 const [maidComment, setMaidComment] = useState<string>('');
 const { locale } = useBaseConfig();
 const [roomControlStepDetails, setRoomControlStepDetails] =
  useState<RoomControlStepDetails>(roomControlStepDetailDefaults);

 // room control
 const {
  data: roomControl,
  isLoading: roomControlIsLoading,
  isFetching: roomControlIsFetching,
 } = useQuery({
  queryKey: [roomControlBaseKey, 'room', room.roomID.toString()],
  async queryFn({ signal }) {
   const res = await getRoomControl({
    roomID: room.roomID,
    signal,
   });
   return res.data;
  },
 });

 const {
  data: roomControlHistory,
  isFetching: roomControlHistoryIsFetching,
  isLoading: roomControlHistoryIsLoading,
  isSuccess: roomControlHistoryIsSuccess,
  isError: roomControlHistoryIsError,
 } = useQuery({
  queryKey: [roomControlBaseKey, 'room', 'history', room.roomID.toString()],
  async queryFn({ signal }) {
   const res = await getRoomControlHistory({
    roomID: room.roomID,
    signal,
   });
   return res.data;
  },
 });

 // save room control
 function handleInvalidateRoomControl() {
  queryClient.invalidateQueries({
   queryKey: [roomControlBaseKey, 'room', room.roomID.toString()],
  });
  queryClient.invalidateQueries({
   queryKey: [roomControlBaseKey, 'room', 'history', room.roomID.toString()],
  });
 }

 const { mutate: saveRoomControlMutate, isPending: saveRoomControlIsPending } =
  useMutation({
   mutationFn() {
    const saveNextStep = nextStep === 'done' ? 'checkRoom' : nextStep;
    const newRoomControl: SaveRoomControl = {
     roomControl: {
      ...(roomControl || {}),
      id: roomControl?.id || 0,
      registerID: room.registerID!,
      roomID: room.roomID!,
      maidComment: maidComment || null,
     },
     alert: false,
     checkNow: false,
     checkRoom: false,
     miniBar: false,
     [saveNextStep]: roomControlStepDetails[saveNextStep].isChecked,
    };
    return saveRoomControl(newRoomControl);
   },
   onSuccess() {
    handleInvalidateRoomControl();
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
  });
 // clear room control

 const {
  mutate: clearRoomControlMutate,
  isPending: clearRoomControlIsPending,
 } = useMutation({
  mutationFn() {
   return changeRoomControl({
    registerID: room.registerID!,
    roomID: room.roomID!,
   });
  },
  onSuccess() {
   handleInvalidateRoomControl();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 const serverRoomControlStepDetails = useMemo(() => {
  return {
   alert: {
    isChecked: !!roomControl,
    fullName: roomControl?.receptionPersonFullName || null,
    date: roomControl?.receptionDateTimeOffset || null,
   },
   checkNow: {
    isChecked: !!roomControl?.maidPersonID,
    fullName: roomControl?.maidPersonFullName || null,
    date: roomControl?.maidDateTimeOffset || null,
   },
   miniBar: {
    isChecked: !!roomControl?.minibarChecked,
    fullName: roomControl?.maidPersonFullName || null,
    date: roomControl?.minibarDateTimeOffset || null,
   },
   checkRoom: {
    isChecked: !!roomControl?.roomChecked,
    fullName: roomControl?.maidPersonFullName || null,
    date: roomControl?.roomCheckDateTimeOffset || null,
   },
  };
 }, [roomControl]);

 const nextStep = (Object.keys(serverRoomControlStepDetails).find((key) => {
  const val = serverRoomControlStepDetails[key as RoomControlStep];
  return !val.isChecked;
 }) || 'done') as RoomControlStep | 'done';

 useEffect(() => {
  setMaidComment(roomControl?.maidComment || '');
  setRoomControlStepDetails({
   alert: {
    ...serverRoomControlStepDetails['alert'],
   },
   checkNow: {
    ...serverRoomControlStepDetails['checkNow'],
   },
   miniBar: {
    ...serverRoomControlStepDetails['miniBar'],
   },
   checkRoom: {
    ...serverRoomControlStepDetails['checkRoom'],
   },
  });
 }, [roomControl, open, serverRoomControlStepDetails]);

 const pendingAction =
  roomControlIsFetching ||
  saveRoomControlIsPending ||
  clearRoomControlIsPending;

 return (
  <Dialog
   open={open}
   onOpenChange={(value) => {
    onChangeOpen(value);
    if (!value) {
     setMaidComment('');
     setRoomControlStepDetails(roomControlStepDetailDefaults);
    }
   }}
  >
   <DialogContent className='gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {dic.houseControl.title}{' '}
       <span className='font-en-roboto'>{room.roomLabel}</span>
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    {roomControlIsFetching && <LinearLoading />}
    <div className='p-4 grow overflow-auto'>
     <form>
      <h2 className='text-center mb-4 font-medium'>
       <span className='text-neutral-700 dark:text-neutral-400'>
        {dic.houseControl.nextStep}:
       </span>{' '}
       <span
        className={`text-lg ${getRoomControlStyles(nextStep === 'done' ? 'checkRoom' : nextStep).text}`}
       >
        {dic.houseControl[nextStep]}
       </span>
      </h2>
      <div className='grid gap-4 grid-cols-[repeat(2,10rem)] justify-items-center justify-center mb-6'>
       {roomControlSteps.map((step) => {
        const roomControlStyle = getRoomControlStyles(step.title);
        const stepDetail = roomControlStepDetails[step.title];
        return (
         <Button
          type='button'
          variant='outline'
          className={`relative h-auto flex-col justify-start items-stretch w-40 min-h-40 max-h-none [&_svg:not([class*='size-'])]:size-[unset] p-0 gap-0 ${roomControlStyle.bg} isolate`}
          key={step.title}
          disabled={pendingAction}
          onClick={() => {
           if (step.title !== nextStep) {
            toast.error(
             `${dic.houseControl.nextStep}: ${dic.houseControl[nextStep]}`,
            );
            return;
           }
           setRoomControlStepDetails((pre) => ({
            ...pre,
            [step.title]: {
             ...pre[step.title],
             isChecked: !pre[step.title].isChecked,
            },
           }));
          }}
         >
          <div className='absolute bottom-0 end-0 -z-1'>
           <MdTouchApp className='size-18 text-neutral-200/60 dark:text-neutral-800' />
          </div>
          <h3
           className={`font-medium text-base p-1 py-3 ${roomControlStyle.text}`}
          >
           {dic.houseControl[step.title]}
          </h3>
          <div className='grow grid place-content-center'>
           {roomControlIsLoading && (
            <Spinner className={`size-12 ${roomControlStyle.text}`} />
           )}
           {stepDetail.isChecked && (
            <FaCheck className={`size-12 ${roomControlStyle.text}`} />
           )}
          </div>
          <div className='p-1'>
           <p className='text-xs text-neutral-500'>
            {stepDetail.isChecked && (
             <>
              <span className='ps-2'>
               {stepDetail.date
                ? new Date(stepDetail.date).toLocaleTimeString(locale, {
                   hour: '2-digit',
                   minute: '2-digit',
                  })
                : ''}
              </span>
              <span className='ps-2'>
               {stepDetail.date
                ? new Date(stepDetail.date).toLocaleDateString(locale)
                : ''}
              </span>
             </>
            )}
           </p>
           {stepDetail.fullName && (
            <p className='text-sm text-neutral-600 dark:text-neutral-600 whitespace-normal'>
             {stepDetail.fullName}
            </p>
           )}
          </div>
         </Button>
        );
       })}
      </div>
      {nextStep === 'done' && (
       <Field className='gap-2 mb-4'>
        <FieldLabel htmlFor='houseMaidDescription'>
         {dic.houseControl.houseMaidDescription}
        </FieldLabel>
        <InputGroup>
         <InputGroupTextarea
          id='houseMaidDescription'
          value={maidComment}
          onChange={(e) => {
           setMaidComment(e.target.value);
          }}
         />
        </InputGroup>
       </Field>
      )}
      <div className='flex justify-between gap-4 flex-wrap flex-col-reverse md:flex-row'>
       <div className='grid grid-cols-2 md:flex gap-2'>
        <Dialog>
         <DialogTrigger asChild>
          <Button
           variant='outline'
           size='lg'
           className='md:w-24 text-destructive border-destructive'
           type='button'
           disabled={pendingAction || nextStep === 'alert'}
          >
           {pendingAction && <Spinner />}
           {dic.houseControl.clear}
          </Button>
         </DialogTrigger>
         <DialogContent className='p-0 gap-0'>
          <DialogHeader className='p-4'>
           <DialogTitle className='hidden'>
            {dic.houseControl.confirmClearMessage}
           </DialogTitle>
          </DialogHeader>
          <div className='p-4'>
           <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
            <BiError className='size-12' />
            <p>{dic.houseControl.confirmClearMessage}</p>
           </div>
          </div>
          <DialogFooter className='p-4'>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='outline'
             disabled={pendingAction}
            >
             {pendingAction && <Spinner />}
             {dic.houseControl.cancel}
            </Button>
           </DialogClose>
           <DialogClose asChild>
            <Button
             className='sm:w-24'
             variant='destructive'
             disabled={pendingAction}
             onClick={() => clearRoomControlMutate()}
            >
             {pendingAction && <Spinner />}
             {dic.houseControl.confirm}
            </Button>
           </DialogClose>
          </DialogFooter>
         </DialogContent>
        </Dialog>
        <Dialog>
         <DialogTrigger asChild>
          <Button
           size='lg'
           variant='outline'
           className='md:w-24 text-secondary border-secondary'
           type='button'
           disabled={pendingAction || roomControlHistoryIsLoading}
          >
           {(pendingAction || roomControlHistoryIsLoading) && <Spinner />}
           {dic.houseControl.history}
           <Badge variant='secondary'>{roomControlHistory?.length}</Badge>
          </Button>
         </DialogTrigger>
         <DialogContent className='flex flex-col w-[min(95%,60rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
          <DialogHeader className='p-4 border-b border-input'>
           <DialogHeader>
            <DialogTitle className='text-lg'>
             {dic.houseControl.history} {dic.houseControl.title}{' '}
             <span className='font-en-roboto'>{room.roomLabel}</span>
            </DialogTitle>
           </DialogHeader>
          </DialogHeader>
          {roomControlHistoryIsFetching && <LinearLoading />}
          <div className='p-4 grow overflow-auto'>
           <RoomControlHistory
            dic={dic}
            data={roomControlHistory}
            isFetching={roomControlHistoryIsFetching}
            isLoading={roomControlHistoryIsLoading}
            isSuccess={roomControlHistoryIsSuccess}
            isError={roomControlHistoryIsError}
           />
          </div>
         </DialogContent>
        </Dialog>
       </div>
       <div className='grid grid-cols-2 md:flex gap-2'>
        <Button
         variant='outline'
         size='lg'
         className='md:w-28'
         type='button'
         disabled={pendingAction}
         onClick={() => onChangeOpen(false)}
        >
         {pendingAction && <Spinner />}
         {dic.houseControl.cancel}
        </Button>
        <Button
         size='lg'
         className='md:w-28'
         type='button'
         disabled={pendingAction}
         onClick={() => saveRoomControlMutate()}
        >
         {pendingAction && <Spinner />}
         {dic.houseControl.confirm}
        </Button>
       </div>
      </div>
     </form>
    </div>
   </DialogContent>
  </Dialog>
 );
}
