import { type Rack } from '../services/roomsRackApiActions';

function getRackHouseControlReport(rooms: Rack[]) {
 return rooms.filter((item) => item.hkStateID);
}
function getRackNotesReport(rooms: Rack[]) {
 return rooms.filter((item) => item.msgFlag);
}
function getRackBirthdayReport(rooms: Rack[]) {
 return rooms.filter((item) => item.bithday);
}

function getRackReport(rooms: Rack[]) {
 return rooms.reduce(
  (acc, cur) => {
   let { birthDays, houseControl, notes } = acc;
   if (cur.msgFlag) {
    notes = [...notes, cur];
   }
   if (cur.hkStateID) {
    houseControl = [...houseControl, cur];
   }
   if (cur.bithday) {
    birthDays = [...birthDays, cur];
   }
   return {
    houseControl,
    notes,
    birthDays,
   };
  },
  {
   houseControl: [] as Rack[],
   notes: [] as Rack[],
   birthDays: [] as Rack[],
  },
 );
}

export {
 getRackHouseControlReport,
 getRackNotesReport,
 getRackBirthdayReport,
 getRackReport,
};
