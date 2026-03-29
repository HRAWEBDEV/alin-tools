import { SVGProps } from 'react';
import {
 RoomInOutState,
 RoomStateKind,
 RoomStateType,
 RoomState,
} from './rackStates';
import { Reserve } from '../../components/icons/Reserve';
import { UserLock } from 'lucide-react';
import { User } from '../../components/icons/User';
import { DayUseIcon } from '../../components/icons/DayUseIcon';
import { Room as RoomIcon } from '../../components/icons/Room';
import { Checkin } from '../../components/icons/Chekin';
import { Checkout } from '../../components/icons/Checkout';
import { QCRoomIcon } from '../../components/icons/QCRoomIcon';
import { CleanRoomIcon } from '../../components/icons/CleanRoomIcon';
import { ServiceRoomIcon } from '../../components/icons/ServiceRoomIcon';
import {
 FaRegClipboard,
 FaIdBadge,
 FaRegArrowAltCircleRight,
 FaLock,
} from 'react-icons/fa';
import { WaitForCheckin } from '../../components/icons/WaitForCheckin';
import { WaitForBook } from '../../components/icons/WaitForBook';
import { ClockOutliend } from '../../components/icons/ClockOutliend';
import { CheckHousekeeping } from '../../components/icons/CheckHousekeeping';
import { DND } from '../../components/icons/DND';
import { SleptOut } from '../../components/icons/SleptOut';
import { NoLuggage } from '../../components/icons/NoLuggage';
import { LightLuggage } from '../../components/icons/LightLuggage';
import { NoShow } from '../../components/icons/NoShow';

function getRoomStateIcon(
 type: RoomState,
 style: SVGProps<SVGSVGElement> = {},
) {
 switch (type) {
  case 'emptyRoom':
   return <RoomIcon {...style} />;
  case 'closedRoom':
   return <UserLock {...style} />;
  case 'dayUse':
   return <DayUseIcon {...style} />;
  case 'occupiedCustomerRoom':
   return <User {...style} />;
  case 'occupiedRoom':
   return <User {...style} />;
  case 'reservedRoom':
   return <Reserve {...style} />;
  case 'waitForCheckin':
   return <WaitForCheckin {...style} />;
 }
}

function getRoomInOutIcon(
 type: RoomInOutState,
 style: SVGProps<SVGSVGElement> = {},
) {
 switch (type) {
  case RoomInOutState.todayCheckin:
   return <Checkin {...style} />;
  case RoomInOutState.todayWaitForCheckin:
   return <Checkin {...style} />;
  case RoomInOutState.todayCheckout:
   return <Checkout {...style} />;
  case RoomInOutState.todayWaitForCheckout:
   return <Checkout {...style} />;
  case RoomInOutState.overStay:
   return <ClockOutliend {...style} />;
 }
}

function getStateKindIcon(
 type: RoomStateKind,
 style: SVGProps<SVGSVGElement> = {},
) {
 switch (type) {
  case RoomStateKind.readyToService:
   return null;
  case RoomStateKind.waitingForQC:
   return <QCRoomIcon {...style} />;
  case RoomStateKind.notCleaned:
   return <CleanRoomIcon {...style} />;
  case RoomStateKind.outOfService:
   return <ServiceRoomIcon {...style} />;
  case RoomStateKind.transferGuest:
   return <FaRegArrowAltCircleRight {...style} />;
 }
}

function getStateTypeIcon(
 type: RoomStateType,
 style: SVGProps<SVGSVGElement> = {},
) {
 switch (type) {
  case RoomStateType.default:
   return <FaRegClipboard {...style} />;
  case RoomStateType.waitForCheckin:
   return <WaitForCheckin {...style} />;
  case RoomStateType.waitForBooking:
   return <WaitForBook {...style} />;
  case RoomStateType.checkHouseKeeper:
   return <CheckHousekeeping {...style} />;
  case RoomStateType.checkHouseKeeper:
   return <CheckHousekeeping {...style} />;
  case RoomStateType.houseUse:
   return <FaIdBadge {...style} />;
  case RoomStateType.DND:
   return <DND {...style} />;
  case RoomStateType.noLuggage:
   return <NoLuggage {...style} />;
  case RoomStateType.lightLuggage:
   return <LightLuggage {...style} />;
  case RoomStateType.noShow:
   return <NoShow {...style} />;
  case RoomStateType.locked:
   return <FaLock {...style} />;
  case RoomStateType.sleptOut:
   return <SleptOut {...style} />;
 }
}

export {
 getRoomInOutIcon,
 getStateKindIcon,
 getStateTypeIcon,
 getRoomStateIcon,
};
