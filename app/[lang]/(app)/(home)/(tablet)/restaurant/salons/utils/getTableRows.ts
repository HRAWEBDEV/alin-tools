type Row = {
 id: number;
 seats: number;
 occupiedSeats: number;
};

function getTableRows(capacity: number, occupied: number): Row[] {
 if (!capacity || capacity > 12) return [];
 const rowsCount = Math.ceil(capacity / 2);
 const fullSeats = capacity % 2 === 0;
 const rows: Row[] = [];

 Array.from({ length: rowsCount }, (_, i) => i + 1).forEach((row) => {
  rows.push({
   id: row,
   seats: row === rowsCount ? (fullSeats ? 2 : 1) : 2,
   occupiedSeats: row * 2 - 1 <= occupied ? (row * 2 <= occupied ? 2 : 1) : 0,
  });
 });

 return rows;
}

export { getTableRows };
