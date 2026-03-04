import { SVGProps } from 'react';
import { RoomInOutState, RoomStateKind, RoomStateType } from './rackStates';
import { Checkin } from '../../components/icons/Chekin';
import { Checkout } from '../../components/icons/Checkout';

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
 }
}

function getStateKindIcon(
 type: RoomStateKind,
 style: SVGProps<SVGSVGElement> = {},
) {}

function getStateTypeIcon(
 type: RoomStateType,
 style: SVGProps<SVGSVGElement> = {},
) {}

export { getRoomInOutIcon, getStateKindIcon, getStateTypeIcon };
