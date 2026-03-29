import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 type Rack,
 changeRoomStateKind,
} from '../../services/roomsRackApiActions';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { MdTouchApp } from 'react-icons/md';
import {
 RoomStateKind as RoomStateKindEnum,
 roomStateKinds,
 getRackStatesStyles,
} from '../../utils/rackStates';
import { getStateKindIcon } from '../../utils/rackStatesIcon';
import { ReadyToServiceRoomIcon } from '../../../components/icons/ReadyToServiceRoomIcon';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function RoomStateKind({
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
 const { mutate, isPending } = useMutation({
  mutationFn(kind: RoomStateKindEnum) {
   return changeRoomStateKind({
    date: room.dateDateTimeOffset,
    roomID: room.roomID,
    stateKind: kind,
   });
  },
  onSuccess() {
   onSuccess();
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return (
  <Dialog open={open} onOpenChange={onChangeOpen}>
   <DialogContent className='gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>{dic.roomGuests.title}</DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-4 grow overflow-auto'>
     <p className='text-center mb-4'>
      <span>
       {dic.roomStateKind.currentStateKind} {room.roomLabel}:{' '}
      </span>
      <span
       className={`${
        getRackStatesStyles().get(
         RoomStateKindEnum[
          room.roomStateKindID
         ] as (typeof roomStateKinds)[number],
        )?.text
       } font-medium text-lg`}
      >
       {
        dic.help[
         RoomStateKindEnum[
          room.roomStateKindID
         ] as (typeof roomStateKinds)[number]
        ]
       }
      </span>
     </p>
     <div>
      <div className='flex gap-4 justify-center flex-wrap'>
       {roomStateKinds.map((kind) => {
        const stateKindStyle = getRackStatesStyles().get(kind);
        return (
         <>
          {kind === 'transferGuest' || kind === 'outOfService' ? null : (
           <Button
            key={kind}
            variant='outline'
            disabled={isPending}
            className={`relative h-auto w-auto flex-col size-48 max-h-none [&_svg:not([class*='size-'])]:size-[unset] ${stateKindStyle?.backgoundColor}`}
            onClick={() => {
             if (RoomStateKindEnum[kind] === room.roomStateKindID) {
              onSuccess();
              return;
             }
             mutate(RoomStateKindEnum[kind]);
            }}
           >
            <div className='absolute bottom-0 end-0 z-0'>
             <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
            </div>
            <div
             className={`flex flex-col items-center z-1 gap-2 ${stateKindStyle?.text}`}
            >
             <div dir='ltr'>
              {isPending ? (
               <Spinner className='size-20' />
              ) : kind === 'readyToService' ? (
               <ReadyToServiceRoomIcon
                width='5rem'
                height='5rem'
                fontSize='5rem'
                fill='currentColor'
               />
              ) : (
               getStateKindIcon(RoomStateKindEnum[kind], {
                width: '5rem',
                height: '5rem',
                fontSize: '5rem',
                fill: 'currentColor',
               })
              )}
             </div>
             <span className='text-base font-medium'>{dic.help[kind]}</span>
            </div>
           </Button>
          )}
         </>
        );
       })}
      </div>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
