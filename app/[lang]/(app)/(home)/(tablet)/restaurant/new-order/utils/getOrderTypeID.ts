import { SaleTypes } from './saleTypes';

const getOrderTypeID = ({
 tableID,
 saleTypeID,
}: {
 tableID: string | null;
 saleTypeID: string | null;
}) => {
 if (tableID) return 2;
 if (saleTypeID == SaleTypes.room) return 6;
 if (saleTypeID == SaleTypes.delivery) return 3;
 return 1;
};

export { getOrderTypeID };
