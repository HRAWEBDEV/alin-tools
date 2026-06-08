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
 return {
  houseControl: getRackHouseControlReport(rooms),
  notes: getRackNotesReport(rooms),
  birthDays: getRackBirthdayReport(rooms),
 };
}

export { getRackHouseControlReport, getRackNotesReport, getRackReport };
