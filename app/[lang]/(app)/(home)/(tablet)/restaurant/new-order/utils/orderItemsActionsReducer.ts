import {
 type OrderItem,
 type ItemProgram,
} from '../services/newOrderApiActions';

type OrderItemActions =
 | { type: 'insertOrderItems'; payload: OrderItem[] }
 | {
    type: 'addOrderItems';
    payload: ItemProgram[];
   }
 | {
    type: 'removeOrderItems';
    payload: ItemProgram['itemID'][];
   }
 | {
    type: 'increaseOrderItemsAmount';
    payload: {
     itemsIDs: ItemProgram['itemID'][];
     increaseBy: number;
    };
   }
 | {
    type: 'decreaseOrderItemsAmount';
    payload: {
     itemsIDs: ItemProgram['itemID'][];
     decreaseBy: number;
    };
   };

function removeOrderItems(
 orderItems: OrderItem[],
 action: {
  type: 'removeOrderItems';
  payload: ItemProgram['itemID'][];
 },
): OrderItem[] {
 return orderItems.filter((order) => !action.payload.includes(order.itemID));
}

function orderItemsReducer(state: OrderItem[], action: OrderItemActions) {
 switch (action.type) {
  // insert bulk
  case 'insertOrderItems':
   return action.payload;
  // add
  case 'addOrderItems':
   return [
    ...state,
    action.payload.map((item) => {
     const newOrder: OrderItem = {
      id: 0,
      orderID: 0,
      amount: 1,
      discount: 0,
      discountRate: 0,
      itemCode: item.itemCode,
      itemName: item.itemName || '',
      itemID: item.itemID,
      netValue: 0,
      price: item.price,
      sValue: 0,
      service: 0,
      serviceRate: 0,
      tagID: 0,
      tax: 0,
      taxRate: 0,
      tagComment: '',
     };
     return newOrder;
    }),
   ];
  // remove
  case 'removeOrderItems':
   return removeOrderItems(state, action);
  // increase
  case 'increaseOrderItemsAmount':
   return state.map((order) => {
    if (action.payload.itemsIDs.includes(order.itemID)) {
     const newAmount = order.amount + action.payload.increaseBy;
     // TODO should calculate prices
     return {
      ...order,
      amount: newAmount,
     };
    }
    return order;
   });
  // decreaseOrderItemsAmount
  case 'decreaseOrderItemsAmount':
   const mustRemoveOrderIDs: number[] = [];
   const newOrderItems = state.map((order) => {
    if (action.payload.itemsIDs.includes(order.itemID)) {
     const newAmount = order.amount - action.payload.decreaseBy;
     if (newAmount > 0) {
      // TODO should calculate prices
      return {
       ...order,
       amount: newAmount,
      };
     }
     mustRemoveOrderIDs.push(order.itemID);
     return order;
    }
    return order;
   });
   return removeOrderItems(newOrderItems, {
    type: 'removeOrderItems',
    payload: mustRemoveOrderIDs,
   });
 }
}

export type { OrderItemActions };
export { orderItemsReducer };
