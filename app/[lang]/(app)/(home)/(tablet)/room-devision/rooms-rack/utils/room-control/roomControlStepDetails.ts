import {
 type RoomControlStepDetails,
 type RoomControl,
 RoomControlStep,
} from '../../services/room-control/roomControlApiActions';

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

function getRoomControlStepDetails(
 roomControl?: RoomControl,
): RoomControlStepDetails {
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
}

function getNextStep(stepDetails: RoomControlStepDetails) {
 return (Object.keys(stepDetails).find((key) => {
  const val = stepDetails[key as RoomControlStep];
  return !val.isChecked;
 }) || 'done') as RoomControlStep | 'done';
}
function getActiveStep(stepDetails: RoomControlStepDetails) {
 return Object.keys(stepDetails).findLast((key) => {
  const val = stepDetails[key as RoomControlStep];
  return val.isChecked;
 }) as RoomControlStep;
}

export {
 roomControlStepDetailDefaults,
 getRoomControlStepDetails,
 getNextStep,
 getActiveStep,
};
