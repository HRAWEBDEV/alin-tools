import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 type Rack,
 changeRoomStateType,
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
 RoomStateType as RoomStateTypeEnum,
 roomStateTypes,
 getRackStatesStyles,
} from '../../utils/rackStates';
import { getStateTypeIcon } from '../../utils/rackStatesIcon';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function RoomStateType({
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
  mutationFn(typeID: RoomStateTypeEnum) {
   return changeRoomStateType({
    date: room.dateDateTimeOffset,
    roomID: room.roomID,
    stateType: typeID,
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
      <DialogTitle className='text-lg'>{dic.roomStateType.title}</DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-4 grow overflow-auto'>
     <p className='text-center mb-4'>
      <span>
       {dic.roomStateType.currentStateKind} {room.roomLabel}:{' '}
      </span>
      <span className=' font-medium text-lg'>
       {
        dic.help[
         RoomStateTypeEnum[
          room.roomStateTypeID
         ] as (typeof roomStateTypes)[number]
        ]
       }
      </span>
     </p>
     <div>
      <div className='flex gap-4 justify-center flex-wrap'>
       {roomStateTypes.map((type) => {
        const roomStateTypeStyle = getRackStatesStyles().get(
         type === 'waitForCheckin' ? 'waitForCheckin' : 'none',
        );
        return (
         <>
          {type !== 'default' && type !== 'waitForCheckin' ? null : (
           <Button
            key={type}
            variant='outline'
            disabled={isPending}
            className={`relative h-auto w-auto flex-col size-48 max-h-none [&_svg:not([class*='size-'])]:size-[unset] ${roomStateTypeStyle?.backgoundColor}`}
            onClick={() => {
             if (RoomStateTypeEnum[type] === room.roomStateTypeID) {
              onSuccess();
              return;
             }
             mutate(RoomStateTypeEnum[type]);
            }}
           >
            <div className='absolute bottom-0 end-0 z-0'>
             <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
            </div>
            <div
             className={`flex flex-col items-center z-1 gap-2 ${roomStateTypeStyle?.text}`}
            >
             <div dir='ltr'>
              {isPending ? (
               <Spinner className='size-16' />
              ) : (
               getStateTypeIcon(RoomStateTypeEnum[type], {
                width: '4rem',
                height: '4rem',
                fontSize: '4rem',
                fill: 'currentColor',
               })
              )}
             </div>
             <span className='text-base font-medium'>{dic.help[type]}</span>
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
