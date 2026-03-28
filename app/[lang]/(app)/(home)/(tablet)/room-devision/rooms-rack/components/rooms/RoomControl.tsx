import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type Rack } from '../../services/roomsRackApiActions';
import {
 Dialog,
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
 roomControlBaseKey,
 getRoomControl,
 getRoomControls,
 saveRoomControl,
} from '../../services/room-control/roomControlApiActions';
import { useQuery, useMutation } from '@tanstack/react-query';

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
 const { locale } = useBaseConfig();

 // room control
 const { data: roomControl, isLoading: roomControlIsLoading } = useQuery({
  queryKey: [roomControlBaseKey, 'room', room.roomID.toString()],
  async queryFn({ signal }) {
   const res = await getRoomControl({
    roomID: room.roomID,
    signal,
   });
   return res.data;
  },
 });

 // room controls
 const { data: roomControls } = useQuery({
  queryKey: [roomControlBaseKey, 'rooms'],
  async queryFn({ signal }) {
   const res = await getRoomControls({
    signal,
   });
   return res.data;
  },
 });

 // save room control
 const { mutate } = useMutation({
  mutationFn() {
   return saveRoomControl(room.roomID, room.registerID!);
  },
 });

 return (
  <Dialog open={open} onOpenChange={onChangeOpen}>
   <DialogContent className='gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {dic.houseControl.title}{' '}
       <span className='font-en-roboto'>{room.roomLabel}</span>
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-4 grow overflow-auto'>
     <form>
      <h2 className='text-center mb-4 font-medium'>
       <span className='text-neutral-700 dark:text-neutral-400'>
        {dic.houseControl.roomStatus}:{' '}
       </span>
       <span className='text-lg'></span>
      </h2>
      <div className='grid gap-4 grid-cols-[repeat(2,10rem)] justify-items-center justify-center mb-6'>
       {roomControlSteps.map((step) => {
        const roomControlStyle = getRoomControlStyles(step.title);
        return (
         <Button
          type='button'
          variant='outline'
          className={`relative h-auto flex-col justify-start items-stretch w-40 min-h-40 max-h-none [&_svg:not([class*='size-'])]:size-[unset] p-0 gap-0 ${roomControlStyle.bg} isolate`}
          key={step.title}
          disabled={roomControlIsLoading}
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
           {/*<FaCheck className={`size-12 ${roomControlStyle.text}`} />*/}
          </div>
          <div className='p-1'>
           <p className='text-xs text-neutral-500'>
            {false && (
             <>
              <span className='ps-2'>
               {new Date().toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
               })}
              </span>
              <span>{new Date().toLocaleDateString(locale)}</span>
             </>
            )}
           </p>
           {false && (
            <p className='text-sm text-neutral-600 dark:text-neutral-600 whitespace-normal'>
             حمیدرضا حمیدرضا
            </p>
           )}
          </div>
         </Button>
        );
       })}
      </div>
      <Field className='gap-2 mb-4'>
       <FieldLabel htmlFor='houseMaidDescription'>
        {dic.houseControl.houseMaidDescription}
       </FieldLabel>
       <InputGroup>
        <InputGroupTextarea />
       </InputGroup>
      </Field>
      <div className='flex justify-between gap-4 flex-wrap flex-col-reverse md:flex-row'>
       <div className='grid grid-cols-2 md:flex gap-2'>
        <Button
         variant='outline'
         size='lg'
         className='md:w-24 text-destructive border-destructive'
         type='button'
         disabled={roomControlIsLoading}
        >
         {roomControlIsLoading && <Spinner />}
         {dic.houseControl.clear}
        </Button>
        <Button
         size='lg'
         variant='outline'
         className='md:w-24 text-secondary border-secondary'
         type='button'
         disabled={roomControlIsLoading}
        >
         {roomControlIsLoading && <Spinner />}
         {dic.houseControl.history}
        </Button>
       </div>
       <div className='grid grid-cols-2 md:flex gap-2'>
        <Button
         variant='outline'
         size='lg'
         className='md:w-28'
         type='button'
         disabled={roomControlIsLoading}
         onClick={() => onChangeOpen(false)}
        >
         {roomControlIsLoading && <Spinner />}
         {dic.houseControl.cancel}
        </Button>
        <Button
         size='lg'
         className='md:w-28'
         type='button'
         disabled={roomControlIsLoading}
         onClick={() => mutate()}
        >
         {roomControlIsLoading && <Spinner />}
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
